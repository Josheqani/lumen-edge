import { Hono } from "hono";
import { invalidateActiveUuidsCache } from "../core/cache";
import { getAllSettings, saveAllSettings } from "../db/settings";
import type { AppSettings, EndpointConfig } from "../db/types";
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  regenerateUserSubToken,
  regenerateUserUuid,
  resetUserUsage,
  updateUser,
} from "../db/users";
import {
  checkLoginRateLimit,
  constantTimeCompare,
  createSessionToken,
  recordLoginFailure,
  recordLoginSuccess,
  verifySessionToken,
} from "./auth";
import { generateVlessLinks } from "./links";

export interface PanelEnv {
  DB: D1Database;
  WS_PATH?: string;
  PANEL_PATH?: string;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
}

const COOKIE_NAME = "lumen_session";

function getCookie(req: Request, name: string): string | null {
  const cookieHeader = req.headers.get("Cookie");
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";");
  for (const c of cookies) {
    const [k, v] = c.trim().split("=");
    if (k === name && v) return decodeURIComponent(v);
  }
  return null;
}

function getClientIp(req: Request): string {
  return (
    req.headers.get("CF-Connecting-IP") ||
    req.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "127.0.0.1"
  );
}

const api = new Hono<{ Bindings: PanelEnv }>();

// Auth Middleware for protected /api routes
api.use("/api/*", async (c, next) => {
  const path = c.req.path;
  // Public auth routes
  if (path === "/api/auth/login" || path === "/api/auth/logout") {
    return next();
  }

  const secret = c.env.SESSION_SECRET || "lumen-default-secret-change-me";
  const token = getCookie(c.req.raw, COOKIE_NAME);

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const session = await verifySessionToken(token, secret);
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("jwtPayload" as never, session as never);
  await next();
});

// --- Auth Endpoints ---

api.post("/api/auth/login", async (c) => {
  const clientIp = getClientIp(c.req.raw);
  const rateLimit = checkLoginRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return c.json(
      {
        error: `Too many failed attempts. Try again in ${rateLimit.retryAfterSeconds}s.`,
      },
      429
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const expectedUsername = c.env.ADMIN_USERNAME || "admin";
  const expectedPassword = c.env.ADMIN_PASSWORD || "lumenadmin";
  const sessionSecret =
    c.env.SESSION_SECRET || "lumen-default-secret-change-me";

  const userMatch = await constantTimeCompare(
    body.username || "",
    expectedUsername
  );
  const passMatch = await constantTimeCompare(
    body.password || "",
    expectedPassword
  );

  if (!userMatch || !passMatch) {
    recordLoginFailure(clientIp);
    return c.json({ error: "Invalid username or password" }, 401);
  }

  recordLoginSuccess(clientIp);
  const token = await createSessionToken(expectedUsername, sessionSecret);

  const isHttps = new URL(c.req.url).protocol === "https:";
  const cookieParts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=604800",
  ];
  if (isHttps) {
    cookieParts.push("Secure");
  }

  return c.json(
    { success: true, username: expectedUsername },
    200,
    { "Set-Cookie": cookieParts.join("; ") }
  );
});

api.post("/api/auth/logout", (c) => {
  const isHttps = new URL(c.req.url).protocol === "https:";
  const cookieParts = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
  ];
  if (isHttps) {
    cookieParts.push("Secure");
  }

  return c.json({ success: true }, 200, {
    "Set-Cookie": cookieParts.join("; "),
  });
});

api.get("/api/auth/me", (c) => {
  const expectedUsername = c.env.ADMIN_USERNAME || "admin";
  return c.json({ authenticated: true, username: expectedUsername });
});

// --- Users Endpoints ---

api.get("/api/users", async (c) => {
  const search = c.req.query("search") || undefined;
  const limit = c.req.query("limit") ? Number(c.req.query("limit")) : 50;
  const offset = c.req.query("offset") ? Number(c.req.query("offset")) : 0;

  const result = await listUsers(c.env.DB, { search, limit, offset });
  return c.json(result);
});

