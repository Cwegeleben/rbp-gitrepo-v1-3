<!-- BEGIN RBP GENERATED: rbp-shell-mvp -->
## How to Preview the Shell

1) Seed tenant and start dev

```bash
pnpm dev:up
```

2) In Shopify Theme Editor, add the RBP block to a page.

3) Open the page. You should see loading skeletons, then the Shell with header, tiles, and status.

4) Click Catalog or Builds to load modules into the module area without a full reload.

Troubleshooting: Toggle the API off to verify error + retry. The shell fetches `/apps/rbp/api/access/ctx` and `/apps/proxy/modules/registry.json`.
<!-- END RBP GENERATED: rbp-shell-mvp -->

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

<!-- BEGIN RBP GENERATED: fast-smoke-checklist -->
## Fast smoke checklist

Admin
- Run: `pnpm dev:shopify-cli` then open `/app`
- TenantBadge shows rbp-dev.myshopify.com and DEV chip ✅
- KPI tiles show counts (numbers or —), no crash ✅
- Packager preview shows totals/hints (mock ok) ✅
- Dev Debug Panel only when flags.showDevTools ✅

Storefront (Theme Editor)
- Open a page with the app block
- Header shows domain/plan (or placeholders), CTA, not blank ✅
- Modules list present (or “registry offline (mock)”) ✅
- Active Build placeholder card + disabled button + aria-live note ✅
- On ctx/HMAC failure → inline error banner with “use Theme Editor or signed URL” ✅

Endpoints
- `pnpm proxy:sign --path /apps/proxy/api/access/ctx` → 200, plan=dev, showDevTools=true ✅
- `/apps/proxy/modules/registry.json` → contains rbp-shell v0.2.0 ✅
- `/apps/proxy/modules/rbp-shell/0.2.0/index.js` → 200 ✅

Quick run
```bash
pnpm storybook -p 6007
pnpm test
pnpm dev:shopify-cli
```
<!-- END RBP GENERATED: fast-smoke-checklist -->
