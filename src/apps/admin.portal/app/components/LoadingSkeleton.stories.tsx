/* <!-- BEGIN RBP GENERATED: tenant-admin-storybook --> */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingSkeleton } from '../../LoadingSkeleton';

const meta: Meta<typeof LoadingSkeleton> = {
  title: 'Admin/Components/LoadingSkeleton',
  component: LoadingSkeleton,
  argTypes: {
    rows: { control: { type: 'number', min: 1, max: 12 } },
  },
};
export default meta;

type Story = StoryObj<typeof LoadingSkeleton>;

export const Table: Story = {
  args: { rows: 6 },
};

export const Panel: Story = {
  args: { rows: 3 },
};
/* <!-- END RBP GENERATED: tenant-admin-storybook --> */
