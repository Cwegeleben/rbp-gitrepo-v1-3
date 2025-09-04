<!-- BEGIN RBP GENERATED: tool-inventory-v1 -->

# Tool Inventory

This living inventory lists CLI tools, preflight checks, smoke scripts, dev/deploy helpers, MSW handlers, and utility scripts in this repo. Copy-paste friendly and organized for day-to-day use.

- Scope: ADD (no breaking changes)
- Model: GPT-5
- See also: docs/progress for the progress ledger tooling

Contents
- Development
- Preflight
- CI/Smoke
- Proxy
- Progress Ledger
- MSW Handlers
- Other Utilities

## Development

### dev:shopify-cli
- Purpose: Start the Shopify CLI dev server for the embedded app.
- Usage:
  ```zsh
  pnpm dev:shopify-cli
  ```
- Example: Starts a tunnel, prints the app URL; terminal stays attached.
- Notes: Path: package.json → dev:shopify-cli. Use in development. See also dev:shopify, dev:up, dev:down.

### dev:shopify
- Purpose: Start the app locally via the package filter (without Shopify CLI, for local-only flows).
- Usage:
  ```zsh
  pnpm dev:shopify
  ```
- Example: Local server on http://localhost:$PORT (from env or defaults).
- Notes: Path: package.json → dev:shopify. Use in development and debugging.

### dev:up
- Purpose: Alias for dev:shopify-cli.
- Usage:
  ```zsh
  pnpm dev:up
  ```
- Example: Same as dev:shopify-cli.
- Notes: Path: package.json → dev:up. Use in development.

### dev:down
- Purpose: Print reminder to stop the foreground Shopify CLI server with Ctrl+C.
- Usage:
  ```zsh
  pnpm dev:down
  ```
- Example: Prints “Stop with Ctrl+C (Shopify CLI runs in foreground)”.
- Notes: Path: package.json → dev:down. Use in development.

### storybook
- Purpose: Run Storybook for UI component development with MSW-backed stories.
- Usage:
  ```zsh
  pnpm storybook -p 6006
  ```
- Example: Storybook dev server on http://localhost:6006.
- Notes: Path: package.json → storybook. Use for development/UI debugging. See also MSW Handlers.

### build-storybook
- Purpose: Build a static Storybook site.
- Usage:
  ```zsh
  pnpm build-storybook
  ```
- Example: Emits a static site (dist-storybook/ by default).
- Notes: Path: package.json → build-storybook. Use in CI, previews, docs.

### deploy:shopify
- Purpose: Deploy the Shopify app using Shopify CLI.
- Usage:
  ```zsh
  pnpm deploy:shopify
  ```
- Example: Shopify CLI deploy logs and result.
- Notes: Path: package.json → deploy:shopify. Use in CI and releases.

### deploy:fly
- Purpose: Deploy the API/app to Fly.io staging.
- Usage:
  ```zsh
  pnpm deploy:fly
  ```
- Example: flyctl deploy logs; staged rollout.
- Notes: Path: package.json → deploy:fly. Use in CI, staging releases.

### deploy:all
- Purpose: Commit, push, then deploy to Shopify and Fly in sequence.
- Usage:
  ```zsh
  pnpm deploy:all
  ```
- Example: Git push then deploys both targets.
- Notes: Path: package.json → deploy:all. Use for releases.

### fly:secrets:staging
- Purpose: Set Fly secrets for staging (example: DATABASE_URL).
- Usage:
  ```zsh
  pnpm fly:secrets:staging
  ```
- Example: flyctl confirms secret set.
- Notes: Path: package.json → fly:secrets:staging. Use for ops/env setup.

### db:migrate
- Purpose: Run Prisma migrations (access_v2).
- Usage:
  ```zsh
  pnpm db:migrate
  ```
- Example: Prisma migrate dev output.
- Notes: Path: package.json → db:migrate. Use in dev/CI.

