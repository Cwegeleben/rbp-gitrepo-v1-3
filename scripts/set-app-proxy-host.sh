#!/usr/bin/env bash
set -euo pipefail
# Update the App Proxy host in shopify.app.toml to the current tunnel host (no path) and deploy config-only changes.
# Usage: scripts/set-app-proxy-host.sh https://<your-tunnel-host> [app-dir]

HOST_RAW="${1:-}"
APP_DIR="${2:-src/apps/rbp-shopify-app/rod-builder-pro}"
TOML="$APP_DIR/shopify.app.toml"

if [[ -z "$HOST_RAW" ]]; then
  echo "Usage: scripts/set-app-proxy-host.sh https://<your-tunnel-host> [app-dir]" >&2
  exit 1
fi
if [[ "$HOST_RAW" != http*://* ]]; then
  echo "HOST must start with http:// or https://" >&2
  exit 1
fi
if [[ ! -f "$TOML" ]]; then
  echo "shopify.app.toml not found at: $TOML" >&2
  exit 1
fi

# Normalize to scheme://host (strip any path, query, or hash)
HOST_NO_PATH="$HOST_RAW"
# Remove protocol into PROTO and HOST_PATH
PROTO="${HOST_NO_PATH%%://*}"
REST="${HOST_NO_PATH#*://}"
HOSTNAME_ONLY="${REST%%/*}"
HOST="$PROTO://$HOSTNAME_ONLY"

echo "Setting App Proxy host to: $HOST in $TOML"

if grep -q "^\[app_proxy\]" "$TOML"; then
  # Replace existing url in [app_proxy] block
  perl -0777 -pe "s|(\\[app_proxy\\][\\s\\S]*?url\\s*=\\s*\").*?(\"\\s*)|\\1$HOST\\2|" -i "$TOML"
else
  # Append an [app_proxy] block with default prefix
  cat >> "$TOML" <<EOF

[app_proxy]
url = "$HOST"
prefix = "/apps"
EOF
fi

# Deploy config-only changes
shopify app deploy --path="$APP_DIR"
