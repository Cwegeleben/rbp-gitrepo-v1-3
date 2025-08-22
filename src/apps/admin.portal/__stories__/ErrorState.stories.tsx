import type { Meta, StoryObj } from '@storybook/react';
import { ErrorState } from '../ErrorState';

const meta: Meta<typeof ErrorState> = {
  title: 'Admin/ErrorState',
  component: ErrorState,
  args: { message: 'Something went wrong' },
};
export default meta;

type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {};
