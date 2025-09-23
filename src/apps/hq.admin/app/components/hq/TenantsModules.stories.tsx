// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
import React from 'react';
import { TenantsModules } from './TenantsModules';

const meta: Meta<typeof TenantsModules> = {
  title: 'HQ/TenantsModules',
  component: TenantsModules,
};
export default meta;

export const Basic: StoryObj<typeof TenantsModules> = {
  args: {
    data: {
      tenantId: 'demo.myshopify.com',
      modules: [
        { id: 'm1', key: 'alpha', name: 'Alpha', enabledByDefault: true },
        { id: 'm2', key: 'beta', name: 'Beta', enabledByDefault: false },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement as unknown as HTMLElement);
    const input = await canvas.findByRole('textbox', { name: /filter/i });
    (input as HTMLInputElement).value = 'Be';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const items = await canvas.findAllByRole('listitem');
    await expect(items[0].textContent).toMatch(/Beta/);
  },
};
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