### db:migrate:inventory
- Purpose: Run Prisma migrations for inventory phase1.
- Usage:
  ```zsh
  pnpm db:migrate:inventory
  ```
- Example: Prisma migrate dev output.
- Notes: Path: package.json → db:migrate:inventory. Use in dev/CI.

### db:seed
- Purpose: Seed the app database for the Shopify app workspace.
- Usage:
  ```zsh
  pnpm db:seed
  ```
- Example: Seed logs confirming inserts.
- Notes: Path: src/apps/rbp-shopify-app/rod-builder-pro/prisma/seed.ts; package.json → db:seed. Use in development.

### db:seed:inventory
- Purpose: Seed the inventory dataset.
- Usage:
  ```zsh
  pnpm db:seed:inventory
  ```
- Example: Seed logs and success exit.
- Notes: Path: src/packages/access/scripts/seed-inventory.ts; package.json → db:seed:inventory. Use in development.

### reservations:expire
- Purpose: Worker to expire “soft reservations” for builds.
- Usage:
  ```zsh
  pnpm reservations:expire
  ```
- Example: Worker logs then exits.
- Notes: Path: src/packages/builds/workers/expire-soft-reservations.ts; package.json → reservations:expire. Use for maintenance/debugging.

## Preflight

### preflight (alias)
- Purpose: Convenience alias for preflight:app-proxy.
- Usage:
  ```zsh
  pnpm -s preflight
  ```
- Example: Same behavior and output as preflight:app-proxy.
- Notes: Path: package.json → preflight. Use in CI or development. See also preflight:strict, preflight:shopify-admin, preflight:admin.

### preflight:app-proxy
- Purpose: Validate [app_proxy] config in shopify.app.toml (prefix, subpath, host) with tunnel/local allowances.
- Usage:
  ```zsh
  pnpm -s preflight:app-proxy
  # strict mode
  PREFLIGHT_STRICT=1 pnpm -s preflight:app-proxy
  # override expected host
  PREFLIGHT_EXPECTED_PROXY_URL=https://<your-host> pnpm -s preflight:app-proxy
  ```
- Example: PASS when matching; WARN/ERROR with diff table when mismatched.
- Notes: Path: scripts/preflight/check-app-proxy.ts. Use in CI/dev. Detects tunnel/local hosts; non-strict relaxes.

### preflight:strict
- Purpose: Run the app-proxy preflight in strict mode.
- Usage:
  ```zsh
  pnpm -s preflight:strict
  ```
- Example: Fails on any mismatch; prints diff table.
- Notes: Path: package.json → preflight:strict. Use for CI/enforcement. See also preflight:app-proxy.

### preflight:shopify-admin
- Purpose: Sanity checks for embedded Shopify Admin usage (links, navigate, proxy hints, .env presence).
- Usage:
  ```zsh
  pnpm -s preflight:shopify-admin
  ```
- Example: “Shopify Admin embed sanity passed” or offender list with reasons.
- Notes: Path: scripts/preflight/shopify-admin-embed.sanity.ts. Use in CI/dev. See also preflight:admin.

### preflight:admin
- Purpose: Legacy/parallel admin embed sanity checks across targeted files.
- Usage:
  ```zsh
  pnpm -s preflight:admin
  ```
- Example: “preflight ok: no offenders” or offender list and guidance.
- Notes: Path: scripts/preflight/admin-embed.sanity.ts. Use in CI/dev. See also preflight:shopify-admin.

### preflight:shopify-admin-links
- Purpose: Verify no raw Link/NavLink/navigate usage and enforce host-navigation helpers in the Shopify Admin app surface.
- Usage:
  ```zsh
  pnpm -s preflight:shopify-admin-links
  ```
- Example: Prints offender list; exits non-zero on violations.
- Notes: Path: scripts/preflight/shopify-admin.links.ts. Use in CI/dev.

