# Feature Analysis & Roadmap: lumen-edge

## Architectural Overview

`lumen-edge` is a self-hosted, single-tenant (single-owner) edge proxy and management suite designed to run entirely on a single Cloudflare Worker with Cloudflare D1 (SQLite) as the persistence layer. Unlike multi-tenant commercial platforms, it is designed for personal, family, and trusted friend access under strict resource efficiency, high security, and minimal edge footprint.

This document compiles architectural concepts and capabilities observed in contemporary edge proxy solutions (including Nova-Proxy and similar worker-based circumvention tools), and categorizes them into what is built in our MVP versus future milestones.

---

## Feature Comparison & Groupings

### 1. Protocols & Transport
| Feature | Description | Status |
| :--- | :--- | :--- |
| **VLESS over WebSocket + TLS** | Standard VLESS protocol parsed at edge, piped to TCP via `cloudflare:sockets` | **MVP** |
| **Outbound Modes (Direct, SOCKS5, Backend)** | Support Direct egress, SOCKS5 upstream proxy with auth, or WebSocket forwarding to backend VPS | **MVP (Stage 10)** |
| **Trojan / Shadowsocks** | Alternative proxy protocols running on the worker | *Later* |
| **gRPC / XHTTP Transport** | Specialized edge transports for clients supporting gRPC or HTTP/3 tunnels | *Later* |
| **UDP over TCP / WARP Node** | Tunneled UDP for VoIP calls via edge WARP routing | *Later* |

### 2. User Management & Traffic Accounting
| Feature | Description | Status |
| :--- | :--- | :--- |
| **UUID Identification** | Unique UUID per user for VLESS handshake validation | **MVP** |
| **Quota & Expiration Control** | Data quota limits (bytes) and date expiry checks | **MVP** |
| **Live Traffic Counter** | Asynchronous byte accounting per connection via `ctx.waitUntil` committed to D1 | **MVP** |
| **In-Memory Active Cache** | Low-latency in-memory cache (~30s TTL) for active user state to prevent D1 saturation | **MVP** |
| **User CRUD & Status Toggle** | Enable/disable user, reset used quota, regenerate UUID, add admin notes | **MVP** |
| **Daily Rollover Quotas** | Automated per-day bandwidth resets | *Later* |

### 3. Endpoints & Censorship Circumvention
| Feature | Description | Status |
| :--- | :--- | :--- |
| **Custom Clean IP Endpoints** | Configurable host/IP endpoints with custom address, port, SNI, and Host header | **MVP (Stage 6b)** |
| **Custom WS Path** | Configurable WebSocket route hidden behind obscure URL paths | **MVP** |
| **Camouflage / Fallback Page** | Normal-looking innocent web page returned for unauthorized or non-WS requests | **MVP** |
| **In-Browser Clean IP Scanner** | Interactive latency tester measuring direct edge reachability | *Later* |
| **GitHub Subscription Mirror** | Redundant sub delivery via private/public GitHub repo raw file | *Later* |

### 4. Subscription & Sharing
| Feature | Description | Status |
| :--- | :--- | :--- |
| **Standard `vless://` URI Generation** | Ready-to-copy client links with TLS, host, SNI, path, and remark | **MVP** |
| **Base64 Subscription Feed** | Single token-based subscription URL returning line-delimited Base64 configs | **MVP** |
| **Token-Based Separation** | Separate random subscription tokens decoupled from the proxy UUID | **MVP** |
| **QR Code Generation** | Self-contained SVG QR code rendering directly in the admin panel | **MVP** |
| **Clash / Sing-box YAML Feed** | Formatted YAML profiles for Mihomo/Sing-box clients | *Later* |

### 5. Admin Panel & Management UI
| Feature | Description | Status |
| :--- | :--- | :--- |
| **Single-Bundle Embedded UI** | Complete responsive UI pre-inlined into Worker script (zero external CDNs) | **MVP** |
| **Bilingual UI (English + Persian)** | Full RTL (Right-to-Left) and LTR support with instant language toggle | **MVP** |
| **Dark & Light Mode** | Modern adaptive theme with manual toggle | **MVP** |
| **HMAC Secure Session Authentication** | HttpOnly, SameSite=Strict cookies with constant-time signature verification | **MVP** |
| **Brute-Force Rate Limiting** | In-memory / database tracking of failed login attempts with lockout | **MVP** |
| **Configurable Panel Path** | Non-standard dashboard path specified via environment variable | **MVP** |
| **Telegram Admin Bot** | Telegram bot webhook for user management via chat commands | *Later* |

---

## MVP Scope (Currently Building)

1. **Core Edge Engine**:
   - VLESS header parsing (IPv4, IPv6, Domain destination addresses).
   - Bi-directional stream piping with backpressure handling using `cloudflare:sockets`.
   - Camouflage response on normal HTTP requests or unauthorized UUIDs.
   - Configurable outbound mode: Direct egress, SOCKS5 upstream tunnel, and Backend reverse forwarding.

2. **D1 Persistence & Caching**:
   - Schema for users, quotas, expiration, usage, subscription tokens, and system settings.
   - 30-second in-memory caching layer for active users and settings.
   - Post-connection asynchronous byte tallying.

3. **Administration & Panel**:
   - RESTful API under `/api` secured with HMAC session cookies.
   - Brute-force protection on authentication attempts.
   - Mobile-first dashboard inlined in worker distribution.
   - Support for Persian (فارسی) RTL and English LTR.
   - Multiple endpoint management (custom clean IPs, ports, SNI).

4. **Distribution & Delivery**:
   - `vless://` link generation and in-browser SVG QR codes.
   - Token-based subscription endpoint `/sub/:token`.
   - Single minified `dist/worker.js` with build and release automation scripts.
