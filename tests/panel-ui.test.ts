import { describe, expect, it } from "bun:test";
import app, { type Env } from "../src/index";
import { createTestD1 } from "./mock-d1";

describe("Panel UI Delivery", () => {
  const env: Env = {
    DB: createTestD1(),
    PANEL_PATH: "/custom_admin_path",
    WS_PATH: "/custom_ws",
  };

  it("should serve Panel UI at custom PANEL_PATH", async () => {
    const res = await app.fetch(
      new Request("http://localhost/custom_admin_path"),
      env
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    const html = await res.text();
    expect(html).toContain("Lumen Edge");
    expect(html).toContain("data-theme");
    expect(html).toContain("rtl");
    expect(html).toContain("qr-svg-box");
  });

  it("should serve camouflage on root and not expose panel", async () => {
    const res = await app.fetch(new Request("http://localhost/"), env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Global Edge Dispatcher");
    expect(html).not.toContain("Lumen Edge");
  });
});
