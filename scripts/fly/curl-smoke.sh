#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-}"
if [[ -z "${BASE}" ]]; then
  echo "Usage: $0 https://<app>.fly.dev"; exit 2
fi
curl -sSf "$BASE/ping" >/dev/null
curl -sS "$BASE/apps/proxy/api/catalog/products?tags=steelhead&limit=3" | jq -e '.applied.limit==3 and (.items|type=="array")' >/dev/null
HEADERS=$(curl -sSI "$BASE/apps/proxy/api/catalog/products?page=1&pageSize=10")
echo "$HEADERS" | grep -q "X-RBP-Page" >/dev/null
echo "$HEADERS" | grep -q "X-RBP-PageSize" >/dev/null
echo "Smoke OK against $BASE"
