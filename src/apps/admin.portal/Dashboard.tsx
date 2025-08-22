/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React, { useContext } from "react";
import { TenantContext } from "./TenantContext";
import { KpiTile } from "./KpiTile";
import { EmptyState } from "./EmptyState";

export const Dashboard: React.FC = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) return <EmptyState message="Loading Tenant Context..." />;
  return (
    <div className="dashboard">
      <h1>Shop: {ctx.shopDomain}</h1>
      <h2>Plan: {ctx.plan}</h2>
      <div className="kpi-row">
        <KpiTile label="Products" value={ctx.kpi?.products ?? 0} />
        <KpiTile label="Builds" value={ctx.kpi?.builds ?? 0} />
        <KpiTile label="Vendors" value={ctx.kpi?.vendors ?? 0} />
      </div>
    </div>
  );
};
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