### preflight:no-stub-routes
- Purpose: Heuristically fail if “stubby” placeholder admin routes remain.
- Usage:
  ```zsh
  pnpm -s preflight:no-stub-routes
  ```
- Example: “no-stub routes preflight ok” or flagged routes; non-zero exit on offenders.
- Notes: Path: scripts/preflight/no-stub-routes.ts. Use in CI/hardening.

### preflight:progress:paths
- Purpose: Validate existence and placement of progress ledger artifacts/paths.
- Usage:
  ```zsh
  pnpm -s preflight:progress:paths
  ```
- Example: Pass/fail listing any missing paths.
- Notes: Path: scripts/preflight/progress-paths.ts. Use in CI. See also preflight:progress.

### preflight:progress (meta)
- Purpose: Aggregate run of progress:scan, progress:gaps, preflight:progress:paths, and validation of docs/progress/REPORT.md.
- Usage:
  ```zsh
  pnpm -s preflight:progress
  ```
- Example: Aggregated pass/fail ensuring ledger generation.
- Notes: Path: package.json → preflight:progress. Use in CI.

### paths.sanity.ts (direct)
- Purpose: Additional sanity checks over app paths (used ad-hoc).
- Usage:
  ```zsh
  tsx scripts/preflight/paths.sanity.ts
  ```
- Example: Pass/fail logs in the console.
- Notes: Path: scripts/preflight/paths.sanity.ts. Use for debugging/ad-hoc checks.

## CI/Smoke

### smoke
- Purpose: End-to-end smoke runner for Access V2 and App Proxy flows (signs proxy paths, toggles features, hits checkout/package).
- Usage:
  ```zsh
  # Ensure dev server is running; PORT auto-detected (scripts/port.env optional)
  SHOPIFY_API_SECRET=... pnpm smoke
  ```
- Example: PASS/FAIL lines (e.g., “/apps/proxy/ping 200 (signed)”, “403 when disabled …)”. Non-zero exit on failures.
- Notes: Path: scripts/smoke.ts; package.json → smoke. Use in CI/local smoke. Needs SHOPIFY_API_SECRET; port auto via scripts/port.env or discover-port.

### smoke:signed
- Purpose: Alias of smoke (same script and behavior).
- Usage:
  ```zsh
  SHOPIFY_API_SECRET=... pnpm smoke:signed
  ```
- Example: Same as smoke.
- Notes: Path: package.json → smoke:signed. Use in CI/local smoke.

### smoke:proxy
- Purpose: Print quick usage guidance for proxy signing and curl.
- Usage:
  ```zsh
  pnpm -s smoke:proxy
  ```
- Example: Prints guidance to run proxy:sign then curl the URL.
- Notes: Path: package.json → smoke:proxy. Use for onboarding/quick reference.

### smoke:admin
- Purpose: Tenant Admin API smoke checks: access ctx, catalog list, and a dry-run PATCH for product toggle.
- Usage:
  ```zsh
  # Base URL may come from RBP_ADMIN_BASE_URL or SHOPIFY_APP_URL
  RBP_ADMIN_BASE_URL=http://localhost:51544 pnpm smoke:admin
  ```
- Example: Lines like “[access] OK tenant=..., plan=...”, “catalog OK items=...”, “dry-run OK status=204”. Exit codes: 0 pass, 1 fail, 2 config/env missing.
- Notes: Path: scripts/admin-smoke.ts; package.json → smoke:admin. Use in CI/debugging admin endpoints.

### smoke:admin-routes
- Purpose: Quick smoke of admin route wiring (companion to preflight checks).
- Usage:
  ```zsh
  pnpm -s smoke:admin-routes
  ```
- Example: Route checks with pass/fail; non-zero on errors.
- Notes: Path: scripts/preflight/smoke-admin-routes.ts; package.json → smoke:admin-routes. Use in CI/routing sanity. See also preflight:shopify-admin, preflight:admin.

