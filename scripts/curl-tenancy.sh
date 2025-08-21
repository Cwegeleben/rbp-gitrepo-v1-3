#!/usr/bin/env bash
set -euo pipefail

# Load manual port if present; otherwise discover
if [ -f scripts/port.env ]; then source scripts/port.env || true; fi
PORT="${PORT:-}"
if [ -z "$PORT" ]; then PORT="$(bash scripts/discover-port.sh || true)"; fi
[ -n "$PORT" ] || { echo "Set PORT or add scripts/port.env"; exit 1; }

BASE="http://localhost:$PORT"
API="$BASE/apps/proxy/api"
SHOP_A="demo.myshopify.com"
SHOP_B="alt-demo.myshopify.com"

PASS=0; FAIL=0
ok(){ echo "✅ $1"; PASS=$((PASS+1)); }
bad(){ echo "❌ $1 — $2"; FAIL=$((FAIL+1)); }

need(){ command -v "$1" >/dev/null || { echo "Missing $1"; exit 1; }; }
need curl; need jq

# 1) Create build under SHOP_A (query param)
RESP=$(curl -s -X POST "$API/builds?shop=$SHOP_A" -H "content-type: application/json" --data '{"title":"Tenant A Build"}')
ID=$(echo "$RESP" | jq -r '.id // empty')
[ -n "$ID" ] && ok "Create build (tenant=$SHOP_A, id=$ID)" || bad "Create build" "$RESP"

# 2) Seed items (handles) under SHOP_A
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH "$API/builds/$ID?shop=$SHOP_A" \
  -H "content-type: application/json" --data '{"items":[
    {"slot":"Product","label":"Demo Seat","productId":"rbp-demo-seat","quantity":1},
    {"slot":"Product","label":"Demo Guides","productId":"rbp-demo-guides","quantity":2}
  ]}')
[ "$CODE" = "200" ] && ok "Seed items under SHOP_A" || bad "Seed items" "code=$CODE"

# 3) List isolation
LIST_A=$(curl -s "$API/builds?shop=$SHOP_A")
LIST_B=$(curl -s "$API/builds?shop=$SHOP_B")
echo "$LIST_A" | jq -e --arg id "$ID" 'map(.id) | index($id) != null' >/dev/null && ok "List A contains ID" || bad "List A contains ID" "$(echo "$LIST_A" | jq -c .)"
echo "$LIST_B" | jq -e --arg id "$ID" 'map(.id) | index($id) == null' >/dev/null && ok "List B excludes ID" || bad "List B excludes ID" "$(echo "$LIST_B" | jq -c .)"

# 4) Read + Package under SHOP_A
GET_A=$(curl -s -w "\n%{http_code}" "$API/builds/$ID?shop=$SHOP_A")
BODY_A=$(echo "$GET_A" | head -n1); CODE_A=$(echo "$GET_A" | tail -n1)
[ "$CODE_A" = "200" ] && ok "GET build under SHOP_A" || bad "GET under SHOP_A" "code=$CODE_A"
PKG_A=$(curl -s "$API/checkout/package?buildId=$ID&shop=$SHOP_A")
if echo "$PKG_A" | jq -e 'has("items") and has("cart") and has("totalItems")' >/dev/null; then
  ok "Package under SHOP_A (shape OK)"
else
  bad "Package under SHOP_A" "$(echo "$PKG_A" | jq -c . 2>/dev/null || echo "$PKG_A")"
fi

# 5) Cross-tenant 404 under SHOP_B
CODE_B=$(curl -s -o /dev/null -w "%{http_code}" "$API/builds/$ID?shop=$SHOP_B")
[ "$CODE_B" != "200" ] && ok "Cross-tenant GET returns non-200 ($CODE_B)" || bad "Cross-tenant GET" "unexpected 200"
PKG_B_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API/checkout/package?buildId=$ID&shop=$SHOP_B")
[ "$PKG_B_CODE" != "200" ] && ok "Cross-tenant package returns non-200 ($PKG_B_CODE)" || bad "Cross-tenant package" "unexpected 200"

# 6) Header vs query precedence (query wins)
R=$(curl -s "$API/builds/$ID?shop=$SHOP_A" -H "x-shopify-shop-domain: $SHOP_B")
TENANT=$(echo "$R" | jq -r '.tenant // empty')
[ "$TENANT" = "$SHOP_A" ] && ok "Query shop wins over header" || bad "Precedence" "tenant=$TENANT"

# 7) Cache header check
HDR=$(curl -sI "$API/builds?shop=$SHOP_A" | tr -d '\r' | awk -F': ' 'tolower($1)=="cache-control"{print tolower($2)}')
echo "$HDR" | grep -q "no-store" && ok "Cache-Control: no-store" || bad "Cache header" "$HDR"

TOTAL=$((PASS+FAIL))
echo
[ $FAIL -eq 0 ] && echo "All $PASS/$TOTAL tenancy checks passed on PORT=$PORT" && exit 0 || { echo "$PASS/$TOTAL passed, $FAIL failed on PORT=$PORT"; exit 1; }
