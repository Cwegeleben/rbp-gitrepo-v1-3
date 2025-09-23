// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import React from 'react';
import { HQHeader } from './HQHeader';
import { LiveRegion } from '../../../../../packages/ui/live-region/LiveRegion';
import type { TenantModulesResponse } from '../../../../../apps/hq.api/types/hq';

export const TenantsModules: React.FC<{ data: TenantModulesResponse }> = ({ data }) => {
  const [filter, setFilter] = React.useState('');
  const items = React.useMemo(() => data.modules.filter(m => m.name.toLowerCase().includes(filter.toLowerCase())), [data, filter]);
  function onFilter(e: React.ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value);
    LiveRegion.announce(`Filter ${e.target.value}`);
  }
  return (
    <div style={{ background: '#f8f8f8', minHeight: '100%' }}>
      <HQHeader title="Tenant Modules" subtitle={`Tenant: ${data.tenantId}`} />
      <div style={{ padding: 16 }}>
        <input aria-label="Filter" value={filter} onChange={onFilter} placeholder="Filter by name" />
        <ul>
          {items.map(m => <li key={m.id}><strong>{m.name}</strong> <span style={{ color:'#666' }}>{m.key}</span></li>)}
        </ul>
      </div>
    </div>
  );
};
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
