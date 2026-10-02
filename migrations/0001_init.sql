-- Migration 0001: Initial schema for lumen-edge

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
CREATE INDEX IF NOT EXISTS idx_users_enabled ON users(enabled);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Seed initial default settings if not exists
INSERT OR IGNORE INTO settings (key, value) VALUES 
('outbound_mode', 'direct'),
('endpoints', '[]');
