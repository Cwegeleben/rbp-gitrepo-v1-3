/*
<!-- BEGIN RBP GENERATED: admin-catalog-v2-2 -->
*/
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import AdminCatalogShell from './AdminCatalogShell';
import { http, HttpResponse } from 'msw';

const meta: Meta<typeof AdminCatalogShell> = {
  title: 'Admin/Catalog/AdminCatalogShell',
  component: AdminCatalogShell,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof AdminCatalogShell>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/apps/proxy/api/catalog/products', () => {
          return HttpResponse.json({ items: [
            { id: 'p1', title: 'Alpha', vendor: 'Acme', priceBand: 'low', enabled: true },
            { id: 'p2', title: 'Beta', vendor: 'Bravo', priceBand: 'high', enabled: false },
          ] });
        }),
      ],
    },
  },
  render: () => <AdminCatalogShell />,
};

export const Filtered: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/apps/proxy/api/catalog/products', ({ request }) => {
          const url = new URL(request.url);
          if (url.searchParams.get('q')) {
            return HttpResponse.json({ items: [ { id: 'p2', title: 'Beta', vendor: 'Bravo', priceBand: 'high', enabled: false } ] });
          }
          return HttpResponse.json({ items: [] });
        }),
      ],
    },
  },
  render: () => <AdminCatalogShell />,
};

export const BulkSelected: Story = {
  parameters: { msw: { handlers: [ http.get('/apps/proxy/api/catalog/products', () => HttpResponse.json({ items: [ { id: 'p1', title: 'Alpha', enabled: true }, { id: 'p2', title: 'Beta', enabled: false } ] })) ] } },
  render: () => <AdminCatalogShell />,
};

export const RollbackError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/apps/proxy/api/catalog/products', () => HttpResponse.json({ items: [ { id: 'p1', title: 'Alpha', enabled: true } ] })),
        http.patch('/apps/proxy/api/catalog/product/:id', () => new HttpResponse(null, { status: 500 })),
      ],
    },
  },
  render: () => <AdminCatalogShell />,
};
/*
<!-- END RBP GENERATED: admin-catalog-v2-2 -->
*/
