#!/usr/bin/env bash
# Ensure a Fly volume exists for the given app/region/name; create if missing.
# Usage:
#   APP_SLUG=rbp-rod-builder-pro-staging REGION=sea VOLUME_NAME=data SIZE_GB=1 scripts/fly/ensure-volume.sh
# Or with args:
#   scripts/fly/ensure-volume.sh rbp-rod-builder-pro-staging sea data 1

set -euo pipefail

APP_SLUG=${APP_SLUG:-${1:-rbp-rod-builder-pro-staging}}
REGION=${REGION:-${2:-sea}}
VOLUME_NAME=${VOLUME_NAME:-${3:-data}}
SIZE_GB=${SIZE_GB:-${4:-1}}

if ! command -v fly >/dev/null 2>&1; then
  echo "fly CLI not found. Install from https://fly.io/docs/hands-on/install-flyctl/" >&2
  exit 2
fi

echo "[info] Checking volume '${VOLUME_NAME}' in app '${APP_SLUG}' (region=${REGION})"
# Fetch volumes list; tolerate non-zero by capturing output
list_output=$(fly volumes list -a "${APP_SLUG}" 2>/dev/null || true)

# Heuristic match: line contains name and region as separate columns
if printf "%s\n" "${list_output}" | grep -E "[[:space:]]${VOLUME_NAME}[[:space:]]" | grep -qE "[[:space:]]${REGION}[[:space:]]"; then
  echo "[ok] Volume '${VOLUME_NAME}' already exists in region ${REGION}."
  exit 0
fi

echo "[warn] Volume '${VOLUME_NAME}' not found in region ${REGION}. Creating (size=${SIZE_GB}GB)..."
set +e
fly volumes create "${VOLUME_NAME}" --region "${REGION}" --size "${SIZE_GB}" -a "${APP_SLUG}"
code=$?
set -e
if [ $code -ne 0 ]; then
  echo "[error] Failed to create volume. See output above." >&2
  exit $code
fi

echo "[done] Volume '${VOLUME_NAME}' created for app '${APP_SLUG}' in region ${REGION}."
exit 0
