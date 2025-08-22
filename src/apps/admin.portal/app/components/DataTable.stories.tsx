/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';

const meta: Meta<typeof DataTable> = {
  title: 'Admin/Catalog/DataTable',
  component: DataTable,
};
export default meta;

type Story = StoryObj<typeof DataTable>;

const sample = Array.from({ length: 20 }).map((_, i) => ({
  id: String(i+1),
  title: `Product ${i+1}`,
  vendor: i % 2 === 0 ? 'ACME' : 'RBP',
  priceBand: (i % 3) + 1,
  enabled: i % 4 === 0,
}));

export const DefaultSorted: Story = {
  render: () => {
    const [sort, setSort] = useState<{ key: 'vendor'|'title'|'priceBand'|'enabled'; dir: 'asc'|'desc' }>({ key: 'vendor', dir: 'asc' });
    const [selected, setSelected] = useState<Set<string>>(new Set());
    return (
      <DataTable
        rows={sample}
        toggling={new Set()}
        onToggle={() => {}}
        sort={sort}
        onSortChange={setSort as any}
        selectedIds={selected}
        onSelectChange={({ type, id, index, checked, shiftKey }) => {
          setSelected(prev => {
            const next = new Set(prev);
            if (type === 'all') {
              if (checked) sample.forEach(r => next.add(r.id)); else sample.forEach(r => next.delete(r.id));
            } else if (id) {
              if (checked) next.add(id); else next.delete(id);
            }
            return next;
          });
        }}
        onPage={() => {}}
      />
    );
  }
};

export const BulkSelected: Story = {
  render: () => {
    const [sort, setSort] = useState<{ key: 'vendor'|'title'|'priceBand'|'enabled'; dir: 'asc'|'desc' }>({ key: 'vendor', dir: 'asc' });
    const selected = new Set(sample.slice(0,5).map(s => s.id));
    return (
      <DataTable
        rows={sample}
        toggling={new Set()}
        onToggle={() => {}}
        sort={sort}
        onSortChange={setSort as any}
        selectedIds={selected}
        onSelectChange={() => {}}
        onPage={() => {}}
      />
    );
  }
};

export const BulkToggleError: Story = {
  render: () => {
    const [sort, setSort] = useState<{ key: 'vendor'|'title'|'priceBand'|'enabled'; dir: 'asc'|'desc' }>({ key: 'vendor', dir: 'asc' });
    const [rows, setRows] = useState(sample);
    const [pending, setPending] = useState<Set<string>>(new Set());
    return (
      <DataTable
        rows={rows}
        toggling={pending}
        onToggle={async (id, next) => {
          setPending((prev) => { const n = new Set(prev); n.add(id); return n; });
          setRows(rs => rs.map(r => r.id === id ? { ...r, enabled: next } : r));
          await new Promise((r) => setTimeout(r, 300));
          // rollback to simulate failure
          setRows(rs => rs.map(r => r.id === id ? { ...r, enabled: !next } : r));
          setPending(p => { const n = new Set(p); n.delete(id); return n; });
        }}
        sort={sort}
        onSortChange={setSort as any}
        selectedIds={new Set()}
        onSelectChange={() => {}}
        onPage={() => {}}
      />
    );
  }
};

export const StickyHeader: Story = {
  render: () => {
    const [sort, setSort] = useState<{ key: 'vendor'|'title'|'priceBand'|'enabled'; dir: 'asc'|'desc' }>({ key: 'vendor', dir: 'asc' });
    const rows = Array.from({ length: 100 }).map((_, i) => ({ id: `${i+1}`, title: `Item ${i+1}`, vendor: 'ACME', priceBand: i % 5, enabled: i % 2 === 0 }));
    return (
      <div style={{ maxHeight: 280, overflow: 'auto' }}>
        <DataTable
          rows={rows}
          toggling={new Set()}
          onToggle={() => {}}
          sort={sort}
          onSortChange={setSort as any}
          selectedIds={new Set()}
          onSelectChange={() => {}}
          onPage={() => {}}
        />
      </div>
    );
  }
};
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */
