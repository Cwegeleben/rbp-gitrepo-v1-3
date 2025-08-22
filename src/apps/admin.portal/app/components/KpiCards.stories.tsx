/* <!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 --> */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { KpiCards } from './KpiCards';

const meta: Meta<typeof KpiCards> = {
  title: 'Admin/Dashboard/KpiCards',
  component: KpiCards,
};
export default meta;

type Story = StoryObj<typeof KpiCards>;

export const Default: Story = {
  render: () => <KpiCards />,
  decorators: [
    (Story) => {
      (global as any).fetch = (input: RequestInfo) => {
        const url = typeof input === 'string' ? input : (input as Request).url;
        if (url.includes('/apps/proxy/api/builds')) return Promise.resolve(new Response(JSON.stringify({ pageInfo: { total: 10 } }), { status: 200 }));
        if (url.includes('/apps/proxy/api/catalog/products')) return Promise.resolve(new Response(JSON.stringify({ pageInfo: { total: 20 } }), { status: 200 }));
        if (url.includes('/apps/proxy/api/checkout/package')) return Promise.resolve(new Response(JSON.stringify({ ok: true, hints: [], meta: { totals: { total: 31 } } }), { status: 200 }));
        return Promise.resolve(new Response('', { status: 404 }));
      };
      return <Story />;
    },
  ],
};

export const Loading: Story = {
  render: () => <KpiCards />,
  decorators: [
    (Story) => {
      (global as any).fetch = () => new Promise((resolve) => setTimeout(() => resolve(new Response(JSON.stringify({ pageInfo: { total: 0 } }), { status: 200 })), 1500));
      return <Story />;
    },
  ],
};

export const Error: Story = {
  render: () => <KpiCards />,
  decorators: [
    (Story) => {
      (global as any).fetch = () => Promise.resolve(new Response('', { status: 500 }));
      return <Story />;
    },
  ],
};

export const Empty: Story = {
  render: () => <KpiCards />,
  decorators: [
    (Story) => {
      (global as any).fetch = (input: RequestInfo) => {
        const url = typeof input === 'string' ? input : (input as Request).url;
        if (url.includes('/apps/proxy/api/builds')) return Promise.resolve(new Response(JSON.stringify({ items: [], pageInfo: { total: 0 } }), { status: 200 }));
        if (url.includes('/apps/proxy/api/catalog/products')) return Promise.resolve(new Response(JSON.stringify({ items: [], pageInfo: { total: 0 } }), { status: 200 }));
        if (url.includes('/apps/proxy/api/checkout/package')) return Promise.resolve(new Response(JSON.stringify({ ok: true, hints: [], meta: { totals: { total: 0 } } }), { status: 200 }));
        return Promise.resolve(new Response('', { status: 404 }));
      };
      return <Story />;
    },
  ],
};
/* <!-- END RBP GENERATED: tenant-admin-dashboard-v1 --> */
