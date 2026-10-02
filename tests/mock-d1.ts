import { Database } from "bun:sqlite";

export function createTestD1(): D1Database {
  const sqlite = new Database(":memory:");

  // Run migration
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      uuid TEXT UNIQUE NOT NULL,
      sub_token TEXT UNIQUE NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      quota_bytes INTEGER NOT NULL DEFAULT 0,
      used_bytes INTEGER NOT NULL DEFAULT 0,
      expires_at INTEGER,
      note TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid);
    CREATE INDEX IF NOT EXISTS idx_users_sub_token ON users(sub_token);

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    INSERT OR IGNORE INTO settings (key, value) VALUES 
    ('outbound_mode', 'direct'),
    ('endpoints', '[]');
  `);

  const createStatement = (sql: string, params: unknown[] = []): D1PreparedStatement => {
    return {
      bind(...newParams: unknown[]) {
        return createStatement(sql, newParams);
      },
      async first<T = unknown>(colName?: string): Promise<T | null> {
        const stmt = sqlite.prepare(sql);
        const row = stmt.get(...params) as Record<string, unknown> | null;
        if (!row) return null;
        if (colName) return (row[colName] as T) ?? null;
        return row as T;
      },
      async all<T = unknown>(): Promise<D1Result<T>> {
        const stmt = sqlite.prepare(sql);
        const results = stmt.all(...params) as T[];
        return {
          results,
          success: true,
          meta: {
            duration: 0,
            rows_read: results.length,
            rows_written: 0,
          },
        };
      },
      async run(): Promise<D1Response> {
        const stmt = sqlite.prepare(sql);
        const info = stmt.run(...params);
        return {
          success: true,
          meta: {
            duration: 0,
            changes: info.changes,
            last_row_id: Number(info.lastInsertRowid),
            rows_read: 0,
            rows_written: info.changes,
          },
        };
      },
      async raw<T = unknown>(): Promise<T[]> {
        const stmt = sqlite.prepare(sql);
        return stmt.values(...params) as T[];
      },
    };
  };

  const db: D1Database = {
    prepare(query: string) {
      return createStatement(query);
    },
    async dump(): Promise<ArrayBuffer> {
      return new ArrayBuffer(0);
    },
    async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
      const results: D1Result<T>[] = [];
      for (const s of statements) {
        results.push((await s.all<T>()));
      }
      return results;
    },
    async exec(query: string): Promise<D1ExecResult> {
      sqlite.run(query);
      return { count: 1, duration: 0 };
    },
  };

  return db;
}
