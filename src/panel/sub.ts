import { renderCamouflageResponse } from "../core/camouflage";
import { getAllSettings } from "../db/settings";
import { getUserBySubToken } from "../db/users";
import { generateVlessLinks } from "./links";
import { generateQrSvg } from "./qrcode";

export interface SubEnv {
  DB: D1Database;
  WS_PATH?: string;
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 GB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
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
    return renderCamouflageResponse();
  }

  const url = new URL(request.url);
  const workerHost = url.hostname;
  const wsPath = env.WS_PATH || "/api/v1/ws";

  const settings = await getAllSettings(env.DB, workerHost);
  const links = generateVlessLinks(user, settings.endpoints, wsPath, workerHost);
  const rawLinks = links.map((l) => l.url).join("\n");

  const userAgent = request.headers.get("User-Agent") || "";
  const acceptHeader = request.headers.get("Accept") || "";

  // Detect if requested by a proxy client app vs browser
  const isClientApp =
    /v2ray|hiddify|sing-box|clash|shadowrocket|streisand|nekobox|karing|foxray/i.test(
      userAgent
    );
  const explicitlyRaw = url.searchParams.get("raw") === "1";
  const explicitlyB64 = url.searchParams.get("b64") === "1";
  const prefersHtml =
    !isClientApp &&
    !explicitlyRaw &&
    !explicitlyB64 &&
    acceptHeader.includes("text/html");

  const fullSubUrl = `${url.protocol}//${url.host}/sub/${user.sub_token}`;

  // If user opens the subscription link in a web browser, show User Portal with One-Tap import buttons
  if (prefersHtml) {
    const qrSvg = generateQrSvg(fullSubUrl, 200);
    const quotaStr =
      user.quota_bytes > 0 ? formatBytes(user.quota_bytes) : "نامحدود / Unlimited";
    const usedStr = formatBytes(user.used_bytes);
    const expireStr = user.expires_at
      ? new Date(user.expires_at * 1000).toLocaleDateString()
      : "همیشگی / Never";

    const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>اشتراک کاربر ${user.name} | Lumen Edge</title>
  <style>
    :root {
      --bg: #0b0f19;
      --card: #141c2e;
      --border: #222f4b;
      --text: #e2e8f0;
      --text-muted: #94a3b8;
      --primary: #3b82f6;
      --success: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Vazirmatn", Tahoma, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 1.5rem 1rem;
      display: flex;
      justify-content: center;
      min-height: 100vh;
    }
    .container {
      max-width: 480px;
      width: 100%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      text-align: center;
    }
    h1 { font-size: 1.35rem; margin-bottom: 0.25rem; }
    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      background: rgba(16, 185, 129, 0.15);
      color: var(--success);
      margin-bottom: 1rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
      text-align: right;
    }
    .stat-box {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--border);
      padding: 0.75rem;
      border-radius: 8px;
    }
    .stat-label { font-size: 0.75rem; color: var(--text-muted); }
    .stat-val { font-size: 0.95rem; font-weight: 600; margin-top: 0.2rem; }
    .qr-box {
      background: #ffffff;
      padding: 0.75rem;
      border-radius: 10px;
      display: inline-block;
      margin: 0.75rem auto;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      margin-bottom: 0.6rem;
      cursor: pointer;
      border: none;
      transition: opacity 0.2s ease;
    }
    .btn-hiddify { background: #6366f1; color: #fff; }
    .btn-v2ray { background: #3b82f6; color: #fff; }
    .btn-singbox { background: #ec4899; color: #fff; }
    .btn-copy { background: #334155; color: #fff; }
    .btn:hover { opacity: 0.9; }
    .toast {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary);
      color: #fff;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      font-size: 0.9rem;
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>اشتراک اختصاصی ${user.name}</h1>
      <span class="badge">وضعیت: فعال (Active)</span>

      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-label">میزان مصرف</div>
          <div class="stat-val">${usedStr}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">حجم مجاز</div>
          <div class="stat-val">${quotaStr}</div>
        </div>
        <div class="stat-box" style="grid-column: span 2;">
          <div class="stat-label">تاریخ انقضا</div>
          <div class="stat-val">${expireStr}</div>
        </div>
      </div>

      <div class="qr-box">
        ${qrSvg}
      </div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        بارکد را در نرم‌افزار خود اسکن کنید یا روی دکمه‌های زیر بزنید
      </p>

      <a href="hiddify://install-sub?url=${encodeURIComponent(fullSubUrl)}" class="btn btn-hiddify">
        افزودن به هیدیفای (Hiddify)
      </a>
      <a href="v2rayng://install-sub?url=${encodeURIComponent(fullSubUrl)}" class="btn btn-v2ray">
        افزودن به v2rayNG
      </a>
      <a href="sing-box://import-remote-profile?url=${encodeURIComponent(fullSubUrl)}" class="btn btn-singbox">
        افزودن به Sing-box
      </a>
      <button onclick="copySub()" class="btn btn-copy">
        کپی کردن لینک اشتراک (Copy URL)
      </button>
    </div>
  </div>

  <div id="toast" class="toast">لینک اشتراک با موفقیت کپی شد!</div>

  <script>
    function copySub() {
      navigator.clipboard.writeText("${fullSubUrl}").then(() => {
        const t = document.getElementById("toast");
        t.style.display = "block";
        setTimeout(() => t.style.display = "none", 2500);
      });
    }
  </script>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  // Otherwise return standard Base64 config (or raw if ?raw=1)
  const content = explicitlyRaw ? rawLinks : utf8ToBase64(rawLinks);

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