### fly:smoke
- Purpose: Curl-based smoke tests against Fly deployment.
- Usage:
  ```zsh
  pnpm fly:smoke
  ```
- Example: PASS/FAIL lines for remote endpoints.
- Notes: Path: scripts/fly/curl-smoke.sh; package.json → fly:smoke. Use for staging verification.

### curl-builds.sh
- Purpose: Local CLI checks for builds API and checkout packaging; seeds demo items and validates cart path.
- Usage:
  ```zsh
  # Optional: echo "PORT=51544" > scripts/port.env
  bash scripts/curl-builds.sh
  ```
- Example: “PASS Checkout package GET (200)”, “PASS Cart path matches seeded variantIds ...”. Non-zero exit on failure.
- Notes: Path: scripts/curl-builds.sh. Auto-discovers port via scripts/discover-port.sh; depends on curl and jq. Use for debugging/local smoke.

### curl-checks.sh
- Purpose: Catalog API checks (collections/products) including limits, cache headers, and error surfaces.
- Usage:
  ```zsh
  bash scripts/curl-checks.sh
  ```
- Example: A table of PASS/FAIL checks; summary with counts; non-zero on failures.
- Notes: Path: scripts/curl-checks.sh. Use for debugging/local smoke.

### curl-tenancy.sh
- Purpose: Multi-tenant isolation checks for builds and checkout/package across shops.
- Usage:
  ```zsh
  bash scripts/curl-tenancy.sh
  ```
- Example: “Create build (tenant=...)”, “List A contains ID”, “Cross-tenant returns non-200”.
- Notes: Path: scripts/curl-tenancy.sh. Use when debugging tenancy/isolation logic.

### curl-inventory-sync.sh
- Purpose: Exercise inventory sync-related proxy APIs (ad-hoc smoke).
- Usage:
  ```zsh
  bash scripts/curl-inventory-sync.sh
  ```
- Example: Curl output with HTTP codes and JSON snippets; non-zero on errors.
- Notes: Path: scripts/curl-inventory-sync.sh. Use for debugging inventory flows.

### curl-webhook-orders-paid.sh
- Purpose: Simulate/trigger orders paid webhook-related endpoints.
- Usage:
  ```zsh
  bash scripts/curl-webhook-orders-paid.sh
  ```
- Example: Curl output; non-zero on errors.
- Notes: Path: scripts/curl-webhook-orders-paid.sh. Use for debugging webhook handling.

### smoke.mjs (node variant)
- Purpose: Node-based proxy smoke checks for local and storefront paths with cookie handling and manual redirect follow.
- Usage:
  ```zsh
  node scripts/smoke.mjs
  # Optional: RBP_SMOKE_STORE=1 SHOP_DOMAIN=... STOREFRONT_PASSWORD=...
  ```
- Example: console.table with PASS/FAIL for local/store checks; “Smoke PASSED” or exit non-zero.
- Notes: Path: scripts/smoke.mjs. Use in CI/smoke and cross-domain debugging.

## Proxy

### proxy:sign
- Purpose: Sign an /apps/proxy path with SHOPIFY_API_SECRET for local testing.
- Usage:
  ```zsh
  SHOPIFY_API_SECRET=... pnpm -s proxy:sign /apps/proxy/ping userId=admin@rbp
  ```
- Example: “/apps/proxy/ping?userId=admin%40rbp&signature=<hex>”.
- Notes: Path: scripts/proxy/sign-url.ts; package.json → proxy:sign. Use for dev/debugging proxy endpoints.

### proxy:sign:staging
- Purpose: Convenience wrapper to output a full staging URL with a signed path.
- Usage:
  ```zsh
  SHOPIFY_API_SECRET=... pnpm -s proxy:sign:staging
  ```
- Example: “https://rbp-rod-builder-pro-staging.fly.dev/apps/proxy/ping?signature=...”.
- Notes: Path: package.json → proxy:sign:staging. Use for staging smoke. See also fly:smoke.

