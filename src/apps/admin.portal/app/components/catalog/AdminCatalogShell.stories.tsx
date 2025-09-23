/*
<!-- BEGIN RBP GENERATED: admin-catalog-v2-2 -->
*/
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import AdminCatalogShell from './AdminCatalogShell';
import { http, HttpResponse } from 'msw';
// <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
import { LiveRegion } from '../../../../../packages/ui/live-region/LiveRegion';
import { within, userEvent } from '@storybook/test';
// <!-- END RBP GENERATED: admin-acceptance-v1 -->

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
  render: () => (<>
    {/* <!-- BEGIN RBP GENERATED: admin-acceptance-v1 --> */}
    <LiveRegion />
    {/* <!-- END RBP GENERATED: admin-acceptance-v1 --> */}
    <AdminCatalogShell />
  </>),
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
  render: () => (<>
    {/* <!-- BEGIN RBP GENERATED: admin-acceptance-v1 --> */}
    <LiveRegion />
    {/* <!-- END RBP GENERATED: admin-acceptance-v1 --> */}
    <AdminCatalogShell />
  </>),
};

export const BulkSelected: Story = {
  parameters: { msw: { handlers: [ http.get('/apps/proxy/api/catalog/products', () => HttpResponse.json({ items: [ { id: 'p1', title: 'Alpha', enabled: true }, { id: 'p2', title: 'Beta', enabled: false } ] })) ] } },
  render: () => (<>
    {/* <!-- BEGIN RBP GENERATED: admin-acceptance-v1 --> */}
    <LiveRegion />
    {/* <!-- END RBP GENERATED: admin-acceptance-v1 --> */}
    <AdminCatalogShell />
  </>),
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
  render: () => (<>
    {/* <!-- BEGIN RBP GENERATED: admin-acceptance-v1 --> */}
    <LiveRegion />
    {/* <!-- END RBP GENERATED: admin-acceptance-v1 --> */}
    <AdminCatalogShell />
  </>),
  // <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rowCheckboxes = (await canvas.findAllByRole('checkbox')).filter(el => (el as HTMLInputElement).type === 'checkbox');
    // select first row
    await userEvent.click(rowCheckboxes[1]);
    const disable = await canvas.findByRole('button', { name: /disable/i });
    await userEvent.click(disable);
  }
  // <!-- END RBP GENERATED: admin-acceptance-v1 -->
};
/*
<!-- END RBP GENERATED: admin-catalog-v2-2 -->
*/
