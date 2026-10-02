export interface SessionPayload {
  u: string;
  exp: number; // Unix timestamp in seconds
}

export async function timingSafeEqual(
  a: Uint8Array,
  b: Uint8Array
): Promise<boolean> {
  if (a.byteLength !== b.byteLength) return false;
  let diff = 0;
  for (let i = 0; i < a.byteLength; i++) {
    diff |= a[i]! ^ b[i]!;
  }
  return diff === 0;
}

export async function constantTimeCompare(
  a: string,
  b: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const aBuf = await crypto.subtle.digest("SHA-256", encoder.encode(a));
  const bBuf = await crypto.subtle.digest("SHA-256", encoder.encode(b));
  return timingSafeEqual(new Uint8Array(aBuf), new Uint8Array(bBuf));
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64UrlEncode(data: Uint8Array | string): string {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function createSessionToken(
  username: string,
  secret: string,
  ttlSeconds = 7 * 86400
): Promise<string> {
  const payload: SessionPayload = {
    u: username,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(payloadStr);

  const key = await getHmacKey(secret);
  const sigBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64)
  );
  const sigB64 = base64UrlEncode(new Uint8Array(sigBuf));

  return `${payloadB64}.${sigB64}`;
}

export async function verifySessionToken(
  token: string,
  secret: string
): Promise<SessionPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return null;
  }

  const [payloadB64, sigB64] = parts;
  try {
    const key = await getHmacKey(secret);
    const expectedSig = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(payloadB64)
    );
    const providedSig = base64UrlDecode(sigB64);

    const match = await timingSafeEqual(
      new Uint8Array(expectedSig),
      providedSig
    );
    if (!match) return null;

    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const payload = JSON.parse(payloadJson) as SessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// In-memory brute-force rate limiter for admin login
interface RateLimitEntry {
  attempts: number;
  lockedUntil: number;
  firstFailed: number;
}

const loginRateLimits = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window

export function checkLoginRateLimit(clientIp: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = loginRateLimits.get(clientIp);

  if (!entry) {
    return { allowed: true };
  }

  if (entry.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  if (now - entry.firstFailed > WINDOW_MS) {
    loginRateLimits.delete(clientIp);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordLoginFailure(clientIp: string): void {
  const now = Date.now();
  const entry = loginRateLimits.get(clientIp);

  if (!entry || now - entry.firstFailed > WINDOW_MS) {
    loginRateLimits.set(clientIp, {
      attempts: 1,
      lockedUntil: 0,
      firstFailed: now,
    });
    return;
  }

  entry.attempts++;
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
  }
}

export function recordLoginSuccess(clientIp: string): void {
  loginRateLimits.delete(clientIp);
}
