// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import type { Meta, StoryObj } from '@storybook/react';
import type { StoryContext } from '@storybook/react';
import { within, expect } from '@storybook/test';
import React from 'react';
import { ModulesTable } from './ModulesTable';

const meta: Meta<typeof ModulesTable> = {
  title: 'HQ/ModulesTable',
  component: ModulesTable,
};
export default meta;

export const Basic: StoryObj<typeof ModulesTable> = {
  args: {
    items: [
      { id: 'm1', key: 'alpha', name: 'Alpha', enabledByDefault: true },
      { id: 'm2', key: 'beta', name: 'Beta', enabledByDefault: false },
    ],
  },
  play: async ({ canvasElement }: StoryContext<typeof ModulesTable>) => {
    const canvas = within(canvasElement as HTMLElement);
    const sort = await canvas.findByRole('button', { name: /sort/i });
    sort.click();
    // After sort toggle, first row should be Beta
    const rows = canvas.getAllByRole('row');
    await expect(rows[1].textContent).toMatch(/Beta/);
  },
};
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
