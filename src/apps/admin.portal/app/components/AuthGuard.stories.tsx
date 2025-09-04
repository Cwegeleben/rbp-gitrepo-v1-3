/* <!-- BEGIN RBP GENERATED: admin-auth-guard-stories-v1 --> */
import React, { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthGuard } from './AuthGuard';
import { TenantContext } from '../../TenantContext';

const meta: Meta<typeof AuthGuard> = {
  title: 'Admin/Auth/AuthGuard',
  component: AuthGuard,
  parameters: {
    docs: {
      description: {
        component:
          'AuthGuard gates child content using TenantContext features.\n' +
          '- Allowed: renders children when feature is present.\n' +
          '- Denied: renders a warning note.\n' +
          '- Loading: renders skeleton with role="status" for a11y.\n' +
          'Keyboard: focus remains on last interactive element; no hidden focus traps.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AuthGuard>;

const WithCtx: React.FC<{ value: any; children: React.ReactNode }> = ({ value, children }) => {
  const memo = useMemo(() => value, [JSON.stringify(value)]);
  return <TenantContext.Provider value={memo}>{children}</TenantContext.Provider>;
};

export const Allowed: Story = {
  render: (args) => (
    <WithCtx value={{ features: { catalog: { v2: true } }, flags: {} }}>
      <AuthGuard featureKey={args.featureKey || 'catalog:v2'}>
        <div data-testid="allowed">Secret content visible</div>
      </AuthGuard>
    </WithCtx>
  ),
  args: { featureKey: 'catalog:v2' },
  parameters: { a11y: { disable: false } },
};

export const Denied: Story = {
  render: (args) => (
    <WithCtx value={{ features: { catalog: { v2: false } }, flags: {} }}>
      <AuthGuard featureKey={args.featureKey || 'catalog:v2'} fallback={<div role="alert">Access required</div>} />
    </WithCtx>
  ),
  args: { featureKey: 'catalog:v2' },
};

export const Loading: Story = {
  render: () => (
    <WithCtx value={null}>
      <AuthGuard loading />
    </WithCtx>
  ),
};
/* <!-- END RBP GENERATED: admin-auth-guard-stories-v1 --> */
