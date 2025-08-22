/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React from "react";

export const ErrorState: React.FC<{ title?: string; message?: string }>
  = ({ title = 'Something went wrong', message = 'Please try again or contact RBP.' }) => (
    <div role="alert" style={{ border: '1px solid #f5c2c7', background: '#f8d7da', color: '#842029', padding: 12, borderRadius: 6 }}>
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div>{message}</div>
    </div>
  );
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
