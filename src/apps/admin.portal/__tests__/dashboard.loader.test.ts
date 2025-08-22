/*
<!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
// Mock server helpers used by the loader to avoid importing ESM-only modules (import.meta) in ts-jest
jest.mock('../../rbp-shopify-app/rod-builder-pro/app/proxy/ctx.server', () => ({
  // ctx returns a Response-like object with a json() method
  ctx: async () =>
    new Response(
      JSON.stringify({
        tenant: { domain: 'test.myshopify.com', plan: 'Pro' },
        flags: { features: { devtools: true } },
      }),
      { status: 200 }
    ),
}));

jest.mock('../../gateway/api-gateway/app/proxy/access.server', () => ({
  getAccessForUser: async () => ({ ok: true }),
}));

jest.mock('../../gateway/api-gateway/app/proxy/packager/plan.server', () => ({
  getPlannedLinesForOrder: async () => [{ sku: 'SKU1', qty: 1 }],
  resolveVariantIdsWithHints: async (lines: any[]) => ({ lines, hints: [] }),
}));

jest.mock('../../gateway/api-gateway/app/proxy/packager/totals.server', () => ({
  calcTotals: (lines: any[]) => ({ totals: { subtotal: 10, estTax: 1, total: 11, currency: 'USD' }, hints: [] }),
}));

import { loader } from '../app/routes/app._index';

describe('dashboard route loader', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn((input: RequestInfo) => {
      const url = typeof input === 'string' ? input : (input as Request).url;
      if (url.includes('/apps/proxy/api/access/ctx')) return Promise.resolve(new Response(JSON.stringify({ shopDomain: 'test.myshopify.com', plan: 'Pro', flags: { showDevTools: true } }), { status: 200 }));
      if (url.includes('/apps/proxy/api/builds')) return Promise.resolve(new Response(JSON.stringify({ pageInfo: { total: 5 } }), { status: 200 }));
      if (url.includes('/apps/proxy/api/catalog/products')) return Promise.resolve(new Response(JSON.stringify({ pageInfo: { total: 8 } }), { status: 200 }));
      if (url.includes('/apps/proxy/api/checkout/package')) return Promise.resolve(new Response(JSON.stringify({ ok: true, meta: { totals: { subtotal: 10, estTax: 1, total: 11, currency: 'USD' } }, hints: [] }), { status: 200 }));
      return Promise.resolve(new Response('', { status: 404 }));
    }) as any;
  });

  it('returns stable shape with counts and flags', async () => {
    const data = await loader();
    expect(data.tenant.domain).toBe('test.myshopify.com');
    expect(data.tenant.plan).toBe('Pro');
    expect(typeof data.kpis.buildsCount).toBe('number');
    expect(typeof data.kpis.catalogCount).toBe('number');
    expect(data.flags.showDevTools).toBe(true);
    expect(data.kpis.packager.ok).toBe(true);
    expect(typeof data.kpis.packager.total).toBe('number');
  });
});
/*
<!-- END RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
