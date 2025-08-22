/*
<!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
import React from 'react';
import { render } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { TenantContext } from '../TenantContext';

describe('Dashboard snapshot', () => {
  beforeEach(() => {
    (global as any).fetch = (input: RequestInfo) => {
      const url = typeof input === 'string' ? input : (input as Request).url;
      if (url.includes('/apps/proxy/api/builds')) return Promise.resolve(new Response(JSON.stringify({ pageInfo: { total: 2 } }), { status: 200 }));
      if (url.includes('/apps/proxy/api/catalog/products')) return Promise.resolve(new Response(JSON.stringify({ pageInfo: { total: 3 } }), { status: 200 }));
      if (url.includes('/apps/proxy/api/checkout/package')) return Promise.resolve(new Response(JSON.stringify({ ok: true, meta: { totals: { subtotal: 1, estTax: 0.08, total: 1.08, currency: 'USD' } }, hints: [] }), { status: 200 }));
      return Promise.resolve(new Response('', { status: 404 }));
    };
  });

  it('renders stable UI', () => {
    const ctx = { shopDomain: 'snap.myshopify.com', plan: 'Pro', flags: { showDevTools: true } };
    const { container } = render(
      <TenantContext.Provider value={ctx}>
        <Dashboard />
      </TenantContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });
});
/*
<!-- END RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
