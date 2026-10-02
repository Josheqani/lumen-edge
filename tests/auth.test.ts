import { describe, expect, it } from "bun:test";
import {
  checkLoginRateLimit,
  constantTimeCompare,
  createSessionToken,
  recordLoginFailure,
  recordLoginSuccess,
  timingSafeEqual,
  verifySessionToken,
} from "../src/panel/auth";

describe("Panel Auth & Security", () => {
  const secret = "test-session-secret-key-32-chars-long!";

  it("should create and verify valid session token", async () => {
    const token = await createSessionToken("admin", secret, 3600);
    expect(typeof token).toBe("string");

    const payload = await verifySessionToken(token, secret);
    expect(payload).not.toBeNull();
    expect(payload?.u).toBe("admin");
    expect(payload?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it("should reject tampered session token", async () => {
    const token = await createSessionToken("admin", secret, 3600);
    const tampered = token.slice(0, -4) + "abcd";
    const payload = await verifySessionToken(tampered, secret);
    expect(payload).toBeNull();
  });

  it("should reject token with wrong secret", async () => {
    const token = await createSessionToken("admin", secret, 3600);
    const payload = await verifySessionToken(token, "wrong-secret-key");
    expect(payload).toBeNull();
  });

  it("should constant-time compare strings", async () => {
    expect(await constantTimeCompare("secret123", "secret123")).toBe(true);
    expect(await constantTimeCompare("secret123", "wrong")).toBe(false);
  });

  it("should enforce login rate limiting after 5 failures", () => {
    const ip = "192.0.2.1";
    recordLoginSuccess(ip); // ensure clean

    for (let i = 0; i < 4; i++) {
      recordLoginFailure(ip);
      expect(checkLoginRateLimit(ip).allowed).toBe(true);
    }

    // 5th failure
    recordLoginFailure(ip);
    const status = checkLoginRateLimit(ip);
    expect(status.allowed).toBe(false);
    expect(status.retryAfterSeconds).toBeGreaterThan(0);

    // After success, it should be cleared
    recordLoginSuccess(ip);
    expect(checkLoginRateLimit(ip).allowed).toBe(true);
  });
});
