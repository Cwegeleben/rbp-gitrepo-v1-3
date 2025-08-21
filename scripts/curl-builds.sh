#!/usr/bin/env bash
set -euo pipefail

# 1) Manual local port if provided
if [ -f scripts/port.env ]; then
	# shellcheck disable=SC1091
	source scripts/port.env
fi

# 2) Allow env override: PORT=12345 pnpm curl:builds
PORT="${PORT:-}"

# 3) If still empty, fall back to auto-discovery
if [ -z "$PORT" ]; then
	PORT="$(bash scripts/discover-port.sh || true)"
fi
if [ -z "$PORT" ]; then
	echo "PORT not set and auto-discovery failed. Set scripts/port.env or run: PORT=<port> pnpm curl:builds" >&2
	exit 1
fi

BASE="http://localhost:$PORT"
API="$BASE/apps/proxy/api/builds"

# Define PKG_API before its usage
PKG_API="$BASE/apps/proxy/api/checkout/package"

# Status helpers
ok() { echo "✅ PASS $1"; }
bad() { echo "❌ FAIL $1 — $2"; }



# Helper: ensure build and ID
ensure_build_and_id() {
	if [ -z "${ID:-}" ]; then
		RESP=$(curl -s -w "\n%{http_code}" -X POST "$API" \
			-H "content-type: application/json" --data '{"title":"CLI Test Build"}')
		BODY=$(echo "$RESP" | head -n1); CODE=$(echo "$RESP" | tail -n1)
		if [ "$CODE" != "200" ]; then
			bad "Create build (ensure_build_and_id)" "code=$CODE"; return 1
		fi
		ID=$(echo "$BODY" | jq -r '.id // empty')
		if [ -z "$ID" ]; then bad "Create build (ensure_build_and_id)" "no id in body"; return 1; fi
		ok "Create build (ensure_build_and_id, id=$ID)"
	fi
}


# Helper: seed demo items into build
seed_demo_items_on_build() {
	ensure_build_and_id || return 1
	# Add seeded demo items to the build (1x seat, 2x guides)
	CODE=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH "$API/$ID" \
		-H "content-type: application/json" \
		--data '{"items":[
		{"slot":"Product","label":"Demo Seat","productId":"rbp-demo-seat","quantity":1},
		{"slot":"Product","label":"Demo Guides","productId":"rbp-demo-guides","quantity":2}
		]}')
	[ "$CODE" = "200" ] || bad "Seed items into build" "PATCH code=$CODE"
}


package_get() {
	seed_demo_items_on_build
	RESP=$(curl -s -w "\n%{http_code}" "$PKG_API?buildId=$ID")
	BODY=$(echo "$RESP" | head -n1)
	CODE=$(echo "$RESP" | tail -n1)
	if [[ "$CODE" == "200" ]] && [[ "$(echo "$BODY" | jq 'has("items") and has("cart") and has("totalItems")')" == "true" ]]; then
		ok "Checkout package GET (200)"
	else
		bad "Checkout package GET" "code=$CODE body=$(echo "$BODY" | jq -c . 2>/dev/null || echo "$BODY")"
	fi
}


package_cartpath_expected() {
	PKG=$(curl -s "$PKG_API?buildId=$ID")
	CARTPATH=$(echo "$PKG" | jq -r '.cart.cartPath // empty')
	if echo "$CARTPATH" | grep -Eq '^/cart/(1111111111:1,2222222222:2|2222222222:2,1111111111:1)$'; then
		ok "Cart path matches seeded variantIds ($CARTPATH)"
	else
		bad "Cart path" "expected seeded IDs, got '$CARTPATH'"
	fi
}


# Guarantee we have a build id and seeded demo items before packaging
seed_demo_items_on_build || true

# Run packager checks
package_get
package_cartpath_expected
