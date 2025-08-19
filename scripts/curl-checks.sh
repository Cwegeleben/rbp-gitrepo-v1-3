#!/usr/bin/env bash
set -euo pipefail
if [ -f scripts/port.env ]; then
  # shellcheck disable=SC1091
  source scripts/port.env
fi

PORT="${PORT:-}"
if [ -z "$PORT" ]; then
  PORT="$(bash scripts/discover-port.sh || true)"
fi
if [ -z "$PORT" ]; then
  echo "PORT not set and auto-discovery failed. Set scripts/port.env or run: PORT=<port> pnpm curl:checks" >&2
  exit 1
fi

BASE="http://localhost:$PORT"
API="$BASE/apps/proxy/api/builds"
PASS=0
FAIL=0
CHECKS=0
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Check for curl and jq
for bin in curl jq; do
  if ! command -v "$bin" &>/dev/null; then
    echo "Missing $bin. Install with: brew install $bin" >&2
    exit 1
  fi
done

color_echo() {
  if [ -t 1 ]; then
    echo -e "$1$2$NC"
  else
    echo "$2"
  fi
}

check() {
  local name="$1"; shift
  local cmd="$1"; shift
  local jqexp="$1"; shift
  local expect="$1"; shift
  local out err val
  CHECKS=$((CHECKS+1))
  set +e
  out=$(eval "$cmd" 2>/dev/null)
  err=$?
  if [ $err -ne 0 ]; then
    color_echo "$RED" "❌ FAIL $name (curl error)"
    FAIL=$((FAIL+1))
    set -e
    return
  fi
  val=$(echo "$out" | jq -e "$jqexp" 2>/dev/null)
  if [ "$val" == "$expect" ] || [ "$expect" == "any" -a -n "$val" ]; then
    color_echo "$GREEN" "✅ PASS $name"
    PASS=$((PASS+1))
  else
    color_echo "$RED" "❌ FAIL $name (got: $val, expected: $expect)"
    FAIL=$((FAIL+1))
  fi
  set -e
}

# 1. Collections returns array > 0
check "Collections returns array > 0" "curl -s $BASE/apps/proxy/api/catalog/collections" "length > 0" "true"

# 2. Products returns array (limit=5)
check "Products returns array (limit=5)" "curl -s $BASE/apps/proxy/api/catalog/products?limit=5" "type == \"array\"" "true"

# 3. Peek fields on first collection
check "Peek fields on first collection" "curl -s $BASE/apps/proxy/api/catalog/collections" ".[0] | has(\"id\") and has(\"handle\") and has(\"title\") and has(\"productCount\")" "true"

# 4. Peek fields on first product
check "Peek fields on first product" "curl -s $BASE/apps/proxy/api/catalog/products?limit=1" ".[0] | has(\"id\") and has(\"title\") and has(\"handle\") and has(\"vendor\") and has(\"price\") and has(\"collections\")" "true"

# 5. Filter by collection (handle) returns array
HANDLE=$(curl -s $BASE/apps/proxy/api/catalog/collections | jq -r '.[0].handle')
check "Filter by collection (handle) returns array" "curl -s $BASE/apps/proxy/api/catalog/products?collection=$HANDLE&limit=5" "type == \"array\"" "true"

# 6. Filter by collection (id) returns array
CID=$(curl -s $BASE/apps/proxy/api/catalog/collections | jq -r '.[0].id')
check "Filter by collection (id) returns array" "curl -s $BASE/apps/proxy/api/catalog/products?collection=$CID&limit=5" "type == \"array\"" "true"

# 7. Default limit is 20
check "Default limit is 20" "curl -s $BASE/apps/proxy/api/catalog/products" "length == 20" "true"

# 8. Limit capped at 100
check "Limit capped at 100" "curl -s $BASE/apps/proxy/api/catalog/products?limit=999" "length == 100" "true"

# 9. Cache disabled (HEAD)
CACHE=$(curl -I -s $BASE/apps/proxy/api/catalog/collections | grep -i cache-control)
if echo "$CACHE" | grep -iq no-store; then
  color_echo "$GREEN" "✅ PASS Cache disabled (no-store header)"
  PASS=$((PASS+1))
else
  color_echo "$RED" "❌ FAIL Cache disabled (missing no-store header)"
  FAIL=$((FAIL+1))
fi
CHECKS=$((CHECKS+1))

# 10. Error surface (bogus collection)
ERR=$(curl -s -w "\n%{http_code}" $BASE/apps/proxy/api/catalog/products?collection=__nope__)
BODY=$(echo "$ERR" | head -n1)
CODE=$(echo "$ERR" | tail -n1)
if [ "$CODE" == "200" ]; then
  TYPE=$(echo "$BODY" | jq -r 'type')
  if [ "$TYPE" == "array" ]; then
    color_echo "$GREEN" "✅ PASS Error surface (bogus collection, 200 array)"
    PASS=$((PASS+1))
  else
    color_echo "$RED" "❌ FAIL Error surface (bogus collection, 200 not array)"
    FAIL=$((FAIL+1))
  fi
elif [ "$CODE" == "500" ]; then
  HASERR=$(echo "$BODY" | jq -e 'has("error") and has("message")' 2>/dev/null)
  if [ "$HASERR" == "true" ]; then
    color_echo "$GREEN" "✅ PASS Error surface (bogus collection, 500 error/message)"
    PASS=$((PASS+1))
  else
    color_echo "$RED" "❌ FAIL Error surface (bogus collection, 500 missing error/message)"
    FAIL=$((FAIL+1))
  fi
else
  color_echo "$RED" "❌ FAIL Error surface (bogus collection, unexpected code $CODE)"
  FAIL=$((FAIL+1))
fi
CHECKS=$((CHECKS+1))

# Summary
if [ $FAIL -eq 0 ]; then
  color_echo "$GREEN" "\nAll $PASS/$CHECKS checks passed."
  exit 0
else
  color_echo "$RED" "\n$PASS/$CHECKS checks passed, $FAIL failed."
  exit 1
fi
