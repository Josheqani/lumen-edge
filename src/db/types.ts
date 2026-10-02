export interface UserRecord {
  id: number;
  name: string;
  uuid: string;
  sub_token: string;
  enabled: number; // 1 or 0
  quota_bytes: number; // 0 = unlimited
  used_bytes: number;
  expires_at: number | null; // Unix timestamp in seconds, null = no expiry
  note: string | null;
  created_at: number; // Unix timestamp in seconds
}

export interface UserSummary {
  id: number;
  name: string;
  uuid: string;
  sub_token: string;
  enabled: boolean;
  quota_bytes: number;
  used_bytes: number;
  expires_at: number | null;
  note: string | null;
  created_at: number;
  is_active: boolean; // computed: enabled && not expired && not exceeded quota
}

export interface CreateUserInput {
  name: string;
  uuid?: string;
  sub_token?: string;
  enabled?: boolean;
  quota_bytes?: number;
  expires_at?: number | null;
  note?: string | null;
}

export interface UpdateUserInput {
  name?: string;
  enabled?: boolean;
  quota_bytes?: number;
  expires_at?: number | null;
  note?: string | null;
}

export interface ListUsersOptions {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface EndpointConfig {
  label: string;
  address: string;
  port: number;
  sni?: string;
  host?: string;
}

export type OutboundMode = "direct" | "socks5" | "backend";

export interface Socks5Config {
  host: string;
  port: number;
  username?: string;
  password?: string;
}

export interface BackendConfig {
  url: string;
}

export interface AppSettings {
  outbound_mode: OutboundMode;
  endpoints: EndpointConfig[];
  proxy_ip?: string;
  socks5_config?: Socks5Config;
  backend_config?: BackendConfig;
}
