// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PricingBookView } from './PricingBookView';

const meta: Meta<typeof PricingBookView> = {
  title: 'HQ/PricingBookView',
  component: PricingBookView,
};
export default meta;

export const Basic: StoryObj<typeof PricingBookView> = {
  args: {
    book: {
      id: 'book-1',
      name: 'Base',
      currency: 'USD',
      rules: [
        { condition: 'component:blank', value: 100 },
        { condition: 'component:seat', value: 30 },
      ],
    },
  },
};
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
