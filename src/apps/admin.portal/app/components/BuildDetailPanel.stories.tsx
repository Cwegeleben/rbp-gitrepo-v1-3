/* <!-- BEGIN RBP GENERATED: tenant-admin-storybook --> */
import React, { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
/* <!-- BEGIN RBP GENERATED: tenant-admin-ui-visibility --> */
export const PreviewOk: Story = {
  render: () => (
    <WrapWithReadonly readonlyFlag={true}>
      <BuildDetailPanel onClose={() => {}} loading={false} error={null} detail={{ id: 'b2', title: 'Build B2', createdAt: '2025-08-20', items: [{ type: 'part', name: 'Blank', qty: 1 }], meta: { totals: { subtotal: 10, estTax: 0.8, total: 10.8, currency: 'USD' } } }} />
    </WrapWithReadonly>
  )
};

export const PreviewWithHints: Story = {
  render: () => (
    <WrapWithReadonly readonlyFlag={true}>
      <BuildDetailPanel onClose={() => {}} loading={false} error={null} detail={{ id: 'b3', title: 'Build B3', createdAt: '2025-08-20', items: [{ type: 'part', name: 'Blank', qty: 1 }], hints: [{ type: 'MISSING_VARIANT', sku: 'SKU-1', message: 'Map SKU' }, { type: 'NO_PRICE', sku: 'SKU-2', message: 'Add price' }] }} />
    </WrapWithReadonly>
  )
};

export const PreviewError: Story = {
  render: () => (
    <WrapWithReadonly readonlyFlag={true}>
      <BuildDetailPanel onClose={() => {}} loading={false} error={'Error loading preview'} />
    </WrapWithReadonly>
  )
};
/* <!-- END RBP GENERATED: tenant-admin-ui-visibility --> */
/* <!-- END RBP GENERATED: tenant-admin-storybook --> */
