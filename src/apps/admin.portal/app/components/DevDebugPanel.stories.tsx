/*
<!-- BEGIN RBP GENERATED: dev-debug-panel-v1 -->
*/
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DevDebugPanel } from './DevDebugPanel';
import { TenantContext } from '../../TenantContext';

const meta: Meta<typeof DevDebugPanel> = {
  title: 'Admin/DevDebugPanel',
  component: DevDebugPanel,
};
export default meta;

type Story = StoryObj<typeof DevDebugPanel>;

export const Default: Story = {
  render: () => (
    <TenantContext.Provider value={{ shopDomain: 'test.myshopify.com', plan: 'Pro', flags: { showDevTools: true } }}>
      <DevDebugPanel />
    </TenantContext.Provider>
  ),
};

export const NoShop: Story = {
  render: () => (
    <TenantContext.Provider value={{ shopDomain: '', plan: 'Dev', flags: { showDevTools: true } }}>
      <DevDebugPanel />
    </TenantContext.Provider>
  ),
};

export const ClosedByDefault: Story = {
  render: () => (
    <TenantContext.Provider value={{ shopDomain: 'demo.myshopify.com', plan: 'Dev', flags: { showDevTools: true } }}>
      <DevDebugPanel />
    </TenantContext.Provider>
  ),
};
/*
<!-- END RBP GENERATED: dev-debug-panel-v1 -->
*/
