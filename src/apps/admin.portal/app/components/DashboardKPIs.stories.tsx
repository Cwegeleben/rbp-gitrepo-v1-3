/* <!-- BEGIN RBP GENERATED: tenant-admin-ui-visibility --> */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DashboardKPIs } from './DashboardKPIs';

const meta: Meta<typeof DashboardKPIs> = {
  title: 'Admin/Dashboard/DashboardKPIs',
  component: DashboardKPIs,
};
export default meta;

type Story = StoryObj<typeof DashboardKPIs>;

export const OkNoHints: Story = {
  render: () => <DashboardKPIs />,
  decorators: [(
    Story,
  ) => {
    (global as any).fetch = (input: RequestInfo) => {
      const url = typeof input === 'string' ? input : (input as Request).url;
      if (url.includes('/apps/proxy/api/builds')) return Promise.resolve(new Response(JSON.stringify({ items: [], pageInfo: { total: 12 } }), { status: 200 }));
      if (url.includes('/apps/proxy/api/catalog/products')) return Promise.resolve(new Response(JSON.stringify({ items: [], pageInfo: { total: 34 } }), { status: 200 }));
      if (url.includes('/apps/proxy/api/checkout/package')) return Promise.resolve(new Response(JSON.stringify({ ok: true, meta: { totals: { total: 10 } }, hints: [] }), { status: 200 }));
      return Promise.resolve(new Response('', { status: 404 }));
    };
    return <Story />;
  }],
};

export const OkWithHints: Story = {
  render: () => <DashboardKPIs />,
  decorators: [(
    Story,
  ) => {
    (global as any).fetch = (input: RequestInfo) => {
      const url = typeof input === 'string' ? input : (input as Request).url;
      if (url.includes('/apps/proxy/api/builds')) return Promise.resolve(new Response(JSON.stringify({ items: [], pageInfo: { total: 7 } }), { status: 200 }));
      if (url.includes('/apps/proxy/api/catalog/products')) return Promise.resolve(new Response(JSON.stringify({ items: [], pageInfo: { total: 99 } }), { status: 200 }));
      if (url.includes('/apps/proxy/api/checkout/package')) return Promise.resolve(new Response(JSON.stringify({ ok: true, meta: { totals: { total: 12.34 } }, hints: [{ type: 'MISSING_VARIANT' }, { type: 'NO_PRICE' }] }), { status: 200 }));
      return Promise.resolve(new Response('', { status: 404 }));
    };
    return <Story />;
  }],
};

export const Error: Story = {
  render: () => <DashboardKPIs />,
  decorators: [(
    Story,
  ) => {
    (global as any).fetch = (input: RequestInfo) => Promise.resolve(new Response('', { status: 500 }));
    return <Story />;
  }],
};
/* <!-- END RBP GENERATED: tenant-admin-ui-visibility --> */
