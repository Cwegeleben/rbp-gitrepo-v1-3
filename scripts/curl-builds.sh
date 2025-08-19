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

# Helper: ensure at least one item on build
ensure_item_on_build() {
	ensure_build_and_id || return 1
	RESP=$(curl -s "$API/$ID")
	COUNT=$(echo "$RESP" | jq '.items | length')
	if [ "${COUNT:-0}" -lt 1 ]; then
		ITEMS=$(echo "$RESP" | jq '.items + [{"slot":"Product","label":"CLI Item","productId":"p-demo","quantity":1}]')
		CODE=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH "$API/$ID" \
			-H "content-type: application/json" \
			--data "$(jq -nc --argjson items "$ITEMS" '{items: $items}')")
		if [ "$CODE" != "200" ]; then
			bad "Ensure item on build" "PATCH code=$CODE"; return 1
		fi
		ok "Added 1 item to build (ensure_item_on_build)"
	fi
}

package_get() {
	ensure_item_on_build
	RESP=$(curl -s -w "\n%{http_code}" "$PKG_API?buildId=$ID")
	BODY=$(echo "$RESP" | head -n1)
	CODE=$(echo "$RESP" | tail -n1)
	if [[ "$CODE" == "200" ]] && [[ "$(echo "$BODY" | jq 'has("items") and has("cart") and has("totalItems")')" == "true" ]]; then
		echo "✅ Checkout package GET (basic shape)"
	else
		echo "❌ FAIL Checkout package GET code=$CODE body=$(echo "$BODY" | jq -c . 2>/dev/null || echo "$BODY")"
	fi
}

package_cartpath_format() {
	PKG=$(curl -s "$PKG_API?buildId=$ID")
	CARTPATH=$(echo "$PKG" | jq -r '.cart.cartPath // empty')
	if [ -z "$CARTPATH" ]; then
		echo "✅ Cart path optional (null when variantIds unavailable)"
	else
		# Very light format sanity: starts with /cart/ and contains colon-separated pairs
		if echo "$CARTPATH" | grep -Eq '^/cart/[0-9]+:[0-9]+(,[0-9]+:[0-9]+)*$'; then
			echo "✅ Cart path format looks valid ($CARTPATH)"
		else
			echo "❌ FAIL Cart path format got '$CARTPATH'"
		fi
	fi
}

# Guarantee we have a build id and at least one item before packaging
ensure_item_on_build || true

# Run packager checks
package_get
package_cartpath_format
