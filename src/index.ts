import { Hono } from "hono";

export interface Env {
  DB: D1Database;
  WS_PATH?: string;
  PANEL_PATH?: string;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.text("Lumen Edge");
});

export default app;
