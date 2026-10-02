import { renderCamouflageResponse } from "../core/camouflage";
import { getAllSettings } from "../db/settings";
import { getUserBySubToken } from "../db/users";
import { generateVlessLinks } from "./links";

export interface SubEnv {
  DB: D1Database;
  WS_PATH?: string;
}

export async function handleSubscription(
  token: string,
  request: Request,
  env: SubEnv
): Promise<Response> {
  if (!token || token.trim().length === 0) {
    return renderCamouflageResponse();
  }

  const user = await getUserBySubToken(env.DB, token.trim());
  if (!user || !user.is_active) {
    // Camouflage fallback if user doesn't exist, is disabled, expired, or over quota
    return renderCamouflageResponse();
  }

  const url = new URL(request.url);
  const workerHost = url.hostname;
  const wsPath = env.WS_PATH || "/api/v1/ws";

  const settings = await getAllSettings(env.DB, workerHost);
  const links = generateVlessLinks(user, settings.endpoints, wsPath, workerHost);
  const rawLinks = links.map((l) => l.url).join("\n");

  const isRaw = url.searchParams.get("raw") === "1";
  const content = isRaw ? rawLinks : btoa(rawLinks);

  // Standard subscription headers for proxy clients
  const headers: Record<string, string> = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Profile-Update-Interval": "24",
    "Subscription-Userinfo": `upload=0; download=${user.used_bytes}; total=${user.quota_bytes}; expire=${user.expires_at ?? 0}`,
  };

  return new Response(content, {
    status: 200,
    headers,
  });
}
