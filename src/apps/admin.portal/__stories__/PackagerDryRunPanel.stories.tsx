/* <!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 --> */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PackagerDryRunPanel } from '../app/components/PackagerDryRunPanel';

const meta: Meta<typeof PackagerDryRunPanel> = {
  title: 'Admin/Dashboard/PackagerDryRunPanel',
  component: PackagerDryRunPanel,
};
export default meta;

type Story = StoryObj<typeof PackagerDryRunPanel>;

export const Empty: Story = {
  decorators: [
    (Story) => {
      (global as any).fetch = (input: RequestInfo) => {
        const url = typeof input === 'string' ? input : (input as Request).url;
        if (url.includes('/apps/proxy/api/checkout/package')) return Promise.resolve(new Response(JSON.stringify({ ok: true, lines: [], meta: { totals: { subtotal: 0, estTax: 0, total: 0 } }, hints: [] }), { status: 200 }));
        return Promise.resolve(new Response('', { status: 404 }));
      };
      return <Story />;
    },
  ],
};

export const Default: Story = {
  args: { sample: 'empty' },
  decorators: [
    (Story) => {
      (global as any).fetch = (input: RequestInfo) => {
        const url = typeof input === 'string' ? input : (input as Request).url;
        if (url.includes('/apps/proxy/api/checkout/package')) return Promise.resolve(new Response(JSON.stringify({ ok: true, lines: [{ sku: 'X', qty: 1 }], meta: { totals: { subtotal: 1, estTax: 0.08, total: 1.08 } }, hints: [] }), { status: 200 }));
        return Promise.resolve(new Response('', { status: 404 }));
      };
      return <Story />;
    },
  ],
};

export const Loading: Story = {
  render: () => <PackagerDryRunPanel />,
  decorators: [
    (Story) => {
      (global as any).fetch = () => new Promise((resolve) => setTimeout(() => resolve(new Response(JSON.stringify({ ok: true, lines: [], meta: { totals: { subtotal: 0, estTax: 0, total: 0 } } }), { status: 200 })), 1500));
      return <Story />;
    },
  ],
};

export const SuccessWithHints: Story = {
  args: { sample: 'demo' },
  decorators: [
    (Story) => {
      (global as any).fetch = (input: RequestInfo, init?: RequestInit) => {
        const url = typeof input === 'string' ? input : (input as Request).url;
        if (url.includes('/apps/proxy/api/checkout/package')) return Promise.resolve(new Response(JSON.stringify({ ok: true, lines: [{ sku: 'DEMO-ROD', qty: 1 }], meta: { totals: { subtotal: 10, estTax: 0.9, total: 10.9, currency: 'USD' } }, hints: [{ type: 'INFO', message: 'Demo pricing applied' }] }), { status: 200 }));
        return Promise.resolve(new Response('', { status: 404 }));
      };
      return <Story />;
    },
  ],
};

export const Error: Story = {
  decorators: [
    (Story) => {
      (global as any).fetch = (input: RequestInfo) => Promise.resolve(new Response('', { status: 500 }));
      return <Story />;
    },
  ],
};
/* <!-- END RBP GENERATED: tenant-admin-dashboard-v1 --> */
