/* <!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 --> */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorBanner } from './ErrorBanner';

const meta: Meta<typeof ErrorBanner> = {
  title: 'Admin/Dashboard/ErrorBanner',
  component: ErrorBanner,
};
export default meta;

type Story = StoryObj<typeof ErrorBanner>;

export const Default: Story = { args: { message: 'Something went wrong' } };
/* <!-- END RBP GENERATED: tenant-admin-dashboard-v1 --> */
