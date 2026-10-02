import type {
  AppSettings,
  BackendConfig,
  EndpointConfig,
  OutboundMode,
  Socks5Config,
} from "./types";

export async function getSettingRaw(
  db: D1Database,
  key: string
): Promise<string | null> {
  const row = await db
    .prepare("SELECT value FROM settings WHERE key = ?")
    .bind(key)
    .first<{ value: string }>();
  return row ? row.value : null;
}

export async function setSettingRaw(
  db: D1Database,
  key: string,
  value: string
): Promise<void> {
  await db
    .prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
    )
    .bind(key, value)
    .run();
}

export async function getAllSettings(
  db: D1Database,
  fallbackHost?: string
): Promise<AppSettings> {
  const rows = await db.prepare("SELECT key, value FROM settings").all<{
    key: string;
    value: string;
  }>();

  const map = new Map<string, string>();
  if (rows.results) {
    for (const r of rows.results) {
      map.set(r.key, r.value);
    }
  }

  let outbound_mode: OutboundMode = "direct";
  const rawMode = map.get("outbound_mode");
  if (rawMode === "socks5" || rawMode === "backend" || rawMode === "direct") {
    outbound_mode = rawMode;
  }

  let endpoints: EndpointConfig[] = [];
  const rawEndpoints = map.get("endpoints");
  if (rawEndpoints) {
    try {
      const parsed = JSON.parse(rawEndpoints);
      if (Array.isArray(parsed)) {
        endpoints = parsed;
      }
    } catch {
      endpoints = [];
    }
  }

  if (endpoints.length === 0 && fallbackHost) {
    endpoints = [
      {
        label: "Default Edge",
        address: fallbackHost,
        port: 443,
        sni: fallbackHost,
        host: fallbackHost,
      },
      {
        label: "MCI Clean 1 (Speed)",
        address: "speed.cloudflare.com",
        port: 443,
        sni: fallbackHost,
        host: fallbackHost,
      },
      {
        label: "MCI Clean 2 (Anycast)",
        address: "104.16.132.229",
        port: 443,
        sni: fallbackHost,
        host: fallbackHost,
      },
      {
        label: "MCI Clean 3 (CF DNS)",
        address: "162.159.192.1",
        port: 443,
        sni: fallbackHost,
        host: fallbackHost,
      },
      {
        label: "MCI Clean 4 (172.64)",
        address: "172.64.155.249",
        port: 443,
        sni: fallbackHost,
        host: fallbackHost,
      },
      {
        label: "MCI Alt Port (8443)",
        address: "104.17.80.1",
        port: 8443,
        sni: fallbackHost,
        host: fallbackHost,
      },
      {
        label: "MCI Alt Port (2053)",
        address: "104.20.74.82",
        port: 2053,
        sni: fallbackHost,
        host: fallbackHost,
      },
    ];
  }

  let socks5_config: Socks5Config | undefined;
  const rawSocks = map.get("socks5_config");
  if (rawSocks) {
    try {
      socks5_config = JSON.parse(rawSocks);
    } catch {
      socks5_config = undefined;
    }
  }

  let backend_config: BackendConfig | undefined;
  const rawBackend = map.get("backend_config");
  if (rawBackend) {
    try {
      backend_config = JSON.parse(rawBackend);
    } catch {
      backend_config = undefined;
    }
  }

  return {
    outbound_mode,
    endpoints,
    socks5_config,
    backend_config,
  };
}

export async function saveAllSettings(
  db: D1Database,
  settings: Partial<AppSettings>
): Promise<void> {
  const statements: D1PreparedStatement[] = [];

  if (settings.outbound_mode !== undefined) {
    statements.push(
      db
        .prepare(
          "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
        )
        .bind("outbound_mode", settings.outbound_mode)
    );
  }

  if (settings.endpoints !== undefined) {
    statements.push(
      db
        .prepare(
          "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
        )
        .bind("endpoints", JSON.stringify(settings.endpoints))
    );
  }

  if (settings.socks5_config !== undefined) {
    statements.push(
      db
        .prepare(
          "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
        )
        .bind("socks5_config", JSON.stringify(settings.socks5_config))
    );
  }

  if (settings.backend_config !== undefined) {
    statements.push(
      db
        .prepare(
          "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
        )
        .bind("backend_config", JSON.stringify(settings.backend_config))
    );
  }

  if (statements.length > 0) {
    await db.batch(statements);
  }
}