api.post("/api/users", async (c) => {
  let body: {
    name?: string;
    quota_bytes?: number;
    expires_at?: number | null;
    note?: string | null;
    enabled?: boolean;
  };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
    return c.json({ error: "User name is required" }, 400);
  }

  try {
    const user = await createUser(c.env.DB, {
      name: body.name.trim(),
      quota_bytes: typeof body.quota_bytes === "number" ? body.quota_bytes : 0,
      expires_at: typeof body.expires_at === "number" ? body.expires_at : null,
      note: typeof body.note === "string" ? body.note.trim() : null,
      enabled: body.enabled !== false,
    });

    invalidateActiveUuidsCache();
    return c.json(user, 201);
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

api.get("/api/users/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid user ID" }, 400);

  const user = await getUserById(c.env.DB, id);
  if (!user) return c.json({ error: "User not found" }, 404);

  const url = new URL(c.req.url);
  const workerHost = url.hostname;
  const wsPath = c.env.WS_PATH || "/api/v1/ws";
  const settings = await getAllSettings(c.env.DB, workerHost);
  const links = generateVlessLinks(user, settings.endpoints, wsPath, workerHost);

  return c.json({ user, links });
});

api.get("/api/users/:id/qr", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid user ID", 400);

  const user = await getUserById(c.env.DB, id);
  if (!user) return c.text("User not found", 404);

  const url = new URL(c.req.url);
  const workerHost = url.hostname;
  const wsPath = c.env.WS_PATH || "/api/v1/ws";
  const settings = await getAllSettings(c.env.DB, workerHost);
  const links = generateVlessLinks(user, settings.endpoints, wsPath, workerHost);

  const linkIndex = parseInt(c.req.query("link_index") || "0") || 0;
  const targetLink = links[linkIndex] || links[0];
  if (!targetLink) return c.text("No links available", 404);

  const { generateQrSvg } = await import("./qrcode");
  const svg = generateQrSvg(targetLink.url, 256);

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "private, max-age=60",
    },
  });
});

api.put("/api/users/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid user ID" }, 400);

  let body: {
    name?: string;
    enabled?: boolean;
    quota_bytes?: number;
    expires_at?: number | null;
    note?: string | null;
  };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const updated = await updateUser(c.env.DB, id, body);
  if (!updated) return c.json({ error: "User not found" }, 404);

  invalidateActiveUuidsCache();
  return c.json(updated);
});

api.post("/api/users/:id/reset", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid user ID" }, 400);

  const updated = await resetUserUsage(c.env.DB, id);
  if (!updated) return c.json({ error: "User not found" }, 404);

  invalidateActiveUuidsCache();
  return c.json(updated);
});

api.post("/api/users/:id/regen-uuid", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid user ID" }, 400);

  const updated = await regenerateUserUuid(c.env.DB, id);
  if (!updated) return c.json({ error: "User not found" }, 404);

  invalidateActiveUuidsCache();
  return c.json(updated);
});

api.post("/api/users/:id/regen-sub", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid user ID" }, 400);

  const updated = await regenerateUserSubToken(c.env.DB, id);
  if (!updated) return c.json({ error: "User not found" }, 404);

  return c.json(updated);
});

api.delete("/api/users/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid user ID" }, 400);

  const ok = await deleteUser(c.env.DB, id);
  if (!ok) return c.json({ error: "User not found" }, 404);

  invalidateActiveUuidsCache();
  return c.json({ success: true });
});

// --- Settings Endpoints ---

api.get("/api/settings", async (c) => {
  const workerHost = new URL(c.req.url).hostname;
  const settings = await getAllSettings(c.env.DB, workerHost);
  return c.json(settings);
});

api.put("/api/settings", async (c) => {
  let body: Partial<AppSettings>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  // Input validation for endpoints
  if (body.endpoints) {
    if (!Array.isArray(body.endpoints)) {
      return c.json({ error: "Endpoints must be an array" }, 400);
    }
    for (const ep of body.endpoints) {
      if (!ep.label || !ep.address || !ep.port) {
        return c.json(
          { error: "Each endpoint must have a label, address, and port" },
          400
        );
      }
    }
  }

  // Validate outbound mode
  if (body.outbound_mode) {
    if (!["direct", "socks5", "backend"].includes(body.outbound_mode)) {
      return c.json({ error: "Invalid outbound_mode" }, 400);
    }
  }

  await saveAllSettings(c.env.DB, body);

  const workerHost = new URL(c.req.url).hostname;
  const updated = await getAllSettings(c.env.DB, workerHost);
  return c.json({ success: true, settings: updated });
});

export { api };
