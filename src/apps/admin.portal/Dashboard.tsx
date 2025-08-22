/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React, { useContext } from "react";
import { TenantContext } from "./TenantContext";
import { KpiTile } from "./KpiTile";
import { EmptyState } from "./EmptyState";
/* <!-- BEGIN RBP GENERATED: tenant-admin-ui-visibility --> */
import { DashboardKPIs } from './app/components/DashboardKPIs';
/* <!-- END RBP GENERATED: tenant-admin-ui-visibility --> */
/* <!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 --> */
import { TenantBadge } from './app/components/TenantBadge';
import { PackagerDryRunPanel } from './app/components/PackagerDryRunPanel';
/* <!-- END RBP GENERATED: tenant-admin-dashboard-v1 --> */
/* <!-- BEGIN RBP GENERATED: dev-debug-panel-v1 --> */
import { DevDebugPanel } from './app/components/DevDebugPanel';
/* <!-- END RBP GENERATED: dev-debug-panel-v1 --> */

export const Dashboard: React.FC = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) return <EmptyState message="Loading Tenant Context..." />;
  return (
    <div className="dashboard">
      {/* <!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 --> */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <TenantBadge />
      </div>
      {/* <!-- END RBP GENERATED: tenant-admin-dashboard-v1 --> */}
      {/* <!-- BEGIN RBP GENERATED: tenant-admin-ui-visibility --> */}
      <div className="kpi-row" style={{ marginBottom: 12 }}>
        <DashboardKPIs />
      </div>
      {/* <!-- END RBP GENERATED: tenant-admin-ui-visibility --> */}
      {/* <!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 --> */}
      <div>
        <PackagerDryRunPanel />
      </div>
      {/* <!-- END RBP GENERATED: tenant-admin-dashboard-v1 --> */}
      {/* <!-- BEGIN RBP GENERATED: dev-debug-panel-v1 --> */}
      {ctx?.flags?.showDevTools ? (
        <div style={{ marginTop: 16 }}>
          <DevDebugPanel />
        </div>
      ) : null}
      {/* <!-- END RBP GENERATED: dev-debug-panel-v1 --> */}
    </div>
  );
};
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
