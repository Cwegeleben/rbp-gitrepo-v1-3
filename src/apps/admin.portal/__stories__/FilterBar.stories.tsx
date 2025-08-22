import type { Meta, StoryObj } from '@storybook/react';
import { FilterBar } from '../CatalogPage';

const meta: Meta<typeof FilterBar> = {
  title: 'Admin/FilterBar',
  component: FilterBar,
  args: { q: '', vendor: [], tags: [] },
  argTypes: {
    onChange: { action: 'change' },
  }
};
export default meta;

type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {};
export const WithValues: Story = { args: { q: 'rod', vendor: ['RBP'], tags: ['carbon'] } };
