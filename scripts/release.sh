#!/usr/bin/env bash
set -euo pipefail

# Determine version tag
VERSION="${1:-}"
if [ -z "$VERSION" ]; then
  # Read from package.json
  PKG_VERSION=$(grep '"version"' package.json | head -1 | awk -F: '{ print $2 }' | sed 's/[", ]//g')
  VERSION="v${PKG_VERSION}"
fi

# Ensure version starts with 'v'
if [[ ! "$VERSION" =~ ^v ]]; then
  VERSION="v$VERSION"
fi

echo "======================================"
echo " Preparing lumen-edge Release: $VERSION"
echo "======================================"

# 1. Typecheck & Tests
echo "-> Running typecheck..."
bun run typecheck

echo "-> Running tests..."
bun test

# 2. Build single worker artifact
echo "-> Building minified dist/worker.js..."
bun run build

if [ ! -f "dist/worker.js" ]; then
  echo "Error: dist/worker.js was not generated."
  exit 1
fi

FILE_SIZE=$(du -h dist/worker.js | cut -f1)
echo "-> Generated dist/worker.js ($FILE_SIZE)"

# 3. Create GitHub Release using gh CLI
echo "-> Creating GitHub release $VERSION..."
NOTES="### lumen-edge $VERSION

Personal single-owner edge proxy & bilingual admin panel for Cloudflare Workers.

#### Artifacts
- \`dist/worker.js\` ($FILE_SIZE): Self-contained, minified deployment bundle with embedded panel UI.

#### Highlights
- VLESS over WebSocket with cloudflare:sockets
- Direct, SOCKS5, and VPS Backend outbound modes
- Per-user token subscriptions and SVG QR code generation
- Bilingual English / Persian (فارسی) RTL admin panel
- In-memory active UUID cache & best-effort asynchronous traffic accounting"

gh release create "$VERSION" dist/worker.js --title "$VERSION" --notes "$NOTES"

echo "======================================"
echo " Successfully published release: $VERSION"
echo "======================================"
