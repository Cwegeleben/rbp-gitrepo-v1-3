/* <!-- BEGIN RBP GENERATED: tenant-admin-storybook --> */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorState } from '../../ErrorState';

const meta: Meta<typeof ErrorState> = {
  title: 'Admin/Components/ErrorState',
  component: ErrorState,
};
export default meta;

type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  args: { message: 'Something went wrong' },
};

export const WithMessage: Story = {
  args: { message: 'Custom error: 404 Not Found' },
};
/* <!-- END RBP GENERATED: tenant-admin-storybook --> */
