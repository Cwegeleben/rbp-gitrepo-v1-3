/*
<!-- BEGIN RBP GENERATED: dev-debug-panel-v1 -->
*/
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import DevSection from '../components/DevSection';

const meta: Meta<typeof DevSection> = {
  title: 'Storefront/DevSection',
  component: DevSection,
};
export default meta;

type Story = StoryObj<typeof DevSection>;

export const Success: Story = {
  render: () => <DevSection ctx={{ tenant: { domain: 'demo.myshopify.com' }, plan: 'Dev', flags: { showDevTools: true } }} />,
};

export const HmacError: Story = {
  render: () => <DevSection ctx={{ tenant: { domain: '' }, plan: 'Dev', flags: { showDevTools: true } }} error={{ code: 'HMAC' }} />,
};
export const NoShop: Story = {
  render: () => <DevSection ctx={{ tenant: { domain: '' }, plan: 'Dev', flags: { showDevTools: true } }} />,
};
/*
<!-- END RBP GENERATED: dev-debug-panel-v1 -->
*/
