import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSkeleton } from '../LoadingSkeleton';

const meta: Meta<typeof LoadingSkeleton> = {
  title: 'Admin/LoadingSkeleton',
  component: LoadingSkeleton,
  args: { rows: 6 },
};
export default meta;

type Story = StoryObj<typeof LoadingSkeleton>;

export const Default: Story = {};
