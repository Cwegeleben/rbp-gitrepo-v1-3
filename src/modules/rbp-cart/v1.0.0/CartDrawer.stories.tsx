// <!-- BEGIN RBP GENERATED: cart-drawer-v1 -->
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import CartDrawer from './components/CartDrawer';

const meta: Meta<typeof CartDrawer> = {
  title: 'rbp-cart/CartDrawer v1',
  component: CartDrawer,
};
export default meta;
type Story = StoryObj<typeof CartDrawer>;

const base = { items: [{ title: 'P1', qty: 1, vendor: 'RBP' }, { title: 'P2', qty: 2 }], totals: { subtotal: 3000, total: 3000, currency: 'USD' }, hints: [], cartPath: '/cart/1:1' };

export const Default: Story = {
  args: { open: true, status: 'ready', data: base as any, raw: base, error: null, onClose: ()=>{}, onCopy: ()=>{}, onGoToCart: ()=>{}, onRetry: ()=>{} }
};

export const FromEventSuccess: Story = {
  render: (args: any) => <CartDrawer {...args} open status="ready" data={base as any} />,
};

export const SuccessNoCartWithHints: Story = {
  render: (args: any) => <CartDrawer {...args} open status="ready" data={{ ...base, cartPath: null, hints: [{ type: 'MISSING_VARIANT' }] } as any} />,
};

export const NetworkError: Story = {
  render: (args: any) => <CartDrawer {...args} open status="error" error="Network error" data={{ ...base } as any} />,
};

export const KeyboardOnly: Story = {
  render: (args: any) => <CartDrawer {...args} open status="ready" data={base as any} />,
};
// <!-- END RBP GENERATED: cart-drawer-v1 -->
