// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import React from 'react';
import { TenantsModules } from '../components/hq/TenantsModules';

export default function Page() {
  const data = {
    tenantId: 'demo.myshopify.com',
    modules: [
      { id: 'm1', key: 'rbp-builds', name: 'Builds', enabledByDefault: true },
      { id: 'm2', key: 'rbp-catalog', name: 'Catalog', enabledByDefault: true },
      { id: 'm3', key: 'rbp-pricing', name: 'Pricing', enabledByDefault: false },
    ],
  };
  return <TenantsModules data={data} />;
}
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
