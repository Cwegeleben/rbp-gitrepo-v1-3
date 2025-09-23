// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import React from 'react';
import { HQHeader } from './HQHeader';
import type { CatalogMaster } from '../../../../../apps/hq.api/types/hq';

export const CatalogList: React.FC<{ data: CatalogMaster }> = ({ data }) => {
  return (
    <div style={{ background: '#f8f8f8', minHeight: '100%' }}>
      <HQHeader title="Catalog Master" subtitle={`Updated ${new Date(data.updatedAt).toLocaleString()}`} />
      <div style={{ padding: 16 }}>
        <ul>
          {data.components.map((c) => (
            <li key={c.id}><strong>{c.name}</strong> <span style={{ color:'#666' }}>({c.type})</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
};
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
