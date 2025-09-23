// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import React from 'react';
import { LiveRegion } from '../../../../../packages/ui/live-region/LiveRegion';
import { HQHeader } from './HQHeader';
import type { Module } from '../../../../../apps/hq.api/types/hq';

export interface ModulesTableProps { items: Module[] }

export const ModulesTable: React.FC<ModulesTableProps> = ({ items }) => {
  const [sortAsc, setSortAsc] = React.useState(true);
  const sorted = React.useMemo(() => {
    return [...items].sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  }, [items, sortAsc]);

  function toggleSort() {
    setSortAsc((s) => {
      const next = !s;
      LiveRegion.announce(`Sorted by Name ${next ? '↑' : '↓'}`);
      return next;
    });
  }

  return (
    <div style={{ background: '#f8f8f8', minHeight: '100%' }}>
      <HQHeader title="Modules" subtitle="Control-plane modules available to tenants" />
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <strong>{sorted.length}</strong> modules
          <button onClick={toggleSort} aria-label="Sort by Name">Sort</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ position: 'sticky', top: 0, background: '#fff' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Key</th>
              <th style={{ textAlign: 'center', padding: 8 }}>Enabled by default</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => (
              <tr key={m.id}>
                <td style={{ padding: 8 }}>{m.name}</td>
                <td style={{ padding: 8, color: '#666' }}>{m.key}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>{m.enabledByDefault ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
