# 🌟 lumen-edge

Personal, single-owner censorship-resistant proxy and bilingual administration panel running as **one Cloudflare Worker** with Cloudflare D1 (SQLite).

The entire system—VLESS proxy engine, REST API, database queries, and full mobile-friendly admin interface—compiles into a single bundled, minified file (`dist/worker.js`) requiring **zero external server hosting** and **zero external CDN requests**.

---

## Features

- **Protocols**: VLESS over WebSocket with TLS using Cloudflare native TCP sockets (`cloudflare:sockets`).
- **Persistence**: Cloudflare D1 SQLite database storing users, quotas, expiration, notes, traffic stats, and system settings.
- **Traffic Accounting**: Asynchronous byte counting committed to D1 after connection termination via `ctx.waitUntil`.
- **Low Edge Latency**: In-memory active UUID cache (~30s TTL) with instant invalidation on admin edits.
- **Camouflage Guard**: Unauthenticated requests or invalid WebSocket probes receive an authentic, innocent-looking landing page with `200 OK`.
- **Bilingual Admin Panel**: Clean, responsive UI with instant toggle between English (LTR) and Persian / فارسی (RTL), plus dark and light theme options.
- **Multiple Clean-IP Endpoints**: Define custom IP addresses/ports/SNI (e.g. clean Cloudflare edge IPs for specific telecom operators).
- **Outbound Modes**:
  - `direct`: Direct edge egress to destination (default).
  - `socks5`: Upstream tunnel through a SOCKS5 proxy with RFC 1928 / RFC 1929 authentication.
  - `backend`: Reverse WebSocket forwarding to an existing VPS (Xray/Sing-box).
  - *Automatic Fallback*: If SOCKS5 or Backend fails, gracefully falls back to Direct.
- **Share Links & Subscriptions**:
  - Ready-to-copy `vless://` links with custom remarks.
  - Standalone SVG QR code rendering directly in the browser without third-party services.
  - Token-based subscription feed (`/sub/<token>`) returning Base64 or raw configurations with standard client metadata headers (`Subscription-Userinfo`).

---

## 🚀 Cloudflare Deployment (Step-by-Step)

Follow these steps to deploy `lumen-edge` on your free Cloudflare account:

### 1. Create D1 Database
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** &rarr; **D1**.
2. Click **Create Database**, choose a name (e.g. `lumen-db`), and click **Create**.
3. In the database view, open the **Console** tab.
4. Copy the SQL content from [`migrations/0001_init.sql`](migrations/0001_init.sql), paste it into the console, and click **Execute**.

### 2. Create Worker & Upload Artifact
1. Go to **Workers & Pages** &rarr; **Create Application** &rarr; **Worker**.
2. Give it a name (e.g. `lumen-edge`) and click **Deploy**.
3. Open the Worker settings, click **Edit Code**, replace the default script with the contents of `dist/worker.js` (downloaded from the latest [GitHub Release](../../releases)), and click **Deploy**.

### 3. Bind the D1 Database
1. Go to your Worker's **Settings** &rarr; **Bindings** (or **Variables and Secrets** depending on dashboard version).
2. Click **Add** &rarr; **D1 Database**.
3. Set the **Variable name** to exactly:
   ```text
   DB
   ```
4. Select your D1 database (`lumen-db`) and click **Save and deploy**.

### 4. Configure Environment Variables & Secrets
Under the Worker's **Settings** &rarr; **Variables and Secrets**, add the following:

| Name | Type | Recommended Value | Description |
| :--- | :--- | :--- | :--- |
| `ADMIN_USERNAME` | Variable | `admin` (or custom) | Username for admin panel login |
| `ADMIN_PASSWORD` | Secret | *Strong password* | Password for admin panel login |
| `SESSION_SECRET` | Secret | *Random 32+ characters* | Secret key for signing HMAC session cookies |
| `WS_PATH` | Variable | `/api/v1/ws` (or obscure path) | Path for VLESS WebSocket proxy |
| `PANEL_PATH` | Variable | `/_panel` (or obscure path) | Path to access the admin panel (must not be `/admin`) |

