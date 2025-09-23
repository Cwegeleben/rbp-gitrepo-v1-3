# Tenant App Inventory (Embedded Admin)

<!-- BEGIN RBP GENERATED: tenant-dashboard-wiring-v1-0 -->

This document inventories tenant-visible features already wired in the app and highlights next UI opportunities.

## Embedded Admin Routes
- /app — Dashboard (Polaris Page)
- /app/catalog — Catalog (Polaris Page)
- /app/builds — Builds (Polaris Page)
- /app/settings — Settings (Polaris Page)
- /app/doctor — Doctor (Polaris/Diagnostics)

## Gateway Proxy Endpoints
- /apps/proxy/ping — present
- /apps/proxy/api/access/ctx — present (signed; read-only)
- /apps/proxy/registry.json — present (returns tenant registry; shell enforced)
- /apps/proxy/modules/rbp-shell/* — present (shell module mapping)
- /apps/proxy?view=builder|catalog — present (mini views)

## Next UI Opportunities
- Registry Shell card could link to shell index when enabled.
- Surface AccessV2 roles/features summary.
- Add tiny uptime indicator using /apps/proxy/modules/health.

<!-- END RBP GENERATED: tenant-dashboard-wiring-v1-0 -->