### proxy:sign (manual path)
- Purpose: Sign arbitrary /apps/proxy paths for testing with additional query params.
- Usage:
  ```zsh
  SHOPIFY_API_SECRET=... pnpm -s proxy:sign /apps/proxy/api/checkout/package buildId=123 userId=admin@rbp
  ```
- Example: “/apps/proxy/api/checkout/package?buildId=123&userId=admin%40rbp&signature=...”.
- Notes: Path: scripts/proxy/sign-url.ts. Use when debugging specific endpoints.

### proxy:test
- Purpose: Print usage guidance for signing and curling proxy URLs.
- Usage:
  ```zsh
  pnpm -s proxy:test
  ```
- Example: Instructional text pointing to proxy:sign and curl usage.
- Notes: Path: package.json → proxy:test. Use for onboarding/quick reference.

### set-app-proxy-host.sh
- Purpose: Update the App Proxy host in shopify.app.toml to a given tunnel host and deploy config-only changes.
- Usage:
  ```zsh
  bash scripts/set-app-proxy-host.sh https://<your-tunnel-host> [src/apps/rbp-shopify-app/rod-builder-pro]
  ```
- Example: Rewrites [app_proxy] url and runs “shopify app deploy --path=...”.
- Notes: Path: scripts/set-app-proxy-host.sh. Use for development/environment changes/tunnels.

## Progress Ledger

### progress:scan
- Purpose: Scan the repo and write docs/progress/scan.json (inputs for ledger reporting).
- Usage:
  ```zsh
  pnpm -s progress:scan
  ```
- Example: JSON written to docs/progress/scan.json.
- Notes: Path: scripts/progress/scan.ts; package.json → progress:scan. Use in CI/reporting.

### progress:gaps
- Purpose: Analyze gaps based on the scan output.
- Usage:
  ```zsh
  pnpm -s progress:gaps
  ```
- Example: Gap report logs and updated ledger artifacts.
- Notes: Path: scripts/progress/gaps.ts; package.json → progress:gaps. Use in CI/planning.

### progress:update
- Purpose: Update the progress ledger and report files.
- Usage:
  ```zsh
  pnpm -s progress:update
  ```
