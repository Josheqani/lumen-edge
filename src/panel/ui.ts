export function renderPanelHtml(panelPath: string, wsPath: string): string {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lumen Edge | Admin Panel</title>
  <style>
    :root {
      --bg: #0c0f17;
      --card: #151a27;
      --card-hover: #1c2233;
      --border: #232c42;
      --text: #e6edf8;
      --text-muted: #8493ad;
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --danger-hover: #dc2626;
      --input-bg: #090c14;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Vazirmatn", Helvetica, Arial, sans-serif;
      --radius: 8px;
    }

    [data-theme="light"] {
      --bg: #f4f6fa;
      --card: #ffffff;
      --card-hover: #f9fafb;
      --border: #e2e8f0;
      --text: #0f172a;
      --text-muted: #64748b;
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --input-bg: #f8fafc;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-family);
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.5;
      min-height: 100vh;
    }

    html[dir="rtl"] {
      text-align: right;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1.5rem 1rem;
    }

    /* Top Navigation */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    .logo-box {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .logo-badge {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--primary);
      box-shadow: 0 0 10px var(--primary);
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.5rem 0.9rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--text);
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
    }
    .btn:hover { background: var(--card-hover); }
    .btn-primary {
      background: var(--primary);
      border-color: var(--primary);
      color: #ffffff;
    }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-danger {
      background: transparent;
      border-color: var(--danger);
      color: var(--danger);
    }
    .btn-danger:hover { background: var(--danger); color: #fff; }
    .btn-sm { padding: 0.3rem 0.6rem; font-size: 0.8rem; }
    .btn-icon { padding: 0.4rem; }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.5rem;
    }
    .tab-btn {
      padding: 0.5rem 1rem;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--text-muted);
      font-weight: 600;
      cursor: pointer;
      font-size: 0.95rem;
    }
    .tab-btn.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    /* Cards */
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.25rem;
      margin-bottom: 1.25rem;
    }

    /* Table */
    .table-container {
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--card);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    html[dir="rtl"] th, html[dir="rtl"] td {
      text-align: right;
    }
    th {
      background: rgba(0, 0, 0, 0.05);
      color: var(--text-muted);
      font-weight: 600;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--card-hover); }

    /* Progress bar */
    .progress-bar {
      width: 100%;
      height: 6px;
      background: var(--border);
      border-radius: 9999px;
      overflow: hidden;
      margin-top: 0.3rem;
    }
    .progress-fill {
      height: 100%;
      background: var(--primary);
      transition: width 0.3s ease;
    }
    .progress-fill.warning { background: var(--warning); }
    .progress-fill.danger { background: var(--danger); }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-active { background: rgba(16, 185, 129, 0.15); color: var(--success); }
    .badge-disabled { background: rgba(100, 116, 139, 0.2); color: var(--text-muted); }
    .badge-expired { background: rgba(239, 68, 68, 0.15); color: var(--danger); }
    .badge-quota { background: rgba(245, 158, 11, 0.15); color: var(--warning); }

    /* Form Controls */
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 0.4rem;
      color: var(--text-muted);
    }
    .form-control {
      width: 100%;
      padding: 0.6rem 0.8rem;
      background: var(--input-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text);
      font-size: 0.9rem;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--primary);
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }
    .modal-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      max-width: 500px;
      width: 100%;
      padding: 1.5rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.75rem;
    }
    .modal-header h3 { font-size: 1.15rem; font-weight: 600; }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.6rem;
      margin-top: 1.25rem;
      border-top: 1px solid var(--border);
      padding-top: 0.75rem;
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--primary);
      color: #fff;
      padding: 0.6rem 1.2rem;
      border-radius: var(--radius);
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.25s ease;
      z-index: 2000;
    }
    html[dir="rtl"] .toast {
      right: auto;
      left: 2rem;
    }
    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }

    /* QR Code Display */
    .qr-container {
      display: flex;
      justify-content: center;
      padding: 1rem;
      background: #ffffff;
      border-radius: var(--radius);
      margin: 1rem 0;
    }
    .qr-container svg {
      width: 220px;
      height: 220px;
    }

    .hidden { display: none !important; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo-box">
        <div class="logo-badge"></div>
        <span>Lumen Edge</span>
      </div>
      <div class="nav-actions">
        <button class="btn btn-sm" id="btn-lang" onclick="toggleLanguage()">فا / EN</button>
        <button class="btn btn-sm" id="btn-theme" onclick="toggleTheme()">☀️ / 🌙</button>
        <button class="btn btn-sm btn-danger hidden" id="btn-logout" onclick="logout()" data-i18n="logout">Logout</button>
      </div>
    </header>

    <!-- Login View -->
    <div id="view-login" class="card" style="max-width: 400px; margin: 3rem auto;">
      <h2 style="margin-bottom: 1.25rem; font-size: 1.25rem;" data-i18n="loginTitle">Admin Authentication</h2>
      <div id="login-error" style="color: var(--danger); font-size: 0.85rem; margin-bottom: 1rem;" class="hidden"></div>
      <form onsubmit="handleLogin(event)">
        <div class="form-group">
          <label data-i18n="username">Username</label>
          <input type="text" id="login-username" class="form-control" required autocomplete="username">
        </div>
        <div class="form-group">
          <label data-i18n="password">Password</label>
          <input type="password" id="login-password" class="form-control" required autocomplete="current-password">
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;" data-i18n="signIn">Sign In</button>
      </form>
    </div>

    <!-- Main Dashboard View -->
    <div id="view-dashboard" class="hidden">
      <div class="tabs">
        <button class="tab-btn active" id="tab-users" onclick="switchTab('users')" data-i18n="usersTab">Users</button>
        <button class="tab-btn" id="tab-settings" onclick="switchTab('settings')" data-i18n="settingsTab">Settings</button>
      </div>

      <!-- Users Tab Content -->
      <div id="content-users">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; gap: 0.5rem; flex-wrap: wrap;">
          <input type="text" id="search-input" class="form-control" style="max-width: 320px;" placeholder="Search users..." oninput="handleSearch(this.value)">
          <button class="btn btn-primary" onclick="openCreateUserModal()" data-i18n="addUser">+ Add User</button>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th data-i18n="name">Name</th>
                <th data-i18n="status">Status</th>
                <th data-i18n="usage">Data Usage</th>
                <th data-i18n="expires">Expires</th>
                <th data-i18n="actions">Actions</th>
              </tr>
            </thead>
            <tbody id="users-tbody">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Settings Tab Content -->
      <div id="content-settings" class="hidden">
        <div class="card">
          <h3 style="margin-bottom: 1rem;" data-i18n="endpointsTitle">Endpoints & Clean IPs</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;" data-i18n="endpointsDesc">
            Configure custom addresses (e.g. clean Cloudflare IPs or custom domain names) for generating optimized client configs.
          </p>
          <div id="endpoints-list" style="margin-bottom: 1rem;"></div>
          <button class="btn btn-sm" onclick="addEndpointRow()" data-i18n="addEndpoint">+ Add Endpoint</button>
        </div>

        <div class="card">
          <h3 style="margin-bottom: 1rem;" data-i18n="outboundTitle">Outbound Proxy Mode</h3>
          <div class="form-group">
            <label data-i18n="mode">Egress Mode</label>
            <select id="setting-outbound-mode" class="form-control" onchange="toggleOutboundInputs(this.value)">
              <option value="direct">Direct (Edge Egress)</option>
              <option value="socks5">SOCKS5 Proxy Tunnel</option>
              <option value="backend">Backend VPS Forwarding</option>
            </select>
          </div>

          <div id="socks5-fields" class="hidden" style="border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 1rem;">
            <h4 style="margin-bottom: 0.5rem; font-size: 0.95rem;">SOCKS5 Configuration</h4>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.5rem;">
              <div class="form-group">
                <label>Host / IP</label>
                <input type="text" id="socks5-host" class="form-control" placeholder="1.2.3.4">
              </div>
              <div class="form-group">
                <label>Port</label>
                <input type="number" id="socks5-port" class="form-control" placeholder="1080">
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
              <div class="form-group">
                <label>Username (Optional)</label>
                <input type="text" id="socks5-user" class="form-control">
              </div>
              <div class="form-group">
                <label>Password (Optional)</label>
                <input type="password" id="socks5-pass" class="form-control">
              </div>
            </div>
          </div>

          <div id="backend-fields" class="hidden" style="border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 1rem;">
            <h4 style="margin-bottom: 0.5rem; font-size: 0.95rem;">Backend VPS Configuration</h4>
            <div class="form-group">
              <label>Backend URL</label>
              <input type="url" id="backend-url" class="form-control" placeholder="https://vps.example.com/ws">
            </div>
          </div>

          <button class="btn btn-primary" onclick="saveSettings()" style="margin-top: 1rem;" data-i18n="saveSettings">Save Settings</button>
        </div>
      </div>
    </div>
  </div>

  <!-- User Modal (Create / Edit) -->
  <div class="modal-overlay" id="modal-user">
    <div class="modal-card">
      <div class="modal-header">
        <h3 id="modal-user-title" data-i18n="addUser">User Details</h3>
        <button class="btn btn-sm btn-icon" onclick="closeModal('modal-user')">&times;</button>
      </div>
      <form onsubmit="handleSaveUser(event)">
        <input type="hidden" id="user-id">
        <div class="form-group">
          <label data-i18n="name">Name</label>
          <input type="text" id="user-name" class="form-control" required>
        </div>
        <div class="form-group">
          <label data-i18n="quotaGb">Quota (GB, 0 for unlimited)</label>
          <input type="number" step="0.1" min="0" id="user-quota" class="form-control" value="0">
        </div>
        <div class="form-group">
          <label data-i18n="expiryDate">Expiry Date (optional)</label>
          <input type="date" id="user-expiry" class="form-control">
        </div>
        <div class="form-group">
          <label data-i18n="note">Note / Remarks</label>
          <input type="text" id="user-note" class="form-control" placeholder="e.g. Phone, friend, location">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" onclick="closeModal('modal-user')" data-i18n="cancel">Cancel</button>
          <button type="submit" class="btn btn-primary" data-i18n="save">Save</button>
        </div>
      </form>
    </div>
  </div>

  <!-- QR & Share Link Modal -->
  <div class="modal-overlay" id="modal-qr">
    <div class="modal-card">
      <div class="modal-header">
        <h3 id="modal-qr-title" data-i18n="shareConfig">Share Connection</h3>
        <button class="btn btn-sm btn-icon" onclick="closeModal('modal-qr')">&times;</button>
      </div>
      <div class="form-group">
        <label data-i18n="selectEndpoint">Endpoint</label>
        <select id="qr-endpoint-select" class="form-control" onchange="renderSelectedLink()"></select>
      </div>

      <div class="qr-container" id="qr-svg-box">
        <!-- SVG QR code rendered here -->
      </div>

      <div class="form-group">
        <label data-i18n="vlessLink">VLESS Link</label>
        <div style="display: flex; gap: 0.4rem;">
          <input type="text" id="qr-vless-url" class="form-control" readonly>
          <button class="btn btn-sm" onclick="copyInput('qr-vless-url')" data-i18n="copy">Copy</button>
        </div>
      </div>

      <div class="form-group">
        <label data-i18n="subLink">Subscription URL</label>
        <div style="display: flex; gap: 0.4rem;">
          <input type="text" id="qr-sub-url" class="form-control" readonly>
          <button class="btn btn-sm" onclick="copyInput('qr-sub-url')" data-i18n="copy">Copy</button>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn" onclick="closeModal('modal-qr')" data-i18n="close">Close</button>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div id="toast" class="toast"></div>

  <script>
    // --- Internationalization & Translations ---
    const I18N = {
      en: {
        logout: "Logout",
        loginTitle: "Admin Authentication",
        username: "Username",
        password: "Password",
        signIn: "Sign In",
        usersTab: "Users",
        settingsTab: "Settings",
        addUser: "Add User",
        name: "Name",
        status: "Status",
        usage: "Data Usage",
        expires: "Expires",
        actions: "Actions",
        endpointsTitle: "Endpoints & Clean IPs",
        endpointsDesc: "Configure custom addresses (e.g. clean Cloudflare IPs or custom domain names) for generating client configs.",
        addEndpoint: "+ Add Endpoint",
        outboundTitle: "Outbound Proxy Mode",
        mode: "Egress Mode",
        saveSettings: "Save Settings",
        quotaGb: "Quota (GB, 0 for unlimited)",
        expiryDate: "Expiry Date (optional)",
        note: "Note / Remarks",
        cancel: "Cancel",
        save: "Save",
        shareConfig: "Share Connection",
        selectEndpoint: "Endpoint",
        vlessLink: "VLESS Link",
        subLink: "Subscription URL",
        close: "Close",
        active: "Active",
        disabled: "Disabled",
        expired: "Expired",
        overQuota: "Over Quota",
        copied: "Copied to clipboard!",
        unlimited: "Unlimited",
        never: "Never",
        confirmDelete: "Are you sure you want to delete this user?",
        resetUsageConfirm: "Reset used traffic for this user?",
        regenUuidConfirm: "Regenerate UUID? Old links will stop working.",
        regenSubConfirm: "Regenerate subscription token? Old subscription links will stop working."
      },
      fa: {
        logout: "خروج",
        loginTitle: "ورود به پنل مدیریت",
        username: "نام کاربری",
        password: "رمز عبور",
        signIn: "ورود",
        usersTab: "کاربران",
        settingsTab: "تنظیمات",
        addUser: "افزودن کاربر",
        name: "نام",
        status: "وضعیت",
        usage: "میزان مصرف",
        expires: "تاریخ انقضا",
        actions: "عملیات",
        endpointsTitle: "اندپوینت‌ها و آی‌پی تمیز",
        endpointsDesc: "آدرس‌های اختصاصی و آی‌پی‌های تمیز کلودفلر را برای اتصال بهینه کاربران ثبت کنید.",
        addEndpoint: "+ افزودن اندپوینت",
        outboundTitle: "حالت خروجی پروکسی",
        mode: "نوع خروجی اینترنت",
        saveSettings: "ذخیره تنظیمات",
        quotaGb: "حجم مجاز (گیگابایت، ۰ یعنی نامحدود)",
        expiryDate: "تاریخ انقضا (اختیاری)",
        note: "یادداشت / توضیحات",
        cancel: "انصراف",
        save: "ذخیره",
        shareConfig: "اشتراک‌گذاری اتصال",
        selectEndpoint: "انتخاب اندپوینت",
        vlessLink: "لینک VLESS",
        subLink: "لینک اشتراک",
        close: "بستن",
        active: "فعال",
        disabled: "غیرفعال",
        expired: "منقضی شده",
        overQuota: "پایان حجم",
        copied: "کپی شد!",
        unlimited: "نامحدود",
        never: "نامحدود",
        confirmDelete: "آیا از حذف این کاربر اطمینان دارید؟",
        resetUsageConfirm: "آیا میزان مصرف این کاربر صفر شود؟",
        regenUuidConfirm: "شناسه UUID جدید ایجاد شود؟ لینک‌های قبلی از کار خواهند افتاد.",
        regenSubConfirm: "توکن اشتراک جدید ایجاد شود؟ لینک اشتراک قبلی از کار خواهد افتاد."
      }
    };

    let currentLang = localStorage.getItem("lumen_lang") || "en";
    let currentTheme = localStorage.getItem("lumen_theme") || "dark";
    let currentUserLinks = [];
    let currentActiveUser = null;
    let globalSettings = { endpoints: [], outbound_mode: "direct" };

    function applyLanguage(lang) {
      currentLang = lang;
      localStorage.setItem("lumen_lang", lang);
      document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
      document.documentElement.lang = lang;

      const dict = I18N[lang] || I18N.en;
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) el.textContent = dict[key];
      });
      document.getElementById("search-input").placeholder = lang === "fa" ? "جستجوی کاربر..." : "Search users...";
    }

    function toggleLanguage() {
      applyLanguage(currentLang === "en" ? "fa" : "en");
      renderUsers();
    }

    function applyTheme(theme) {
      currentTheme = theme;
      localStorage.setItem("lumen_theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }

    function toggleTheme() {
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    }

    function showToast(msg) {
      const toast = document.getElementById("toast");
      toast.textContent = msg;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }

    function copyInput(id) {
      const el = document.getElementById(id);
      el.select();
      navigator.clipboard.writeText(el.value).then(() => {
        showToast(I18N[currentLang].copied);
      });
    }

    // --- State & Navigation ---
    let usersList = [];

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          showDashboard();
        } else {
          showLogin();
        }
      } catch {
        showLogin();
      }
    }

    function showLogin() {
      document.getElementById("view-login").classList.remove("hidden");
      document.getElementById("view-dashboard").classList.add("hidden");
      document.getElementById("btn-logout").classList.add("hidden");
    }

    function showDashboard() {
      document.getElementById("view-login").classList.add("hidden");
      document.getElementById("view-dashboard").classList.remove("hidden");
      document.getElementById("btn-logout").classList.remove("hidden");
      loadUsers();
      loadSettings();
    }

    async function handleLogin(e) {
      e.preventDefault();
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;
      const errBox = document.getElementById("login-error");
      errBox.classList.add("hidden");

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {
          showDashboard();
        } else {
          errBox.textContent = data.error || "Login failed";
          errBox.classList.remove("hidden");
        }
      } catch (err) {
        errBox.textContent = "Network error. Try again.";
        errBox.classList.remove("hidden");
      }
    }

    async function logout() {
      await fetch("/api/auth/logout", { method: "POST" });
      showLogin();
    }

    function switchTab(tab) {
      if (tab === "users") {
        document.getElementById("tab-users").classList.add("active");
        document.getElementById("tab-settings").classList.remove("active");
        document.getElementById("content-users").classList.remove("hidden");
        document.getElementById("content-settings").classList.add("hidden");
      } else {
        document.getElementById("tab-settings").classList.add("active");
        document.getElementById("tab-users").classList.remove("active");
        document.getElementById("content-settings").classList.remove("hidden");
        document.getElementById("content-users").classList.add("hidden");
      }
    }

    // --- Users Management ---
    async function loadUsers() {
      const search = document.getElementById("search-input").value;
      const q = search ? "?search=" + encodeURIComponent(search) : "";
      try {
        const res = await fetch("/api/users" + q);
        if (res.ok) {
          const data = await res.json();
          usersList = data.users || [];
          renderUsers();
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    }

    function handleSearch() {
      loadUsers();
    }

    function formatBytes(bytes) {
      if (!bytes || bytes === 0) return "0 B";
      const units = ["B", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, i)).toFixed(2) + " " + units[i];
    }

    function renderUsers() {
      const tbody = document.getElementById("users-tbody");
      tbody.innerHTML = "";
      const dict = I18N[currentLang];

      if (usersList.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5' style='text-align:center; color:var(--text-muted); padding:2rem;'>No users found</td></tr>";
        return;
      }

      usersList.forEach(u => {
        const tr = document.createElement("tr");

        let statusBadge = '<span class="badge badge-active">' + dict.active + '</span>';
        const now = Math.floor(Date.now() / 1000);
        if (!u.enabled) {
          statusBadge = '<span class="badge badge-disabled">' + dict.disabled + '</span>';
        } else if (u.expires_at && u.expires_at < now) {
          statusBadge = '<span class="badge badge-expired">' + dict.expired + '</span>';
        } else if (u.quota_bytes > 0 && u.used_bytes >= u.quota_bytes) {
          statusBadge = '<span class="badge badge-quota">' + dict.overQuota + '</span>';
        }

        // Usage percentage
        let percent = 0;
        let fillClass = "";
        if (u.quota_bytes > 0) {
          percent = Math.min(100, Math.round((u.used_bytes / u.quota_bytes) * 100));
          if (percent > 90) fillClass = "danger";
          else if (percent > 75) fillClass = "warning";
        }
        const usageText = formatBytes(u.used_bytes) + " / " + (u.quota_bytes > 0 ? formatBytes(u.quota_bytes) : dict.unlimited);

        // Expiry text
        const expiryText = u.expires_at ? new Date(u.expires_at * 1000).toLocaleDateString() : dict.never;

        tr.innerHTML = \`
          <td>
            <div style="font-weight:600;">\${escapeHtml(u.name)}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">\${escapeHtml(u.note || "")}</div>
          </td>
          <td>\${statusBadge}</td>
          <td style="min-width: 140px;">
            <div style="font-size:0.8rem;">\${usageText}</div>
            \${u.quota_bytes > 0 ? '<div class="progress-bar"><div class="progress-fill ' + fillClass + '" style="width:' + percent + '%"></div></div>' : ''}
          </td>
          <td>\${expiryText}</td>
          <td>
            <div style="display:flex; gap:0.3rem; flex-wrap:wrap;">
              <button class="btn btn-sm btn-primary" onclick="openShareModal(\${u.id})">🔗</button>
              <button class="btn btn-sm" onclick="toggleUserStatus(\${u.id}, \${!u.enabled})">\${u.enabled ? '⏸' : '▶'}</button>
              <button class="btn btn-sm" onclick="openEditUserModal(\${u.id})">✏️</button>
              <button class="btn btn-sm btn-danger" onclick="deleteUserPrompt(\${u.id})">🗑️</button>
            </div>
          </td>
        \`;
        tbody.appendChild(tr);
      });
    }

    function escapeHtml(str) {
      return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Modal helpers
    function openModal(id) {
      document.getElementById(id).classList.add("open");
    }
    function closeModal(id) {
      document.getElementById(id).classList.remove("open");
    }

    function openCreateUserModal() {
      document.getElementById("modal-user-title").textContent = I18N[currentLang].addUser;
      document.getElementById("user-id").value = "";
      document.getElementById("user-name").value = "";
      document.getElementById("user-quota").value = "0";
      document.getElementById("user-expiry").value = "";
      document.getElementById("user-note").value = "";
      openModal("modal-user");
    }

    function openEditUserModal(id) {
      const user = usersList.find(u => u.id === id);
      if (!user) return;
      document.getElementById("modal-user-title").textContent = "Edit " + user.name;
      document.getElementById("user-id").value = user.id;
      document.getElementById("user-name").value = user.name;
      document.getElementById("user-quota").value = user.quota_bytes > 0 ? (user.quota_bytes / (1024 * 1024 * 1024)).toFixed(1) : "0";
      if (user.expires_at) {
        const d = new Date(user.expires_at * 1000);
        document.getElementById("user-expiry").value = d.toISOString().split("T")[0];
      } else {
        document.getElementById("user-expiry").value = "";
      }
      document.getElementById("user-note").value = user.note || "";
      openModal("modal-user");
    }

    async function handleSaveUser(e) {
      e.preventDefault();
      const id = document.getElementById("user-id").value;
      const name = document.getElementById("user-name").value;
      const quotaGb = parseFloat(document.getElementById("user-quota").value) || 0;
      const quota_bytes = Math.round(quotaGb * 1024 * 1024 * 1024);
      const expiryVal = document.getElementById("user-expiry").value;
      const expires_at = expiryVal ? Math.floor(new Date(expiryVal).getTime() / 1000) : null;
      const note = document.getElementById("user-note").value;

      const payload = { name, quota_bytes, expires_at, note };

      try {
        const res = await fetch(id ? "/api/users/" + id : "/api/users", {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          closeModal("modal-user");
          loadUsers();
          showToast(I18N[currentLang].saved || "User saved!");
        } else {
          const err = await res.json();
          alert(err.error || "Save failed");
        }
      } catch (err) {
        alert("Network error");
      }
    }

    async function toggleUserStatus(id, enabled) {
      await fetch("/api/users/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled })
      });
      loadUsers();
    }

    async function deleteUserPrompt(id) {
      if (confirm(I18N[currentLang].confirmDelete)) {
        await fetch("/api/users/" + id, { method: "DELETE" });
        loadUsers();
      }
    }

    // --- Share / QR Modal ---
    async function openShareModal(id) {
      try {
        const res = await fetch("/api/users/" + id);
        if (!res.ok) return;
        const data = await res.json();
        currentActiveUser = data.user;
        currentUserLinks = data.links || [];

        const select = document.getElementById("qr-endpoint-select");
        select.innerHTML = "";
        currentUserLinks.forEach((l, idx) => {
          const opt = document.createElement("option");
          opt.value = idx;
          opt.textContent = l.label;
          select.appendChild(opt);
        });

        const subUrl = window.location.origin + "/sub/" + currentActiveUser.sub_token;
        document.getElementById("qr-sub-url").value = subUrl;

        renderSelectedLink();
        openModal("modal-qr");
      } catch (err) {
        console.error(err);
      }
    }

    function renderSelectedLink() {
      const select = document.getElementById("qr-endpoint-select");
      const idx = parseInt(select.value) || 0;
      const link = currentUserLinks[idx] ? currentUserLinks[idx].url : "";
      document.getElementById("qr-vless-url").value = link;

      // Render QR code
      const qrBox = document.getElementById("qr-svg-box");
      qrBox.innerHTML = "";
      if (link) {
        // Generate QR code using inline generator
        qrBox.innerHTML = generateQrSvgClient(link, 220);
      }
    }

    // Minimal In-Browser SVG QR code generator (identical mathematical formulation)
    function generateQrSvgClient(text, size) {
      return \`<img src="/api/users/\${currentActiveUser.id}/qr?link_index=\${document.getElementById("qr-endpoint-select").value || 0}" width="\${size}" height="\${size}" alt="QR Code">\`;
    }

    // --- Settings Management ---
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          globalSettings = await res.json();
          document.getElementById("setting-outbound-mode").value = globalSettings.outbound_mode || "direct";
          toggleOutboundInputs(globalSettings.outbound_mode);

          if (globalSettings.socks5_config) {
            document.getElementById("socks5-host").value = globalSettings.socks5_config.host || "";
            document.getElementById("socks5-port").value = globalSettings.socks5_config.port || "";
            document.getElementById("socks5-user").value = globalSettings.socks5_config.username || "";
            document.getElementById("socks5-pass").value = globalSettings.socks5_config.password || "";
          }

          if (globalSettings.backend_config) {
            document.getElementById("backend-url").value = globalSettings.backend_config.url || "";
          }

          renderEndpointsList();
        }
      } catch (err) {
        console.error(err);
      }
    }

    function toggleOutboundInputs(mode) {
      document.getElementById("socks5-fields").classList.toggle("hidden", mode !== "socks5");
      document.getElementById("backend-fields").classList.toggle("hidden", mode !== "backend");
    }

    function renderEndpointsList() {
      const container = document.getElementById("endpoints-list");
      container.innerHTML = "";
      const endpoints = globalSettings.endpoints || [];

      endpoints.forEach((ep, idx) => {
        const row = document.createElement("div");
        row.style.cssText = "display:grid; grid-template-columns: 2fr 3fr 1fr 2fr 1fr; gap:0.4rem; margin-bottom:0.5rem; align-items:center;";
        row.innerHTML = \`
          <input type="text" class="form-control form-control-sm" placeholder="Label" value="\${escapeHtml(ep.label)}" onchange="updateEndpointField(\${idx}, 'label', this.value)">
          <input type="text" class="form-control form-control-sm" placeholder="Address/IP" value="\${escapeHtml(ep.address)}" onchange="updateEndpointField(\${idx}, 'address', this.value)">
          <input type="number" class="form-control form-control-sm" placeholder="Port" value="\${ep.port || 443}" onchange="updateEndpointField(\${idx}, 'port', parseInt(this.value))">
          <input type="text" class="form-control form-control-sm" placeholder="SNI / Host" value="\${escapeHtml(ep.sni || '')}" onchange="updateEndpointField(\${idx}, 'sni', this.value)">
          <button class="btn btn-sm btn-danger" onclick="removeEndpointRow(\${idx})">&times;</button>
        \`;
        container.appendChild(row);
      });
    }

    function updateEndpointField(idx, field, val) {
      if (globalSettings.endpoints[idx]) {
        globalSettings.endpoints[idx][field] = val;
        if (field === "sni") {
          globalSettings.endpoints[idx]["host"] = val;
        }
      }
    }

    function addEndpointRow() {
      if (!globalSettings.endpoints) globalSettings.endpoints = [];
      globalSettings.endpoints.push({
        label: "Node " + (globalSettings.endpoints.length + 1),
        address: window.location.hostname,
        port: 443,
        sni: window.location.hostname,
        host: window.location.hostname
      });
      renderEndpointsList();
    }

    function removeEndpointRow(idx) {
      globalSettings.endpoints.splice(idx, 1);
      renderEndpointsList();
    }

    async function saveSettings() {
      const mode = document.getElementById("setting-outbound-mode").value;
      const socks5_config = {
        host: document.getElementById("socks5-host").value.trim(),
        port: parseInt(document.getElementById("socks5-port").value) || 1080,
        username: document.getElementById("socks5-user").value.trim() || undefined,
        password: document.getElementById("socks5-pass").value || undefined,
      };
      const backend_config = {
        url: document.getElementById("backend-url").value.trim(),
      };

      const payload = {
        outbound_mode: mode,
        endpoints: globalSettings.endpoints,
        socks5_config,
        backend_config
      };

      try {
        const res = await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast(I18N[currentLang].saveSettings + " - OK!");
        } else {
          alert("Failed to save settings");
        }
      } catch {
        alert("Network error");
      }
    }

    // Initialize UI
    applyLanguage(currentLang);
    applyTheme(currentTheme);
    checkAuth();
  </script>
</body>
</html>`;
}
