// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import React from 'react';
import { PricingBookView } from '../components/hq/PricingBookView';

export default function Page() {
  const book = {
    id: 'book-1',
    name: 'Base',
    currency: 'USD',
    rules: [
      { condition: 'component:blank', value: 100 },
      { condition: 'component:seat', value: 30 },
    ],
  };
  return <PricingBookView book={book} />;
}
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