- Example: Updated docs/progress/* including REPORT.md.
- Notes: Path: scripts/progress/update.ts; package.json → progress:update. Use in CI/reporting.

### progress:import-chat
- Purpose: Import chat logs into the progress ledger.
- Usage:
  ```zsh
  pnpm -s progress:import-chat
  ```
- Example: Imported entries reflected in ledger outputs.
- Notes: Path: scripts/progress/import-chat.ts; package.json → progress:import-chat. Use for documentation/history.

### preflight:progress (see Preflight)
- Purpose: Meta preflight to ensure ledger generation and paths are valid.
- Notes: See preflight:progress in Preflight section.

## MSW & Test Utilities

### Storybook MSW: AdminCatalogShell.stories
- Purpose: Storybook stories for Admin Catalog shell with inline MSW handlers for catalog products.
- Usage:
  ```zsh
  pnpm storybook -p 6006
  # Stories use: parameters: { msw: { handlers: [ http.get('/apps/proxy/api/catalog/products', ... ) ] } }
  ```
- Example: Stories render with mocked catalog API responses (items list, empty state, error variant).
- Notes: Path: AdminCatalogShell.stories.tsx. Use for UI dev; see also src/apps/admin.portal/mocks/handlers.

### Storybook MSW: AdminBuildsPage.stories
- Purpose: Storybook stories for Admin Builds page with inline MSW handlers for /apps/proxy/api/builds.
- Usage:
  ```zsh
  pnpm storybook -p 6006
  ```
- Example: Success (items:[]), error (500) variants controlled via MSW handlers.
- Notes: Path: AdminBuildsPage.stories.tsx. Use for UI dev.

### msw handlers: catalogHandlers
- Purpose: Central MSW handlers for catalog-related endpoints used across stories/tests.
- Usage:
  ```zsh
  // import { http, HttpResponse } from 'msw'
  // export handlers = [ http.get('/apps/proxy/api/catalog/products', ... ) ]
  ```
- Example: Mocked responses when mounted in MSW worker/server.
- Notes: Path: catalogHandlers.ts. Use in Storybook/tests.

### msw handlers: buildsHandlers
- Purpose: MSW handlers for builds endpoints.
- Usage:
  ```zsh
  // export handlers for '/apps/proxy/api/builds' endpoints
  ```
- Example: Mock responses for builds endpoints.
- Notes: Path: buildsHandlers.ts. Use in Storybook/tests.

### msw handlers: dashboardHandlers
- Purpose: MSW handlers for dashboard-related endpoints.
- Usage:
  ```zsh
  // export handlers used by dashboard stories
  ```
- Example: Mock responses for dashboard.
- Notes: Path: dashboardHandlers.ts. Use in Storybook/tests.

## Other Utilities

### test (Jest)
- Purpose: Run the unit/integration test suite with repo’s Jest config.
- Usage:
  ```zsh
  pnpm test --
  ```
- Example: Jest summary with pass/fail; honors jest.config.ts and jest.setup.ts.
- Notes: Path: package.json → test. Use in CI/dev.

### test:full:3x
- Purpose: Run tests up to three times (fail fast) for flake detection.
- Usage:
  ```zsh
  pnpm test:full:3x -- path/or/pattern.test.ts
  ```
- Example: “run 1/3 passed … Summary: 3/3 runs passed”; exits non-zero if fewer than 3 passes.
- Notes: Path: scripts/run-tests-3x.mjs; package.json → test:full:3x. Use for CI stability checks.

### test:access
- Purpose: Targeted AccessV2 test runner.
- Usage:
  ```zsh
  pnpm test:access
  ```
- Example: Runs a specific test path with Jest.
- Notes: Path: package.json → test:access. Use for focused debugging.

### test:admin
- Purpose: Targeted Admin Portal tests (catalog, gating, proxy enforcement, builds).
- Usage:
  ```zsh
  pnpm test:admin
  ```
- Example: Jest output for listed admin tests.
- Notes: Path: package.json → test:admin. Use for focused debugging/CI subsets.

### test:rbp-package
- Purpose: Run tests for rbp-package module.
- Usage:
  ```zsh
  pnpm test:rbp-package
  ```
- Example: Jest output for that module’s __tests__.
- Notes: Path: package.json → test:rbp-package. Use for focused debugging.

### discover-port.sh
- Purpose: Try to auto-detect the dev server port via logs or lsof+probe.
- Usage:
  ```zsh
  bash scripts/discover-port.sh
  ```
- Example: Prints a port number or an error hint.
- Notes: Path: scripts/discover-port.sh. Use for development convenience.

### port.env
- Purpose: Optional file to fix the dev server PORT for local scripts.
- Usage:
  ```zsh
  # Example
  echo "PORT=51544" > scripts/port.env
  ```
- Example: Loaded by scripts that source it; no direct output.
- Notes: Path: scripts/port.env. Use for consistent local porting.

### fly:secrets:staging (see Development)
- Purpose: Ops helper to set staging secrets.
- Notes: See Development section.

### deploy scripts (see Development)
- Purpose: Ship changes to Shopify and Fly.
- Notes: See Development section for deploy:shopify, deploy:fly, deploy:all.

---

Notes
- Many scripts support environment overrides; check each script’s header or code comments.
- For local proxy signing, set SHOPIFY_API_SECRET and prefer proxy:sign to build URLs.
- For Storybook/MSW development, see “MSW Handlers” above.
- CI preflights and smokes are designed to fail fast and print actionable diffs/logs.

<!-- END RBP GENERATED: tool-inventory-v1 -->