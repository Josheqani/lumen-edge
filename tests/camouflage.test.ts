import { describe, expect, it } from "bun:test";
import { renderCamouflageResponse } from "../src/core/camouflage";
import app from "../src/index";

describe("Camouflage & HTTP Guard", () => {
  it("should return 200 with HTML content", async () => {
    const res = renderCamouflageResponse();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    const text = await res.text();
    expect(text).toContain("Global Edge Dispatcher");
    expect(text).not.toContain("vless");
    expect(text).not.toContain("proxy");
  });

  it("should return camouflage for non-websocket GET request to WS_PATH", async () => {
    const mockDb = {} as D1Database;
    const req = new Request("http://localhost/api/v1/ws", {
      method: "GET",
    });

    const res = await app.fetch(req, {
      DB: mockDb,
      WS_PATH: "/api/v1/ws",
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    const text = await res.text();
    expect(text).toContain("Global Edge Dispatcher");
  });
});
