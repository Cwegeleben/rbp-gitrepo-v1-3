import React from 'react';
import { ui } from '../../uiStrings';

/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
export const Toolbar: React.FC<{
  selectedCount: number;
  totalCount: number;
  sortLabel: string;
  onEnable: () => void;
  onDisable: () => void;
  onClear: () => void;
}> = ({ selectedCount, totalCount, sortLabel, onEnable, onDisable, onClear }) => {
  if (selectedCount <= 0) return null;
  return (
    <div role="region" aria-label="Bulk actions" style={{ position: 'sticky', top: 0, background: '#f8f8f8', padding: 8, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 8, zIndex: 2 }}>
      <div style={{ marginRight: 'auto' }}>
        <strong>{selectedCount}</strong> {ui.catalog.selectedOf(totalCount)} • {ui.catalog.sortedBy(sortLabel)}
      </div>
      <button onClick={onEnable}>{ui.catalog.enable}</button>
      <button onClick={onDisable}>{ui.catalog.disable}</button>
      <button onClick={onClear}>{ui.catalog.clear}</button>
    </div>
  );
};
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */
