/*
<!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 -->
Data contract sketch for Dashboard route loader and helpers.

Route: '/' (index under AdminShell). No breaking changes; this is additive. Real loader stays in client for now; this file documents shapes and exports lightweight helpers for tests.
*/

export type DashboardLoaderData = {
  tenant: { domain: string; plan: string };
  flags: { showDevTools?: boolean };
  kpis: {
    buildsCount?: number | null;
    catalogCount?: number | null;
    packager: { ok: boolean; hints: number; total?: number | null; code?: string };
  };
};

export type DryRunLine = { sku: string; qty: number; price?: number };
export type DryRunTotals = { subtotal: number; estTax?: number; total: number; currency?: string };
export type DryRunHint = { type: string; message?: string; sku?: string };
export type DryRunPreview = { ok: boolean; lines: DryRunLine[]; totals: DryRunTotals; hints: DryRunHint[]; code?: string };

export function mockDashboardData(overrides: Partial<DashboardLoaderData> = {}): DashboardLoaderData {
  return {
    tenant: { domain: 'demo.myshopify.com', plan: 'Pro' },
    flags: { showDevTools: true },
    kpis: { buildsCount: 12, catalogCount: 34, packager: { ok: true, hints: 0, total: 10.9 } },
    ...overrides,
  };
}

/* Notes:
- Access context endpoint: /apps/proxy/api/access/ctx (strict HMAC on proxy). Use existing server helper if building a real loader later.
- KPIs can use /apps/proxy/api/builds and /apps/proxy/api/catalog/products; dry-run via /apps/proxy/api/checkout/package with X-RBP-Dry-Run: 1.
- For now, UI components fetch on mount; when server routing exists, migrate to loader pattern and pass props down.
*/
/*
<!-- END RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
