/*
<!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
import React from 'react';
import { TenantBadge } from '../components/TenantBadge';
import { KpiCards } from '../components/KpiCards';
import { PackagerDryRunPanel } from '../components/PackagerDryRunPanel';
import type { DashboardLoaderData } from './dashboard.contract';
import { createPackagerApi } from '../lib/createPackagerApi';

export async function loader(): Promise<DashboardLoaderData> {
  // Attempt to fetch real data, fallback to mocks
  async function tryJson(path: string, fallback: any) {
    try {
      const res = await fetch(path, { headers: { Accept: 'application/json' } });
      if (!res.ok) return fallback;
      return await res.json();
    } catch {
      return fallback;
    }
  }
  const access = await tryJson('/apps/proxy/api/access/ctx', { tenant: { domain: 'demo.myshopify.com', plan: 'Pro' }, flags: { showDevTools: true } });
  const builds = await tryJson('/apps/proxy/api/builds?limit=1', { pageInfo: { total: 0 } });
  const catalog = await tryJson('/apps/proxy/api/catalog/products?cursor=', { pageInfo: { total: 0 } });
  let packager = { ok: true, meta: { totals: { subtotal: 0, estTax: 0, total: 0, currency: 'USD' } }, hints: [] as any[] };
  try {
    const api = createPackagerApi(async (input: any, init?: any) => fetch(input, init) as any);
    const res = await api.packageDryRun();
    if (res.ok) packager = { ok: true, meta: res.meta || packager.meta, hints: res.hints || [] } as any;
  } catch {}

  const data: DashboardLoaderData = {
    tenant: { domain: access?.shopDomain || access?.tenant?.domain || 'demo.myshopify.com', plan: access?.plan || access?.tenant?.plan || 'Pro' },
    flags: { showDevTools: !!(access?.flags?.showDevTools) },
    kpis: {
      buildsCount: typeof builds?.pageInfo?.total === 'number' ? builds.pageInfo.total : 0,
      catalogCount: typeof catalog?.pageInfo?.total === 'number' ? catalog.pageInfo.total : 0,
      packager: { ok: !!packager.ok, hints: Array.isArray(packager.hints) ? packager.hints.length : 0, total: packager?.meta?.totals?.total ?? 0 },
    },
  };
  return data;
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
