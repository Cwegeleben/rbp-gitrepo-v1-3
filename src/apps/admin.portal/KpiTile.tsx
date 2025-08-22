/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React from "react";

/* <!-- BEGIN RBP GENERATED: tenant-admin-ui-visibility --> */
export type KpiTone = 'default' | 'green' | 'amber' | 'red';

export const KpiTile = ({ label, value, subtext, tone = 'default' }: { label: string; value: number | string | React.ReactNode; subtext?: string; tone?: KpiTone }) => (
  <div className="kpi-tile" data-tone={tone} style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: 12, background: '#fff' }}>
    <div className="kpi-label" style={{ fontSize: 12, color: '#555' }}>{label}</div>
    <div className="kpi-value" style={{ fontSize: 22, fontWeight: 700, color: tone === 'green' ? '#137333' : tone === 'amber' ? '#a86a00' : tone === 'red' ? '#b00020' : '#111' }}>{value}</div>
    {subtext && <div className="kpi-subtext" style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{subtext}</div>}
  </div>
);
/* <!-- END RBP GENERATED: tenant-admin-ui-visibility --> */
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