> **How to generate a random `SESSION_SECRET`**:
> Run in your local terminal:
> ```bash
> openssl rand -base64 32
> ```

### 5. (Recommended) Add a Custom Domain
By default, your worker will be available at `*.workers.dev`. Cloudflare's default worker domain is frequently filtered or throttled by restrictive national firewalls.
1. Add an existing domain to your Cloudflare account.
2. In your Worker's settings, navigate to **Settings** &rarr; **Domains & Routes** &rarr; **Add** &rarr; **Custom Domain**.
3. Enter a subdomain (e.g. `edge.yourdomain.com`).
4. Custom domains support TLS 1.3, custom SNI, and HTTP/3.

### 6. Create Your First User
1. Open your browser and navigate to your panel path:
   ```text
   https://<your-worker-domain>/_panel
   ```
2. Log in using your `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
3. Click **+ Add User**, enter a name and optional quota / expiration date.
4. Click the share icon (🔗) to view the generated `vless://` link, SVG QR code, or subscription URL.
5. Import into **v2rayNG**, **Hiddify**, **sing-box**, or **Streisand**.

---

## 📡 Outbound Modes

You can change how traffic exits Cloudflare under the **Settings** tab in the admin panel:

1. **Direct (Edge Egress)**:
   The Worker opens direct outbound TCP sockets to destination IPs using Cloudflare's anycast edge. High speed, lowest latency.
2. **SOCKS5 Proxy Tunnel**:
   The Worker tunnels all user traffic through an upstream SOCKS5 proxy server (with optional username/password authentication). Ideal for escaping Cloudflare datacenter IP blocks or accessing IP-restricted services.
3. **Backend VPS Forwarding**:
   The Worker forwards the incoming VLESS WebSocket directly to your private server (e.g. an existing VPS running Xray/Sing-box).
4. **Automatic Fallback**:
   If an external SOCKS5 proxy or Backend VPS becomes unreachable, `lumen-edge` automatically falls back to Direct egress so clients do not lose connectivity.

---

## 💻 Local Development & Testing

### Requirements
- [Bun](https://bun.sh/) (v1.1+)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (installed automatically as devDependency)

### Setup
```bash
# Clone the repository
git clone https://github.com/Josheqani/lumen-edge.git
cd lumen-edge

# Install dependencies
bun install

# Run local D1 database migrations
bun x wrangler d1 migrations apply DB --local

# Start local development server
bun run dev
```

### Running Tests
Unit tests use in-memory SQLite (`bun:sqlite`) and WebCrypto to verify protocol parsing, session cryptography, rate limiting, and API CRUD:
```bash
bun test
```

### Type Checking
```bash
bun run typecheck
```

---

## 📦 Building the Release Bundle

The build script compiles the TypeScript codebase and inlines the panel interface into a single, self-contained `dist/worker.js` (ES2022, ESM format):

```bash
bun run build
```

To publish a new GitHub Release with the bundled worker attached:
```bash
./scripts/release.sh v0.1.0
```

---

## 🛡️ Security Best Practices

- **Keep `PANEL_PATH` Secret**: Avoid common paths like `/admin`. Use non-descriptive names such as `/_edge_ctrl` or `/_dash_7f8`.
- **Brute-Force Lockout**: The panel automatically locks out IPs after 5 failed authentication attempts for 15 minutes.
- **Session Protection**: Session tokens are signed using HMAC-SHA256 and stored in `HttpOnly`, `SameSite=Strict`, `Secure` cookies with constant-time verification.
- **Sub Tokens vs UUIDs**: Subscription URLs use independent random tokens distinct from the proxy UUID. If a subscription link is leaked, you can regenerate the subscription token without changing the user's UUID.
- **Camouflage**: Probing the server with standard HTTP requests returns a realistic edge telemetry status page, revealing no information about proxy capabilities.
