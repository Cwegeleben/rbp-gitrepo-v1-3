<!-- BEGIN RBP GENERATED: tenant-admin-wrapup -->
# Tenant Admin v1 Wrap-Up

This document summarizes the v1 hardening pass for the Tenant Admin (Embedded) app.

## Highlights

- Catalog v2: vendor/tags multi-select, price band filter, URL-driven state, stable sort, optimistic toggle with retry/rollback.
- Builds: read-only list with detail side panel, focus-trap, Esc to close, focus restore, in-panel 404/403.
- Settings: plan/shop copy-to-clipboard with polite live region; feature flags flattened and shown as pills.
- Proxy enforcement: all `/apps/proxy/*` calls go through `fetchProxy`.
- Storybook: component stories for FilterBar, ToggleCell, BuildDetailPanel, BuildsPage, SettingsPanel.

## How to run

- Storybook: `pnpm storybook` (default port 6006)
- Tests (admin only): `pnpm test:admin`
- Smoke (proxy endpoints): `RBP_ADMIN_BASE_URL=http://localhost:51544 pnpm smoke:admin`

## Files of interest

- `src/apps/admin.portal/app/lib/createCatalogApi.ts` – centralized Catalog API client.
- `src/apps/admin.portal/app/lib/urlState.ts` – read/write URL search params.
- `src/apps/admin.portal/CatalogPage.tsx` – filters, sorting, pagination, toggle logic.
- `src/apps/admin.portal/BuildsPage.tsx` – read-only builds list + detail panel a11y.
- `src/apps/admin.portal/SettingsPage.tsx` – flags, vendors, copy-to-clipboard.
- `src/apps/admin.portal/uiStrings.ts` – UI copy including price band labels.

## Tests

- Catalog: filters composition, pagination cursors, toggle retry/rollback, proxy enforcement.
- Builds: focus restoration after panel close.
- Gating: nav/visibility by feature flags.

## A11y notes

- Live regions with `role="status"` for async updates.
- Focus management in BuildDetailPanel: trap within panel; Esc closes; focus restored.
- Inputs labeled via `aria-label` and visible labels.

## Next ideas

- Add Chromatic for visual diffs of stories.
- Expand Settings tests for clipboard failure fallback.
<!-- END RBP GENERATED: tenant-admin-wrapup -->
