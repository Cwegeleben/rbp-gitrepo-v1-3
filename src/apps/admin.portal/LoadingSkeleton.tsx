/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React from "react";

export const LoadingSkeleton: React.FC<{ rows?: number }>
  = ({ rows = 5 }) => (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ height: 16, background: '#eee', marginBottom: 8, borderRadius: 4 }} />
      ))}
    </div>
  );
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
