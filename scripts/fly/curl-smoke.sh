## <!-- BEGIN RBP GENERATED: Fly-MinDocker -->
#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-}"
if [[ -z "${BASE}" ]]; then
  echo "Usage: $0 https://<app>.fly.dev"; exit 2
fi
curl -sSf "$BASE/ping" >/dev/null
curl -sS "$BASE/apps/proxy/api/catalog/products?tags=steelhead&limit=3" | jq -e '.applied.limit==3 and (.items|type=="array")' >/dev/null
HDRS=$(curl -sSI "$BASE/apps/proxy/api/catalog/products?page=1&pageSize=10")
grep -q "X-RBP-Page" <<<"$HDRS"
grep -q "X-RBP-PageSize" <<<"$HDRS"
echo "Smoke OK against $BASE"
## <!-- END RBP GENERATED: Fly-MinDocker -->
