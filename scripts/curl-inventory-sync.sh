#!/usr/bin/env bash
# <!-- BEGIN RBP GENERATED: inventory-sync -->
set -euo pipefail

HOST="${APP_PROXY_HOST:-http://localhost:8080}"
SHOP="${SHOP_DOMAIN:-demo.myshopify.com}"

# <!-- BEGIN RBP GENERATED: mode-a -->
# Optional scope arg: rbp|tenant|both (default rbp)
SCOPE="${1:-rbp}"
# <!-- END RBP GENERATED: mode-a -->

curl -sS -X POST "${HOST}/apps/proxy/api/inventory/sync?shop=${SHOP}&scope=${SCOPE}" \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Shop-Domain: ${SHOP}" \
  -d '{}' | jq .
# <!-- END RBP GENERATED: inventory-sync -->
