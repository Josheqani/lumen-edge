import { beforeEach, describe, expect, it } from "bun:test";
import app, { type Env } from "../src/index";
import { createTestD1 } from "./mock-d1";

describe("Panel API Endpoints", () => {
  let env: Env;
  let authCookie = "";

  beforeEach(async () => {
    env = {
      DB: createTestD1(),
      ADMIN_USERNAME: "testadmin",
      ADMIN_PASSWORD: "testpassword123",
      SESSION_SECRET: "super-secure-session-secret-for-tests-32b",
      WS_PATH: "/api/v1/ws",
    };

    // Perform login to get session cookie
    const loginRes = await app.fetch(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "testadmin",
          password: "testpassword123",
        }),
      }),
      env
    );

    const setCookie = loginRes.headers.get("Set-Cookie");
    if (setCookie) {
      authCookie = setCookie.split(";")[0]!;
    }
  });

  it("should fail login with incorrect password", async () => {
    const res = await app.fetch(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "testadmin",
          password: "wrongpassword",
        }),
      }),
      env
    );
    expect(res.status).toBe(401);
  });

  it("should reject unauthenticated request to /api/users", async () => {
    const res = await app.fetch(
      new Request("http://localhost/api/users", {
        method: "GET",
      }),
      env
    );
    expect(res.status).toBe(401);
  });

  it("should allow authenticated request to /api/users", async () => {
    const res = await app.fetch(
      new Request("http://localhost/api/users", {
        method: "GET",
        headers: { Cookie: authCookie },
      }),
      env
    );
    expect(res.status).toBe(200);
    const data = (await res.json()) as { users: unknown[]; total: number };
    expect(Array.isArray(data.users)).toBe(true);
    expect(data.total).toBe(0);
  });

  it("should perform full CRUD operations on users", async () => {
    // 1. Create User
    const createRes = await app.fetch(
      new Request("http://localhost/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: authCookie,
        },
        body: JSON.stringify({
          name: "Alice",
          quota_bytes: 10 * 1024 * 1024 * 1024, // 10 GB
          note: "Family member",
        }),
      }),
      env
    );
    expect(createRes.status).toBe(201);
    const created = (await createRes.json()) as {
      id: number;
      name: string;
      uuid: string;
      sub_token: string;
      quota_bytes: number;
      is_active: boolean;
    };
    expect(created.id).toBeGreaterThan(0);
    expect(created.name).toBe("Alice");
    expect(created.quota_bytes).toBe(10 * 1024 * 1024 * 1024);
    expect(created.is_active).toBe(true);

    const userId = created.id;

    // 2. Get User & Links
    const getRes = await app.fetch(
      new Request(`http://localhost/api/users/${userId}`, {
        method: "GET",
        headers: { Cookie: authCookie },
      }),
      env
    );
    expect(getRes.status).toBe(200);
    const getData = (await getRes.json()) as {
      user: { id: number; name: string };
      links: { label: string; url: string }[];
    };
    expect(getData.user.id).toBe(userId);
    expect(getData.links.length).toBeGreaterThan(0);
    expect(getData.links[0]?.url).toContain("vless://");

    // 3. Update User
    const updateRes = await app.fetch(
      new Request(`http://localhost/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: authCookie,
        },
        body: JSON.stringify({
          name: "Alice Updated",
          enabled: false,
        }),
      }),
      env
    );
    expect(updateRes.status).toBe(200);
    const updated = (await updateRes.json()) as { name: string; enabled: boolean };
    expect(updated.name).toBe("Alice Updated");
    expect(updated.enabled).toBe(false);

    // 4. Regenerate UUID
    const oldUuid = created.uuid;
    const regenUuidRes = await app.fetch(
      new Request(`http://localhost/api/users/${userId}/regen-uuid`, {
        method: "POST",
        headers: { Cookie: authCookie },
      }),
      env
    );
    expect(regenUuidRes.status).toBe(200);
    const withNewUuid = (await regenUuidRes.json()) as { uuid: string };
    expect(withNewUuid.uuid).not.toBe(oldUuid);

    // 5. Delete User
    const deleteRes = await app.fetch(
      new Request(`http://localhost/api/users/${userId}`, {
        method: "DELETE",
        headers: { Cookie: authCookie },
      }),
      env
    );
    expect(deleteRes.status).toBe(200);

    // 6. Verify Deleted
    const verifyRes = await app.fetch(
      new Request(`http://localhost/api/users/${userId}`, {
        method: "GET",
        headers: { Cookie: authCookie },
      }),
      env
    );
    expect(verifyRes.status).toBe(404);
  });

  it("should get and update settings", async () => {
    // 1. Get settings
    const getRes = await app.fetch(
      new Request("http://localhost/api/settings", {
        headers: { Cookie: authCookie },
      }),
      env
    );
    expect(getRes.status).toBe(200);
    const settings = (await getRes.json()) as { outbound_mode: string };
    expect(settings.outbound_mode).toBe("direct");

    // 2. Update settings
    const putRes = await app.fetch(
      new Request("http://localhost/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: authCookie,
        },
        body: JSON.stringify({
          outbound_mode: "socks5",
          socks5_config: { host: "127.0.0.1", port: 1080 },
          endpoints: [
            {
              label: "MCI Clean IP",
              address: "104.16.1.1",
              port: 443,
              sni: "worker.example.com",
              host: "worker.example.com",
            },
          ],
        }),
      }),
      env
    );
    expect(putRes.status).toBe(200);
    const putData = (await putRes.json()) as {
      success: boolean;
      settings: { outbound_mode: string; endpoints: unknown[] };
    };
    expect(putData.success).toBe(true);
    expect(putData.settings.outbound_mode).toBe("socks5");
    expect(putData.settings.endpoints.length).toBe(1);
  });
});
