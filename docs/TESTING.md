# Client Configuration & Testing Guide

This guide details how to verify `lumen-edge` connectivity using standard client implementations (**v2rayNG**, **Hiddify**, **sing-box**, and automated diagnostics).

---

## 1. Prerequisites

Before testing, ensure:
1. The Cloudflare Worker is deployed or running locally via `wrangler dev`.
2. A user exists in D1 and is enabled (not expired, within quota).
3. The WebSocket path (`WS_PATH`, e.g. `/api/v1/ws`) and domain name are known.

---

## 2. Testing with Hiddify (Cross-Platform)

1. **Copy Connection String**:
   Copy the `vless://` URI generated for the user in the panel or subscription link.
2. **Import Configuration**:
   - Open Hiddify (Desktop, Android, or iOS).
   - Click the **+** (Add) button or press `Ctrl+V` / `Cmd+V`.
   - Select **Add from Clipboard**.
3. **Verify Settings**:
   - **Protocol**: VLESS
   - **Transport**: WebSocket (ws)
   - **Path**: e.g., `/api/v1/ws`
   - **TLS**: Enabled (port 443)
   - **SNI**: `<your-worker-domain>`
   - **Host Header**: `<your-worker-domain>`
4. **Connection Test**:
   - Tap **Connect**.
   - Tap the speed / ping test button (URL Test). A low latency ping confirms the WebSocket handshake and edge TCP tunnel succeeded.

---

## 3. Testing with v2rayNG (Android)

1. Open **v2rayNG**.
2. Tap the **+** icon in the top right.
3. Select **Import config from Clipboard** (or **Scan QR Code** from the lumen panel).
4. Tap the imported config and verify fields:
   - **Address**: Clean Cloudflare IP or Worker Domain
   - **Port**: 443
   - **User ID**: `<User UUID>`
   - **Encryption**: none
   - **Transport**: ws
   - **Host / SNI**: Worker Domain
   - **Path**: `/api/v1/ws`
   - **TLS**: tls
5. Tap the checkmark icon in the bottom right to connect.
6. Tap the test button (connected test / Real delay). Successful delay proves edge routing is functioning.

---

## 4. Testing with sing-box (CLI / Mobile / Desktop)

Example sing-box outbound configuration:

```json
{
  "type": "vless",
  "tag": "lumen-edge-out",
  "server": "your-worker.workers.dev",
  "server_port": 443,
  "uuid": "<USER_UUID>",
  "packet_encoding": "xudp",
  "tls": {
    "enabled": true,
    "server_name": "your-worker.workers.dev",
    "utls": {
      "enabled": true,
      "fingerprint": "chrome"
    }
  },
  "transport": {
    "type": "ws",
    "path": "/api/v1/ws",
    "headers": {
      "Host": "your-worker.workers.dev"
    }
  }
}
```

Run test:
```bash
sing-box run -c config.json
curl --proxy socks5://127.0.0.1:2080 https://cloudflare.com/cdn-cgi/trace
```

---

## 5. Automated Camouflage Verification (Terminal)

You can verify that unauthenticated requests and normal HTTP traffic are disguised:

1. **Verify Camouflage Webpage**:
   ```bash
   curl -I https://<your-worker-domain>/
   ```
   **Expected**: `HTTP/2 200` with `Content-Type: text/html; charset=utf-8` returning the innocent landing page.

2. **Verify Fake Probe Rejection on WS Path**:
   ```bash
   curl -i https://<your-worker-domain>/api/v1/ws
   ```
   **Expected**: Normal HTTP GET without `Upgrade: websocket` returns the camouflage page (200 OK) rather than an error or proxy disclosure.
