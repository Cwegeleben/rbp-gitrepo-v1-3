// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import React from 'react';
import { ModulesTable } from '../components/hq/ModulesTable';

export default function Page() {
  const items = [
    { id: 'm1', key: 'rbp-builds', name: 'Builds', enabledByDefault: true },
    { id: 'm2', key: 'rbp-catalog', name: 'Catalog', enabledByDefault: true },
    { id: 'm3', key: 'rbp-pricing', name: 'Pricing', enabledByDefault: false },
  ];
  return <ModulesTable items={items} />;
}
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
