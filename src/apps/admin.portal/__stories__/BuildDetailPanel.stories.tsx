import type { Meta, StoryObj } from '@storybook/react-vite';
import { BuildDetailPanel } from '../BuildsPage';
/* <!-- BEGIN RBP GENERATED: tenant-admin-builds-qol --> */
const baseDetail = { id: 'b1', title: 'Build B1', createdAt: '2025-08-20', items: [
  { type: 'part', name: 'Blank', qty: 1 },
  { type: 'wrap', name: 'Carbon', qty: 1 },
] } as any;
/* <!-- END RBP GENERATED: tenant-admin-builds-qol --> */

const meta: Meta<typeof BuildDetailPanel> = {
  title: 'Admin/BuildDetailPanel',
  component: BuildDetailPanel,
  args: { loading: false, error: null, detail: { id: 'b1', title: 'Build B1', createdAt: '2025-08-20', items: [{ type: 'part', name: 'Blank', qty: 1 }] } as any, onClose: () => {} },
};
export default meta;

type Story = StoryObj<typeof BuildDetailPanel>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true, detail: undefined } };
export const NotFound: Story = { args: { error: 'Build not found' } };
/* <!-- BEGIN RBP GENERATED: tenant-admin-builds-qol --> */
export const Readonly: Story = { args: { detail: baseDetail, canWrite: false } } as any;
export const ReorderDemo: Story = {
  args: {
    detail: baseDetail,
    canWrite: true,
    onPatch: async () => baseDetail,
  }
} as any;
export const ClearConfirm: Story = {
  args: {
    detail: baseDetail,
    canWrite: true,
    onPatch: async (_p: any) => ({ ...baseDetail, items: [] }) as any,
  }
} as any;
export const ImportValidationError: Story = {
  args: {
    detail: baseDetail,
    canWrite: true,
  }
} as any;
export const ExportSuccess: Story = {
  args: {
    detail: baseDetail,
    canWrite: true,
  }
} as any;
/* <!-- END RBP GENERATED: tenant-admin-builds-qol --> */
