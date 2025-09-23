# ADR: Consolidate RBP APP Admin to Embedded Shopify Admin (Deprecate admin.portal for APP)

- Date: 2025-09-22
- Status: Accepted
- Decision type: BREAKING
- Owner: Chris Wegeleben
- Sentinel: admin-consolidation-embedded-only-v1-0

## Context
We currently have two admin UIs:
1) Embedded Shopify Admin under `src/apps/rbp-shopify-app/rod-builder-pro/app/**`
2) Internal Admin Portal under `src/apps/admin.portal/**`
This duplication confuses deploys and sometimes surfaces a stub "ok" page instead of the real embedded UI. For RBP APP, Shopify-native auth and embed context are the right guardrails.

## Decision
For the RBP APP, only the **embedded Shopify Admin** is considered the admin surface. The internal `admin.portal` is deprecated for APP and will be repurposed for **RBP HQ** later. The embedded app renders a real Polaris Dashboard at `/app`, uses `ShopHostLink`, and includes a minimal `/app/doctor` route for embed checks.

## Alternatives considered
- Keep both portals: rejected due to confusion, duplicate maintenance, and risk of misrouted deploys.
- Delete admin.portal now: deferred. We will disable it from APP deploys and move it to HQ scope later.

## Consequences
- Simpler deploys and less risk of serving placeholders.
- All APP admin access inherits Shopify auth and permissions.
- Internal ops tooling must shift to HQ when needed.

## Migration plan
1) Ensure embedded `/app` shows a real Dashboard and nav.
2) Exclude `src/apps/admin.portal/**` from APP builds and deploys.
3) Remove or neutralize any gateway or fallback routes returning stub "ok" pages for APP paths.
4) Add preflights: one-admin-surface and no-stub-routes for the embedded app.

## Rollback plan
Re-enable admin.portal in builds if we discover a hard dependency, then revisit this ADR.

## Links
- Sentinel: `admin-consolidation-embedded-only-v1-0`
- Related work: Admin Nav Hardening, Admin Dashboard v1.x, Proxy Diagnostics, Registry Shell
RBP_PROGRESS to log after the ADR file lands:
RBP_PROGRESS: { "date": "2025-09-22", "feature": "ADR — Admin consolidation to embedded only", "change": "ADD",
"sentinel": "admin-consolidation-embedded-only-v1-0", "apps": ["docs"], "files": ["docs/adr/2025-09-22-admin-consolidation-embedded-only.md"],
"tests": "N/A", "preflight": "N/A", "notes": "APP uses embedded Shopify Admin only; portal deprecated for APP." }
