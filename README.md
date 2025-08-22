<!-- BEGIN RBP GENERATED: preflight-badge -->
[![Preflight](https://github.com/Cwegeleben/rbp-gitrepo-v1-3/actions/workflows/preflight.yml/badge.svg)](https://github.com/Cwegeleben/rbp-gitrepo-v1-3/actions/workflows/preflight.yml)
<!-- END RBP GENERATED: preflight-badge -->

<!-- BEGIN RBP GENERATED: ci-admin-tests-smoke -->
[![CI - tests](https://github.com/Cwegeleben/rbp-gitrepo-v1-3/actions/workflows/ci.yml/badge.svg?event=pull_request)](https://github.com/Cwegeleben/rbp-gitrepo-v1-3/actions/workflows/ci.yml)
<!-- END RBP GENERATED: ci-admin-tests-smoke -->

<!-- BEGIN RBP GENERATED: Fly-Deploy-Fix -->
## Fly Deploy Quickstart
```bash
# one-time
fly volumes create data --size 1 --region sea
fly secrets set DATABASE_URL="file:/data/dev.sqlite" SHOPIFY_API_KEY="..." SHOPIFY_API_SECRET="..." SESSION_SECRET="$(openssl rand -hex 16)" NODE_ENV=production
# deploy
fly deploy --remote-only
# verify
./scripts/fly/curl-smoke.sh https://rbp-rod-builder-pro-staging.fly.dev
<!-- END RBP GENERATED: Fly-Deploy-Fix -->
# Rod Builder Pro v1-3

## Catalog endpoint checks
Run all curl-based health checks:

	pnpm curl:checks

## Dev/Testing

Local curl packs use PORT from scripts/port.env (default 51544). Override with:
	PORT=12345 pnpm curl:builds
If scripts/port.env is absent or blank, scripts fall back to auto-discovery.

<!-- BEGIN RBP GENERATED: Tests-AccessV2 -->
## Smoke & Access Tests

Prereqs:
- Dev server running locally (uses PORT from `scripts/port.env`, default 51544).
- SHOPIFY_API_SECRET exported for signed app proxy checks.

Run:
- Smoke (signed proxy + feature toggle 403/200 checks):
	- `pnpm smoke`
- Focused Access tests (no network):
	- `pnpm test:access`

Notes:
- Smoke toggles the `checkout:package` feature via the Admin Access route for tenant `demo.myshopify.com` using user `admin@rbp`.
- Tests are isolated and mock access/ctx internals; they do not perform external HTTP calls.
<!-- END RBP GENERATED: Tests-AccessV2 -->

<!-- BEGIN RBP GENERATED: DevUX v1 -->
## Dev UX quick start
```bash
pnpm db:migrate && pnpm db:seed
pnpm dev:up                              # starts Shopify CLI dev server
export SHOPIFY_API_SECRET=******         # needed for signed proxy checks
pnpm smoke                               # waits for server, then runs 200/403/200 checks
pnpm test:access                         # unit/integration-lite (no network)
```
If pnpm smoke says the server isn’t reachable, ensure the PORT matches your dev server
(env or scripts/port.env) and that the CLI is running.
<!-- END RBP GENERATED: DevUX v1 -->
