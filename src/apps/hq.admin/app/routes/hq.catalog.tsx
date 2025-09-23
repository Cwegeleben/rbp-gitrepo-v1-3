// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import React from 'react';
import { CatalogList } from '../components/hq/CatalogList';

export default function Page() {
  const data = {
    components: [
      { id: 'c1', type: 'blank', name: 'Blank' },
      { id: 'c2', type: 'seat', name: 'Seat' },
    ],
    updatedAt: new Date().toISOString(),
  };
  return <CatalogList data={data} />;
}
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
