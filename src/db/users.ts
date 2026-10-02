import type {
  CreateUserInput,
  ListUsersOptions,
  UpdateUserInput,
  UserRecord,
  UserSummary,
} from "./types";

export function formatUser(record: UserRecord): UserSummary {
  const now = Math.floor(Date.now() / 1000);
  const isExpired = record.expires_at !== null && record.expires_at > 0 && record.expires_at < now;
  const isOverQuota =
    record.quota_bytes > 0 && record.used_bytes >= record.quota_bytes;
  const is_active = record.enabled === 1 && !isExpired && !isOverQuota;

  return {
    id: record.id,
    name: record.name,
    uuid: record.uuid,
    sub_token: record.sub_token,
    enabled: record.enabled === 1,
    quota_bytes: record.quota_bytes,
    used_bytes: record.used_bytes,
    expires_at: record.expires_at,
    note: record.note,
    created_at: record.created_at,
    is_active,
  };
}

export async function getUserById(
  db: D1Database,
  id: number
): Promise<UserSummary | null> {
  const row = await db
    .prepare("SELECT * FROM users WHERE id = ?")
    .bind(id)
    .first<UserRecord>();
  return row ? formatUser(row) : null;
}

export async function getUserByUuid(
  db: D1Database,
  uuid: string
): Promise<UserSummary | null> {
  const row = await db
    .prepare("SELECT * FROM users WHERE uuid = ?")
    .bind(uuid)
    .first<UserRecord>();
  return row ? formatUser(row) : null;
}

export async function getUserBySubToken(
  db: D1Database,
  token: string
): Promise<UserSummary | null> {
  const row = await db
    .prepare("SELECT * FROM users WHERE sub_token = ?")
    .bind(token)
    .first<UserRecord>();
  return row ? formatUser(row) : null;
}

export async function listUsers(
  db: D1Database,
  options: ListUsersOptions = {}
): Promise<{ users: UserSummary[]; total: number }> {
  const limit = options.limit && options.limit > 0 ? options.limit : 50;
  const offset = options.offset && options.offset >= 0 ? options.offset : 0;
  const search = options.search ? `%${options.search.trim()}%` : null;

  let countQuery = "SELECT COUNT(*) as count FROM users";
  let selectQuery = "SELECT * FROM users";
  const params: unknown[] = [];

  if (search) {
    countQuery += " WHERE name LIKE ? OR note LIKE ? OR uuid LIKE ?";
    selectQuery += " WHERE name LIKE ? OR note LIKE ? OR uuid LIKE ?";
    params.push(search, search, search);
  }

  selectQuery += " ORDER BY id DESC LIMIT ? OFFSET ?";

  const totalRow = await db
    .prepare(countQuery)
    .bind(...params)
    .first<{ count: number }>();
  const total = totalRow?.count ?? 0;

  const rows = await db
    .prepare(selectQuery)
    .bind(...params, limit, offset)
    .all<UserRecord>();

  const users = (rows.results || []).map(formatUser);
  return { users, total };
}

export async function getActiveUserUuids(db: D1Database): Promise<Set<string>> {
  const now = Math.floor(Date.now() / 1000);
  const { results } = await db
    .prepare(
      `SELECT uuid FROM users 
       WHERE enabled = 1 
         AND (expires_at IS NULL OR expires_at = 0 OR expires_at > ?)
         AND (quota_bytes = 0 OR used_bytes < quota_bytes)`
    )
    .bind(now)
    .all<{ uuid: string }>();

  const set = new Set<string>();
  if (results) {
    for (const r of results) {
      if (r.uuid) set.add(r.uuid.toLowerCase());
    }
  }
  return set;
}

export async function createUser(
  db: D1Database,
  input: CreateUserInput
): Promise<UserSummary> {
  const uuid = (input.uuid || crypto.randomUUID()).toLowerCase();
  const subToken = input.sub_token || crypto.randomUUID().replace(/-/g, "");
  const enabled = input.enabled === false ? 0 : 1;
  const quotaBytes = input.quota_bytes && input.quota_bytes > 0 ? input.quota_bytes : 0;
  const expiresAt = input.expires_at ?? null;
  const note = input.note ?? null;
  const createdAt = Math.floor(Date.now() / 1000);

  const res = await db
    .prepare(
      `INSERT INTO users (name, uuid, sub_token, enabled, quota_bytes, used_bytes, expires_at, note, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)`
    )
    .bind(input.name.trim(), uuid, subToken, enabled, quotaBytes, expiresAt, note, createdAt)
    .run();

  const id = res.meta?.last_row_id;
  if (!id) {
    throw new Error("Failed to insert user into database");
  }

  const created = await getUserById(db, id);
  if (!created) {
    throw new Error("Failed to retrieve created user");
  }
  return created;
}

export async function updateUser(
  db: D1Database,
  id: number,
  input: UpdateUserInput
): Promise<UserSummary | null> {
  const fields: string[] = [];
  const params: unknown[] = [];

  if (input.name !== undefined) {
    fields.push("name = ?");
    params.push(input.name.trim());
  }
  if (input.enabled !== undefined) {
    fields.push("enabled = ?");
    params.push(input.enabled ? 1 : 0);
  }
  if (input.quota_bytes !== undefined) {
    fields.push("quota_bytes = ?");
    params.push(Math.max(0, input.quota_bytes));
  }
  if (input.expires_at !== undefined) {
    fields.push("expires_at = ?");
    params.push(input.expires_at);
  }
  if (input.note !== undefined) {
    fields.push("note = ?");
    params.push(input.note);
  }

  if (fields.length === 0) {
    return getUserById(db, id);
  }

  params.push(id);
  await db
    .prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`)
    .bind(...params)
    .run();

  return getUserById(db, id);
}

export async function incrementUsedBytes(
  db: D1Database,
  uuid: string,
  bytes: number
): Promise<void> {
  if (bytes <= 0) return;
  await db
    .prepare("UPDATE users SET used_bytes = used_bytes + ? WHERE uuid = ?")
    .bind(bytes, uuid.toLowerCase())
    .run();
}

export async function resetUserUsage(
  db: D1Database,
  id: number
): Promise<UserSummary | null> {
  await db.prepare("UPDATE users SET used_bytes = 0 WHERE id = ?").bind(id).run();
  return getUserById(db, id);
}

export async function regenerateUserUuid(
  db: D1Database,
  id: number,
  newUuid?: string
): Promise<UserSummary | null> {
  const uuid = (newUuid || crypto.randomUUID()).toLowerCase();
  await db.prepare("UPDATE users SET uuid = ? WHERE id = ?").bind(uuid, id).run();
  return getUserById(db, id);
}

export async function regenerateUserSubToken(
  db: D1Database,
  id: number,
  newToken?: string
): Promise<UserSummary | null> {
  const token = newToken || crypto.randomUUID().replace(/-/g, "");
  await db
    .prepare("UPDATE users SET sub_token = ? WHERE id = ?")
    .bind(token, id)
    .run();
  return getUserById(db, id);
}

export async function deleteUser(
  db: D1Database,
  id: number
): Promise<boolean> {
  const res = await db.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
  return (res.meta?.changes ?? 0) > 0;
}
