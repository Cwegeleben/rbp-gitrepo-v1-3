/*
<!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
import React from 'react';
import { TenantBadge } from '../components/TenantBadge';
import { DashboardKPIs } from '../components/DashboardKPIs';
import { PackagerDryRunPanel } from '../components/PackagerDryRunPanel';
import type { DashboardLoaderData } from './dashboard.contract';

// Wireframe-only: not connected to router; mirrors `Dashboard.tsx` composition.
export const DashboardRouteUI: React.FC<{ data?: DashboardLoaderData }> = () => {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <TenantBadge />
      </div>
      <div style={{ marginBottom: 12 }}>
        <DashboardKPIs />
      </div>
      <PackagerDryRunPanel />
    </div>
  );
};

// Sketch for a route loader; currently mocked to avoid proxy dependency here.
export async function loadDashboardData(): Promise<DashboardLoaderData> {
  return {
    tenant: { domain: 'demo.myshopify.com', plan: 'Pro' },
    flags: { showDevTools: true },
    kpis: { buildsCount: 0, catalogCount: 0, packager: { ok: true, hints: 0, total: 0 } },
  };
}
/*
<!-- END RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
