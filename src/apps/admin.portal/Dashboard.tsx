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

export const Dashboard: React.FC = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) return <EmptyState message="Loading Tenant Context..." />;
  return (
    <div className="dashboard">
      <h1>Shop: {ctx.shopDomain}</h1>
      <h2>Plan: {ctx.plan}</h2>
      {/* <!-- BEGIN RBP GENERATED: tenant-admin-ui-visibility --> */}
      <div className="kpi-row" style={{ marginBottom: 12 }}>
        <DashboardKPIs />
      </div>
      {/* <!-- END RBP GENERATED: tenant-admin-ui-visibility --> */}
    </div>
  );
};
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
