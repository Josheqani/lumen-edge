import { getActiveUserUuids } from "../db/users";

let cachedUuids: Set<string> | null = null;
let cacheExpiryTime = 0;
const CACHE_TTL_MS = 30_000; // 30 seconds

export async function getCachedActiveUuids(db: D1Database): Promise<Set<string>> {
  const now = Date.now();
  if (cachedUuids !== null && now < cacheExpiryTime) {
    return cachedUuids;
  }

  try {
    const freshUuids = await getActiveUserUuids(db);
    cachedUuids = freshUuids;
    cacheExpiryTime = now + CACHE_TTL_MS;
    return cachedUuids;
  } catch (err) {
    // If DB read fails temporarily, use stale cache if available
    if (cachedUuids !== null) {
      return cachedUuids;
    }
    throw err;
  }
}

export function invalidateActiveUuidsCache(): void {
  cachedUuids = null;
  cacheExpiryTime = 0;
}
