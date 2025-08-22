import React from 'react';
import type { CatalogProduct } from '../lib/createCatalogApi';
import { ui } from '../../uiStrings';

/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
export type SortKey = 'vendor' | 'title' | 'priceBand' | 'enabled';
export type SortDir = 'asc' | 'desc';

export const DataTable: React.FC<{
  rows: CatalogProduct[];
  toggling: Set<string>;
  onToggle: (id: string, next: boolean) => void | Promise<void>;
  sort: { key: SortKey; dir: SortDir };
  onSortChange: (next: { key: SortKey; dir: SortDir }) => void;
  selectedIds: Set<string>;
  onSelectChange: (opts: { type: 'row' | 'all'; id?: string; index?: number; checked: boolean; shiftKey?: boolean }) => void;
  pageInfo?: { nextCursor?: string; prevCursor?: string };
  onPage: (cursor?: string) => void;
}> = ({ rows, toggling, onToggle, sort, onSortChange, selectedIds, onSelectChange, pageInfo, onPage }) => {
  const headers: Array<{ key: SortKey; label: string; align?: 'left' | 'center' } | { key: 'select'; label: string } | { key: 'actions'; label: string } > = [
    { key: 'select', label: '' } as any,
    { key: 'title', label: 'Product', align: 'left' },
    { key: 'vendor', label: 'Vendor', align: 'center' },
    { key: 'priceBand', label: 'Price Band', align: 'center' },
    { key: 'enabled', label: 'Enabled', align: 'center' },
    { key: 'actions', label: 'Actions' } as any,
  ];

  const isAllSelected = rows.length > 0 && rows.every(r => selectedIds.has(r.id));
  const someSelected = rows.some(r => selectedIds.has(r.id));

  return (
    <div>
      <div aria-live="polite" data-testid="selection-live" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}>
        {selectedIds.size} selected
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
            {headers.map((h, i) => {
              if ((h as any).key === 'select') {
                return (
                  <th key={`h-${i}`} style={{ textAlign: 'center', width: 36 }}>
                    <input
                      type="checkbox"
                      aria-label="Select all on page"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = !isAllSelected && someSelected;
                      }}
                      onChange={(e) => onSelectChange({ type: 'all', checked: e.target.checked })}
                    />
                  </th>
                );
              }
              if ((h as any).key === 'actions') {
                return <th key={`h-${i}`} style={{ textAlign: 'center' }}>{h.label}</th>;
              }
              const hk = (h as any).key as SortKey;
              const isActive = sort.key === hk;
              const ariaSort = isActive ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none';
              const align = 'align' in (h as any) ? (h as any).align : 'left';
              return (
                <th key={`h-${i}`} aria-sort={ariaSort as any} style={{ textAlign: align || 'left', cursor: 'pointer' }}>
                  <button
                    type="button"
                    onClick={() => onSortChange({ key: hk, dir: isActive && sort.dir === 'asc' ? 'desc' : 'asc' })}
                    aria-label={`Sort by ${h.label}`}
                    style={{ all: 'unset', cursor: 'pointer' }}
                  >
                    {h.label}{isActive ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => {
            const titleId = `title-${r.id}`;
            return (
              <tr key={r.id} className={selectedIds.has(r.id) ? 'row-selected' : ''}>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    aria-labelledby={titleId}
                    checked={selectedIds.has(r.id)}
                    onChange={(e) => onSelectChange({ type: 'row', id: r.id, index: idx, checked: e.target.checked, shiftKey: (e.nativeEvent as any).shiftKey })}
                  />
                </td>
                <td id={titleId} style={{ textAlign: 'left' }}>{r.title}</td>
                <td style={{ textAlign: 'center' }}>{r.vendor || '—'}</td>
                <td style={{ textAlign: 'center' }}>{String(r.priceBand ?? '—')}</td>
                <td style={{ textAlign: 'center' }}>{r.enabled ? 'Enabled' : 'Disabled'}</td>
                <td style={{ textAlign: 'center' }}>
                  <ToggleCell
                    checked={r.enabled}
                    pending={toggling.has(r.id)}
                    onChange={(n) => onToggle(r.id, n)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
        <button disabled={!pageInfo?.prevCursor} onClick={() => onPage(pageInfo?.prevCursor)} aria-label={ui.common.prev}>
          {ui.common.prev}
        </button>
        <button disabled={!pageInfo?.nextCursor} onClick={() => onPage(pageInfo?.nextCursor)} aria-label={ui.common.next}>
          {ui.common.next}
        </button>
      </div>
    </div>
  );
};

export const ToggleCell: React.FC<{ checked: boolean; pending?: boolean; onChange: (next: boolean) => void }>
  = ({ checked, pending, onChange }) => {
    return (
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <input
          type="checkbox"
          checked={checked}
          disabled={pending}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={ui.a11y.toggle('product', !checked)}
        />
        {pending && <span>{ui.catalog.saving}</span>}
      </label>
    );
  };
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */
