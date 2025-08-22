/*
<!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
import React from 'react';

export type EmptyStateProps = { title?: string; message?: string };
export const EmptyState: React.FC<EmptyStateProps> = ({ title = 'Nothing here yet', message = 'Data will appear once available.' }) => (
  <div role="note" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', padding: 12, borderRadius: 6 }}>
    <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
    <div>{message}</div>
  </div>
);
/*
<!-- END RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
