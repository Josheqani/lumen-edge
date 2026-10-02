export function renderCamouflageResponse(): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Edge API Gateway | Status & Documentation</title>
  <style>
    :root {
      --bg: #0a0c10;
      --card-bg: #141721;
      --border: #242b3b;
      --text: #e1e7f0;
      --text-muted: #8b9bb4;
      --accent: #3b82f6;
      --success: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 2rem 1rem;
      display: flex;
      justify-content: center;
      min-height: 100vh;
    }
    .container {
      max-width: 720px;
      width: 100%;
    }
    header {
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1.5rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 500;
      margin-bottom: 0.8rem;
    }
    .dot {
      width: 8px;
      height: 8px;
      background-color: var(--success);
      border-radius: 50%;
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
    }
    p.lead {
      color: var(--text-muted);
      font-size: 1rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .card h2 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }
    .card p {
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      background: rgba(255, 255, 255, 0.06);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    footer {
      margin-top: 2rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge"><span class="dot"></span> Operational</div>
      <h1>Global Edge Dispatcher</h1>
      <p class="lead">High-throughput HTTP/3 and WebSocket edge routing infrastructure.</p>
    </header>
    <main>
      <div class="card">
        <h2>Telemetry & Routing</h2>
        <p>Active nodes negotiate anycast peering via regional clusters. Direct client telemetry stream connections require mutual handshake authentication.</p>
      </div>
      <div class="card">
        <h2>Integration Specs</h2>
        <p>Endpoints enforce standard binary protocol encapsulation. For specification schemas and client libraries, refer to internal distribution channels.</p>
      </div>
    </main>
    <footer>
      &copy; 2026 CloudEdge Network Infrastructure &bull; All systems normal
    </footer>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
