# ADR: Server-side Saved Builds v1 (Storefront Builder)

- Date: 2025-09-22
- Status: Accepted
- Decision type: ADD
- Owner: Chris Wegeleben
- Sentinel: server-side-saved-builds-v1-0

## Context
We want shoppers to save and resume in-progress builds. M0/M1 used localStorage (client only). For M3, we need server-side saves tied to a logged-in Shopify customer so builds persist across browsers and devices. HQ persistence will come later; this ADR covers the interim, app-local approach.

## Decision
Implement a tenant-scoped, customer-scoped saved-builds store behind the App Proxy:
- Storage: file-backed KV under a mounted volume (default `/data`, override with `RBP_VOLUME_PATH`).
- Scope: key = `{tenantId}:{customerId}`; value = array of builds.
- Build record: `{ id, name, slots, totals, updatedAt }`.
- Limits: max 20 builds per customer per tenant; payload ≤ 16 KB per build; name ≤ 80 chars; LRU trim on overflow.
<!-- BEGIN RBP GENERATED: server-side-saved-builds-v1-0 -->
- API (relative to `/apps/proxy`), all HMAC-guarded and diag-headered:
  - `POST /builds/save` → create or upsert `{ name, slots, totals, tenantId, customerId, id? }` → `{ ok, id }`
  - `GET /builds/list` → `{ items: [{ id, name, updatedAt }] }`
  - `GET /builds/get?id=...` → full build
  - `POST /builds/rename` `{ id, name }` → `{ ok }`
  - `POST /builds/delete` `{ id }` → `{ ok }`
<!-- END RBP GENERATED: server-side-saved-builds-v1-0 -->
- Client behavior:
  - If logged in: show **Account** tab backed by the server; **Local** tab remains as fallback.
  - If logged out: show only **Local**.
<!-- BEGIN RBP GENERATED: server-side-saved-builds-v1-0 -->
- Flags:
  - `RBP_ENABLE_SERVER_SAVES=1` to enable in staging first.
  - `RBP_VOLUME_PATH=/data` default if not set.
<!-- END RBP GENERATED: server-side-saved-builds-v1-0 -->

## Security and Privacy
- Authentication: inherit Shopify session context via App Proxy HMAC; reject if signature invalid when enforcement is on.
- Data minimization: store `customerId` only; do not store email or PII in build payloads.
- Logging: structured logs without full `slots` payload; include correlation ids and tenant; redact on error.
- Retention: best-effort cleanup of stale builds after 180 days (future task); immediate delete honored via API.
- Storage: relies on platform volume encryption at rest; plan KMS integration when moving to HQ.

## Alternatives considered
1) Client-only localStorage: simple, but no cross-device persistence.
2) Shopify customer metafields: durable, but size limits and rate-limits make bulk updates awkward; migration target later.
3) App-owned database now: heavier operational burden today; we will revisit with HQ.

## Consequences
- Enables cross-device resumes for logged-in customers.
- Introduces a mutable write surface on the gateway; requires basic locking and back-pressure.
- Migration to HQ or metafields will require a one-time copy job.

## Migration plan (to HQ or metafields)
1) Keep v1 storage file-backed under `/data`.
2) Introduce HQ API or customer metafields writer behind a feature flag.
3) Dual-write for a period, add a migration job to backfill.
4) Flip reads to HQ/metafields, then retire v1 store.

## Failure modes and fallbacks
- Volume unavailable or write error: surface a toast, fall back to Local saves; never block the builder.
- Oversized payload: show “Link too large — save to Account or trim selections,” and enforce limits.

## Observability
<!-- BEGIN RBP GENERATED: server-side-saved-builds-v1-0 -->
- Add `X-RBP-Proxy` and `X-RBP-Proxy-Diag` on all routes.
<!-- END RBP GENERATED: server-side-saved-builds-v1-0 -->
- Emit counters: saves, loads, deletes, rename; error counts by code.
- Sample of payload sizes (without content) for tuning limits.

## Open questions
- Do we need per-tenant export tooling now, or defer to HQ migration window
- Exact retention policy and purge cadence

RBP_PROGRESS to log after the ADR file lands:
RBP_PROGRESS: { "date": "2025-09-22", "feature": "ADR — Server-side Saved Builds v1", "change": "ADD", "sentinel": "server-side-saved-builds-v1-0", "apps": ["docs"], "files": ["docs/adr/2025-09-22-server-side-saved-builds-v1.md"], "tests": "N/A", "preflight": "N/A", "notes": "Define interim file-backed saved builds via App Proxy; flags and limits set; migration path to HQ." }
