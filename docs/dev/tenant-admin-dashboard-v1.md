<!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 -->

# Tenant Admin Dashboard v1 — Design

Context
- Admin app at `src/apps/admin.portal`
- Access context endpoint: `/apps/proxy/api/access/ctx` (strict HMAC on proxy)
- Storybook required for visible components with Default/Loading/Error/Empty
- No breaking changes; ADD only

## Wireframe and Route Structure

Route: `src/apps/admin.portal/Dashboard.tsx` (index route under `AdminShell`)

- Header
  - TenantBadge: shows domain + plan, optional DEV chip when `flags.showDevTools`
- KPI Row
  - DashboardKPIs: tiles for Builds, Catalog, Packager status/total
- Preview Panel
  - PackagerDryRunPanel: calls dry-run and shows totals + hints (read-only)

## Components

1) TenantBadge
   - Props: `{ domain?: string; plan?: string; showDevChip?: boolean; isLoading?: boolean; error?: string | null }`
   - States: loading, error, default
   - a11y: `role=alert` focus on error; labels for domain and plan

2) DashboardKPIs (existing)
   - Fetches builds/catalog counts and dry-run status
   - Storybook present

3) PackagerDryRunPanel
   - Props: `{ title?: string; sample?: 'empty' | 'demo'; ariaLive?: 'polite' | 'assertive' | 'off' }`
   - States: loading, error, empty, success
   - a11y: `aria-live` on updates; focus to results/errors

## Data Contract Sketch

`app/routes/dashboard.contract.ts`
- `DashboardLoaderData`: `{ tenant: { domain, plan }, flags: { showDevTools? }, kpis: { buildsCount?, catalogCount?, packager: { ok, hints, total?, code? } } }`
- `DryRunPreview`: normalized dry-run shape
- `mockDashboardData()` for tests/stories

Existing endpoints leveraged:
- `/apps/proxy/api/builds?limit=1` for builds count
- `/apps/proxy/api/catalog/products?cursor=` for catalog count
- `/apps/proxy/api/checkout/package` with `X-RBP-Dry-Run: 1` for packager dry-run

## a11y Notes
- Use `aria-live` on async sections (status and results)
- `role=alert` and focus management on error states
- Keyboard focus styles preserved; interactive elements have labels

## Non-goals
- Real metric correctness beyond mocked/derived counts
- Any write actions or mutations
- Complex filtering/parameters for dry-run

## Risks
- Proxy/HMAC errors when running outside the proxy context; components handle with safe fallbacks
- API shape drift; normalized mapping in `createPackagerApi`

## Acceptance Criteria (Design)
- Clear component boundaries and prop types documented
- States (loading/error/empty/default) handled and demonstrated in Storybook for TenantBadge and PackagerDryRunPanel; DashboardKPIs stories already present
- No breaking API changes
- a11y: aria-live for async, focus to errors

<!-- END RBP GENERATED: tenant-admin-dashboard-v1 -->
