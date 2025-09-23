// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CatalogList } from './CatalogList';

const meta: Meta<typeof CatalogList> = {
  title: 'HQ/CatalogList',
  component: CatalogList,
};
export default meta;

export const Basic: StoryObj<typeof CatalogList> = {
  args: {
    data: {
      components: [
        { id: 'c1', type: 'blank', name: 'Blank' },
        { id: 'c2', type: 'seat', name: 'Seat' },
      ],
      updatedAt: new Date().toISOString(),
    },
  },
};
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
