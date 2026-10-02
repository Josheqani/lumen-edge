import { Hono } from "hono";
import { handleVlessWebSocket, renderCamouflageResponse } from "./core";
import { api, renderPanelHtml } from "./panel";

export interface Env {
  DB: D1Database;
  WS_PATH?: string;
  PANEL_PATH?: string;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
}

const app = new Hono<{ Bindings: Env }>();

// 1. VLESS WebSocket Proxy endpoint
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

// 2. Panel Admin UI (served from configurable PANEL_PATH)
app.get("*", async (c, next) => {
  const panelPath = c.env.PANEL_PATH || "/_panel";
  const url = new URL(c.req.url);

  if (url.pathname === panelPath || url.pathname === `${panelPath}/`) {
    const wsPath = c.env.WS_PATH || "/api/v1/ws";
    const html = renderPanelHtml(panelPath, wsPath);
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  await next();
});

// 3. Panel API endpoints (/api/*)
app.route("/", api);

// 4. Default fallback to camouflage landing page on root or unhandled routes
app.get("/", () => {
  return renderCamouflageResponse();
});

export default app;
