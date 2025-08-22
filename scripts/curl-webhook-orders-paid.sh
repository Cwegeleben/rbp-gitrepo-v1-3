#!/usr/bin/env bash
# <!-- BEGIN RBP GENERATED: orders-commit-phase2 -->
set -euo pipefail

STORE_ORIGIN="${STORE_ORIGIN:-http://localhost:8080}"
DATA=${1:-'{"id":"1001","line_items":[{"properties":[{"name":"build_id","value":"build_1"},{"name":"sourcing_plan_id","value":"sp_1"}]}]}'}}

curl -sS -X POST "$STORE_ORIGIN/apps/proxy/api/webhooks/orders.paid" \
  -H "Content-Type: application/json" \
  -d "$DATA" | jq .
# <!-- END RBP GENERATED: orders-commit-phase2 -->
