#!/usr/bin/env bash
# <!-- BEGIN RBP GENERATED: hosting-staging-verify-v1-0 -->
set -euo pipefail

APP_SLUG=${APP_SLUG:-${1:-rbp-rod-builder-pro-staging}}
STAGING_BASE=${STAGING_BASE:-"https://${APP_SLUG}.fly.dev"}
SHOP=${SHOP:-${2:-}}
if [ -z "${SHOP}" ]; then
  echo "SHOP is required (e.g., rbp-dev.myshopify.com)" >&2
  exit 2
fi
HOST_B64=$(printf "%s" "${SHOP}/admin" | base64 | tr -d '\n')

JQ=${JQ:-jq}
HAVE_JQ=0
if command -v ${JQ} >/dev/null 2>&1; then HAVE_JQ=1; fi

pass() { echo "PASS: $*"; }
fail() { echo "FAIL: $*"; }

summary_ok=true

# Orgs and basic app status (non-fatal)
(echo "# fly orgs"; fly orgs list || true) 2>/dev/null || true
(echo "# fly status -a ${APP_SLUG}"; fly status -a "${APP_SLUG}" || true) 2>/dev/null || true
(echo "# fly secrets list -a ${APP_SLUG}"; fly secrets list -a "${APP_SLUG}" || true) 2>/dev/null || true

check_healthz() {
  local url="${STAGING_BASE}/healthz"
  local body status
  body=$(curl -sS -w "\n%{http_code}" "${url}") || { fail "/healthz curl error"; summary_ok=false; return; }
  status=$(echo "${body}" | tail -n1)
  body=$(printf "%s\n" "${body}" | sed '$d')
  if [ "${status}" != "200" ]; then fail "/healthz HTTP ${status}"; summary_ok=false; return; fi
  if [ ${HAVE_JQ} -eq 1 ]; then echo "${body}" | ${JQ} -e '.ok == true' >/dev/null 2>&1 && pass "/healthz ok" || { fail "/healthz body mismatch"; summary_ok=false; }
  else echo "${body}" | grep -q '"ok": true' && pass "/healthz ok" || { fail "/healthz body mismatch"; summary_ok=false; }
  fi
}

check_catalog() {
  local url="${STAGING_BASE}/apps/proxy/rbp/catalog"
  local body status
  body=$(curl -sS -w "\n%{http_code}" "${url}") || { fail "/apps/proxy/rbp/catalog curl error"; summary_ok=false; return; }
  status=$(echo "${body}" | tail -n1)
  body=$(printf "%s\n" "${body}" | sed '$d')
  if [ "${status}" != "200" ]; then fail "/apps/proxy/rbp/catalog HTTP ${status}"; summary_ok=false; return; fi
  if [ ${HAVE_JQ} -eq 1 ]; then echo "${body}" | ${JQ} -e '.ok == true and (.parts|type=="array")' >/dev/null 2>&1 && pass "/apps/proxy/rbp/catalog ok" || { fail "/apps/proxy/rbp/catalog body mismatch"; summary_ok=false; }
  else echo "${body}" | grep -q '"ok": true' && echo "${body}" | grep -q '"parts"' && pass "/apps/proxy/rbp/catalog ok" || { fail "/apps/proxy/rbp/catalog body mismatch"; summary_ok=false; }
  fi
}

check_modules() {
  local url="${STAGING_BASE}/apps/proxy/rbp/modules"
  local body status
  body=$(curl -sS -w "\n%{http_code}" "${url}") || { fail "/apps/proxy/rbp/modules curl error"; summary_ok=false; return; }
  status=$(echo "${body}" | tail -n1)
  body=$(printf "%s\n" "${body}" | sed '$d')
  if [ "${status}" != "200" ]; then fail "/apps/proxy/rbp/modules HTTP ${status}"; summary_ok=false; return; fi
  if [ ${HAVE_JQ} -eq 1 ]; then echo "${body}" | ${JQ} -e '.ok == true and (.modules|type=="array")' >/dev/null 2>&1 && pass "/apps/proxy/rbp/modules ok" || { fail "/apps/proxy/rbp/modules body mismatch"; summary_ok=false; }
  else echo "${body}" | grep -q '"ok": true' && echo "${body}" | grep -q '"modules"' && pass "/apps/proxy/rbp/modules ok" || { fail "/apps/proxy/rbp/modules body mismatch"; summary_ok=false; }
  fi
}

check_doctor() {
  local url="${STAGING_BASE}/app/doctor?embedded=1&shop=${SHOP}&host=${HOST_B64}"
  local body status
  body=$(curl -sS -w "\n%{http_code}" "${url}") || { fail "/app/doctor curl error"; summary_ok=false; return; }
  status=$(echo "${body}" | tail -n1)
  body=$(printf "%s\n" "${body}" | sed '$d')
  if [ "${status}" != "200" ]; then fail "/app/doctor HTTP ${status}"; summary_ok=false; return; fi
  echo "${body}" | grep -q 'data-testid="doctor-embed-ok"' && pass "/app/doctor embed marker ok" || { fail "/app/doctor embed marker missing"; summary_ok=false; }
}

check_healthz
check_catalog
check_modules
check_doctor

if [ "${summary_ok}" = true ]; then
  echo "STAGING_OK=true APP_SLUG=${APP_SLUG} STAGING_BASE=${STAGING_BASE}"
  exit 0
else
  echo "STAGING_OK=false APP_SLUG=${APP_SLUG} STAGING_BASE=${STAGING_BASE}"
  exit 1
fi
# <!-- END RBP GENERATED: hosting-staging-verify-v1-0 -->
