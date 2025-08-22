/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 --> */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { FilterBar } from '../../CatalogPage';

const meta: Meta<typeof FilterBar> = {
  title: 'Admin/Components/FilterBar',
  component: FilterBar,
};
export default meta;

type Story = StoryObj<typeof FilterBar>;

function FilterBarWithUrl() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get('q') || '';
  const vendor = (sp.get('vendor') || '').split(',').filter(Boolean);
  const tags = (sp.get('tags') || '').split(',').filter(Boolean);
  const priceBand = sp.get('priceBand') || '';
  const onChange = (next: Partial<{ q: string; vendor: string[]; tags: string[]; priceBand?: string }>) => {
    const n = new URLSearchParams(sp.toString());
    if (next.q !== undefined) n.set('q', next.q || '');
    if (next.vendor !== undefined) n.set('vendor', (next.vendor || []).join(','));
    if (next.tags !== undefined) n.set('tags', (next.tags || []).join(','));
    if (next.priceBand !== undefined) {
      if (next.priceBand) n.set('priceBand', next.priceBand);
      else n.delete('priceBand');
    }
    setSp(n);
  };
  return (
    <div>
      <FilterBar q={q} vendor={vendor} tags={tags} priceBand={priceBand} onChange={onChange} />
      <div style={{ marginTop: 12, fontFamily: 'monospace' }}>URL: ?{sp.toString()}</div>
    </div>
  );
}

export const Prefilled: Story = {
  render: () => (
  <MemoryRouter initialEntries={[{ pathname: '/', search: '?q=rod&vendor=RBP,ACME&tags=carbon,fast&priceBand=medium' }]}>
      <FilterBarWithUrl />
    </MemoryRouter>
  )
};

export const Empty: Story = {
  render: () => (
    <MemoryRouter>
      <FilterBarWithUrl />
    </MemoryRouter>
  )
};
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2 --> */
