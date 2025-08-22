/* <!-- BEGIN RBP GENERATED: tenant-admin-storybook --> */
import React, { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BuildDetailPanel } from '../../BuildsPage';
import { TenantContext } from '../../TenantContext';

const meta: Meta<typeof BuildDetailPanel> = {
  title: 'Admin/Components/BuildDetailPanel',
  component: BuildDetailPanel,
};
export default meta;

type Story = StoryObj<typeof BuildDetailPanel>;
const WrapWithReadonly: React.FC<{ readonlyFlag: boolean; children: React.ReactNode }> = ({ readonlyFlag, children }) => {
  const value = useMemo(() => ({ features: { builds: { readonly: readonlyFlag } } }), [readonlyFlag]);
  return <TenantContext.Provider value={value as any}>{children}</TenantContext.Provider>;
};

export const Open: Story = {
  render: () => (
  <WrapWithReadonly readonlyFlag={true}>
      <BuildDetailPanel onClose={() => {}} loading={false} error={null} detail={{ id: 'b1', title: 'Build B1', createdAt: '2025-08-20', items: [{ type: 'part', name: 'Blank', qty: 1 }] }} />
  </WrapWithReadonly>
  )
};

export const Loading: Story = {
  render: () => (
  <WrapWithReadonly readonlyFlag={true}>
      <BuildDetailPanel onClose={() => {}} loading={true} error={null} />
  </WrapWithReadonly>
  )
};

export const NotFound404: Story = {
  render: () => (
  <WrapWithReadonly readonlyFlag={true}>
      <BuildDetailPanel onClose={() => {}} loading={false} error={'Build not found'} />
  </WrapWithReadonly>
  )
};
/* <!-- END RBP GENERATED: tenant-admin-storybook --> */
