/* <!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 --> */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TenantBadge } from './TenantBadge';

const meta: Meta<typeof TenantBadge> = {
  title: 'Admin/Dashboard/TenantBadge',
  component: TenantBadge,
};
export default meta;

type Story = StoryObj<typeof TenantBadge>;

export const Default: Story = { args: { domain: 'shop.example.com', plan: 'Pro', showDevChip: true } };
export const Loading: Story = { args: { isLoading: true } };
export const Error: Story = { args: { error: 'Failed to load tenant' } };
export const Empty: Story = { args: { domain: undefined as any, plan: undefined as any, showDevChip: false } };
/* <!-- END RBP GENERATED: tenant-admin-dashboard-v1 --> */
