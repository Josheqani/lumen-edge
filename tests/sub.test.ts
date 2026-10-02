import { describe, expect, it } from "bun:test";
import { saveAllSettings } from "../src/db/settings";
import { createUser, updateUser } from "../src/db/users";
import app, { type Env } from "../src/index";
import { createTestD1 } from "./mock-d1";

describe("Subscription Delivery (Stage 6 & 6b)", () => {
  it("should return base64 vless links for active user with multiple endpoints", async () => {
    const db = createTestD1();
    const env: Env = {
      DB: db,
      WS_PATH: "/custom-ws",
    };

    // Configure 2 custom endpoints
    await saveAllSettings(db, {
      endpoints: [
        {
          label: "MCI Clean IP",
          address: "104.16.1.1",
          port: 443,
          sni: "worker.example.com",
          host: "worker.example.com",
        },
        {
          label: "MTN Irancell",
          address: "104.17.2.2",
          port: 443,
          sni: "worker.example.com",
          host: "worker.example.com",
        },
      ],
    });

    // Create active user
    const user = await createUser(db, {
      name: "Bob",
      quota_bytes: 20 * 1024 * 1024 * 1024,
    });

    const res = await app.fetch(
      new Request(`http://worker.example.com/sub/${user.sub_token}`),
      env
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/plain");
    expect(res.headers.get("subscription-userinfo")).toContain(
      `total=${user.quota_bytes}`
    );

    const b64Body = await res.text();
    const decoded = atob(b64Body);
    const lines = decoded.trim().split("\n");

    expect(lines.length).toBe(2);
    expect(lines[0]).toContain("vless://");
    expect(lines[0]).toContain("104.16.1.1:443");
    expect(lines[0]).toContain("path=%2Fcustom-ws");
    expect(lines[0]).toContain("Bob");
    expect(lines[1]).toContain("104.17.2.2:443");
  });

  it("should support ?raw=1 query param", async () => {
    const db = createTestD1();
    const env: Env = { DB: db };
    const user = await createUser(db, { name: "Charlie" });

    const res = await app.fetch(
      new Request(`http://worker.example.com/sub/${user.sub_token}?raw=1`),
      env
    );

    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body.startsWith("vless://")).toBe(true);
  });

  it("should return camouflage if user is disabled or expired or non-existent", async () => {
    const db = createTestD1();
    const env: Env = { DB: db };

    // 1. Non-existent token
    const resNotFound = await app.fetch(
      new Request("http://localhost/sub/non-existent-token-12345"),
      env
    );
    expect(resNotFound.status).toBe(200);
    expect(resNotFound.headers.get("content-type")).toContain("text/html");
    const htmlNotFound = await resNotFound.text();
    expect(htmlNotFound).toContain("Global Edge Dispatcher");

    // 2. Disabled user
    const user = await createUser(db, { name: "DisabledUser" });
    await updateUser(db, user.id, { enabled: false });

    const resDisabled = await app.fetch(
      new Request(`http://localhost/sub/${user.sub_token}`),
      env
    );
    expect(resDisabled.status).toBe(200);
    expect(resDisabled.headers.get("content-type")).toContain("text/html");
    const htmlDisabled = await resDisabled.text();
    expect(htmlDisabled).toContain("Global Edge Dispatcher");
  });
});
