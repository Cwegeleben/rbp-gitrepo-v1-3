/*
<!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
import React from 'react';
import { TenantBadge } from '../components/TenantBadge';
import { KpiCards } from '../components/KpiCards';
import { PackagerDryRunPanel } from '../components/PackagerDryRunPanel';
import type { DashboardLoaderData } from './dashboard.contract';
/*
<!-- BEGIN RBP GENERATED: admin-loader-server-wiring -->
*/
import { ctx as baseCtx } from '../../../rbp-shopify-app/rod-builder-pro/app/proxy/ctx.server';
import { getAccessForUser } from '../../../gateway/api-gateway/app/proxy/access.server';
import { getPlannedLinesForOrder, resolveVariantIdsWithHints } from '../../../gateway/api-gateway/app/proxy/packager/plan.server';
import { calcTotals } from '../../../gateway/api-gateway/app/proxy/packager/totals.server';
/*
<!-- END RBP GENERATED: admin-loader-server-wiring -->
*/

export async function loader(): Promise<DashboardLoaderData> {
  /* <!-- BEGIN RBP GENERATED: admin-loader-server-wiring --> */
  // Access context via shared server helper
  let tenantDomain = 'rbp-dev.myshopify.com';
  let tenantPlan = 'dev';
  let showDevTools = true;
  try {
    const req = new Request(`http://rbp.local/ctx?domain=${encodeURIComponent(tenantDomain)}`);
    const res = await baseCtx(req);
    const body = await (res as Response).json();
    tenantDomain = body?.tenant?.domain || tenantDomain;
    tenantPlan = body?.tenant?.plan || tenantPlan;
    showDevTools = !!(body?.flags?.features?.devtools);
  } catch {
    // keep defaults
  }

  // Merge roles/features if needed (non-breaking; dashboard currently needs plan/domain + dev flag)
  try {
    await getAccessForUser(tenantDomain, null);
  } catch {}

  // KPI counts: use lightweight stubs to avoid HTTP; return 0 on error
  async function getBuildsCount(): Promise<number> { try { return 0; } catch { return 0; } }
  async function getCatalogCount(): Promise<number> { try { return 0; } catch { return 0; } }

  const buildsCount = await getBuildsCount();
  const catalogCount = await getCatalogCount();

  // Packager dry-run via shared server functions (no HTTP)
  let pkgOk = true;
  let pkgTotal: number | null = 0;
  let pkgHintsCount = 0;
  try {
    const lines = await getPlannedLinesForOrder(tenantDomain, undefined);
    const { lines: withVariants, hints: planHints } = await resolveVariantIdsWithHints(lines);
    const totals = calcTotals(withVariants as any);
    pkgTotal = totals.totals.total;
    pkgHintsCount = (planHints?.length || 0) + (totals?.hints?.length || 0);
    pkgOk = true;
  } catch {
    pkgOk = false;
    pkgTotal = 0;
    pkgHintsCount = 0;
  }

  const data: DashboardLoaderData = {
    tenant: { domain: tenantDomain, plan: tenantPlan },
    flags: { showDevTools },
    kpis: {
      buildsCount,
      catalogCount,
      packager: { ok: pkgOk, hints: pkgHintsCount, total: pkgTotal ?? 0 },
    },
  };
  return data;
  /* <!-- END RBP GENERATED: admin-loader-server-wiring --> */
}

export default function DashboardRoute(props: { data?: DashboardLoaderData } = {}) {
  const data = props.data;
  return (
    <div>
      {data && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <TenantBadge domain={data.tenant.domain} plan={data.tenant.plan} showDevChip={data.flags.showDevTools} />
        </div>
      )}
      <div style={{ marginBottom: 12 }}>
        <KpiCards />
      </div>
      <PackagerDryRunPanel />
    </div>
  );
}
/*
<!-- END RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
