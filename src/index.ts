import { Hono } from "hono";
import { handleVlessWebSocket, renderCamouflageResponse } from "./core";

export interface Env {
  DB: D1Database;
  WS_PATH?: string;
  PANEL_PATH?: string;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
}

const app = new Hono<{ Bindings: Env }>();

// VLESS WebSocket Proxy endpoint
app.all("*", async (c, next) => {
  const wsPath = c.env.WS_PATH || "/api/v1/ws";
  const url = new URL(c.req.url);

  if (url.pathname === wsPath) {
    const upgrade = c.req.header("Upgrade");
    if (!upgrade || upgrade.toLowerCase() !== "websocket") {
      return renderCamouflageResponse();
    }
    const ctx = {
      waitUntil: (promise: Promise<unknown>) => {
        try {
          c.executionCtx.waitUntil(promise);
        } catch {
          promise.catch((err) => console.error("Unhandled async task:", err));
        }
      },
    };
    return handleVlessWebSocket(c.req.raw, c.env, ctx);
  }

  await next();
});

// Default fallback to camouflage landing page
app.get("/", () => {
  return renderCamouflageResponse();
});

export default app;
