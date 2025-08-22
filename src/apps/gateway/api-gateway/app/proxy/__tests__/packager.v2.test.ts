/* <!-- BEGIN RBP GENERATED: packager-v2 --> */
import { jest } from '@jest/globals';

// Controlled state for mocks
const state = { prismaThrow: false };

jest.mock('@prisma/client', () => {
  const build = {
    id: 'b1',
    tenant: 'demo.myshopify.com',
    items: [
      { productId: 'p1', label: 'Item 1', quantity: 1 },
      { productId: 'p2', label: 'Item 2', quantity: 2 },
    ],
  };
  return {
    PrismaClient: class {
      build = {
        findUnique: async () => {
          if (state.prismaThrow) throw new Error('boom');
          return build;
        },
      };
      // Access control collections
      userRole = {
        findMany: async ({ where }: any) => {
          if (where?.userId === 'admin@rbp') return [{ role: 'RBP_ADMIN' }];
          return [];
        },
      } as any;
      tenantFeatureAllow = { findMany: async () => [{ featureKey: 'checkout:package', enabled: true }] } as any;
      userFeatureAllow = { findMany: async () => [] } as any;
      sourcingPlan = { findUnique: async () => ({ plan: [{ sku: 'SKU1', qty: 1, locationId: 'RBP1' }, { sku: 'SKU2', qty: 1, locationId: 'RBP1' }] }) } as any;
      inventoryLocation = { findUnique: async () => ({ id: 'RBP1', kind: 'RBP', name: 'RBP' }) } as any;
      reservation = { findMany: async () => [], updateMany: async () => ({}), deleteMany: async () => ({}), create: async (x: any) => x.data } as any;
      packagedSkuMap = { upsert: async () => ({ productId: 'gid://shopify/Product/1', variantId: 'gid://shopify/ProductVariant/10' }) } as any;
    },
  };
});

// Intercept Shopify admin for variant lookup used by planner
jest.mock('../../../../../../packages/shopify/admin', () => ({
  getVariantInventoryItemId: jest.fn(async (arg: any) => {
    if (arg?.sku === 'SKU1') return { ok: true, data: { variantId: 'gid://shopify/ProductVariant/1', inventoryItemId: 'ii:1' } };
    return { ok: false, message: 'not_found' };
  }),
}));

// Package helpers
jest.mock('../../packages/builds/package/index', () => ({
  computeBOM: async () => [{ sku: 'SKU1', qty: 1 }, { sku: 'SKU2', qty: 1 }],
  smartChoiceV1: async (bom: any[]) => ({ plan: bom.map(b => ({ sku: b.sku, qty: b.qty, locationId: 'RBP1' })), locationsUsed: ['RBP1'] }),
  jitRecheckRbpAvailability: async (plan: any[]) => ({ adjustedPlan: plan, rbpOut: [] }),
  upsertSourcingPlan: async (_buildId: string, plan: any) => ({ id: 'sp1', plan }),
  createSoftReservations: async () => [{ sku: 'SKU1', qty: 1, locationId: 'RBP1', expiresAt: new Date().toISOString() }],
  ensurePackagedSku: async () => ({ productId: 'gid://shopify/Product/1', variantId: 'gid://shopify/ProductVariant/10' }),
  buildCartPath: (vid: string, q: number) => `/cart/${vid}:${q}`,
}), { virtual: true });

// Planner with hints: resolve only SKU1
jest.mock('../../apps/gateway/api-gateway/app/proxy/packager/plan.server', () => ({
  resolveVariantIdsWithHints: async (lines: any[]) => ({
    lines: lines.map((l: any) => ({ ...l, variantId: l.sku === 'SKU1' ? 'gid://shopify/ProductVariant/1' : undefined })),
    hints: [{ type: 'MISSING_VARIANT', sku: 'SKU2', message: 'No variantId found for SKU' }],
  }),
  getPlannedLinesForOrder: async (_tenant: string) => [{ sku: 'SKU1', qty: 1, source: 'RBP' }, { sku: 'SKU2', qty: 1, source: 'RBP' }],
}), { virtual: true });

// Totals: no prices -> 0 and NO_PRICE hint
jest.mock('../../apps/gateway/api-gateway/app/proxy/packager/totals.server', () => ({
  calcTotals: (lines: any[]) => ({ totals: { subtotal: 0, estTax: undefined, total: 0, currency: 'USD' }, hints: [{ type: 'NO_PRICE', message: 'Line prices unavailable' }] }),
}), { virtual: true });

describe('Packager v2 route', () => {
  it('returns ok:true with lines and totals when variants present', async () => {
  const Route: any = await import('../../../../../../app/routes/apps.proxy.api.checkout.package');
  const request = new Request('https://x/apps/proxy/api/checkout/package?buildId=b1&userId=admin@rbp');
  const res = await Route.loader({ request } as any);
    const json = await (res as any).json();
    expect((res as any).status).toBe(200);
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.lines)).toBe(true);
    expect(json.meta?.totals).toBeDefined();
  });

  it('emits MISSING_VARIANT hints when some lines lack variantId', async () => {
  const Route: any = await import('../../../../../../app/routes/apps.proxy.api.checkout.package');
  const request = new Request('https://x/apps/proxy/api/checkout/package?buildId=b1&userId=admin@rbp');
  const res = await Route.loader({ request } as any);
    const json = await (res as any).json();
    const mv = (json.hints || []).find((h: any) => h.type === 'MISSING_VARIANT');
    expect((res as any).status).toBe(200);
    expect(mv).toBeDefined();
  });

  it('no prices => subtotal 0 with NO_PRICE hint', async () => {
  const Route: any = await import('../../../../../../app/routes/apps.proxy.api.checkout.package');
  const request = new Request('https://x/apps/proxy/api/checkout/package?buildId=b1&userId=admin@rbp');
  const res = await Route.loader({ request } as any);
    const json = await (res as any).json();
    expect(json.meta?.totals?.subtotal).toBe(0);
    const hp = (json.hints || []).find((h: any) => h.type === 'NO_PRICE');
    expect(hp).toBeDefined();
  });

  it('internal error -> 500 ok:false', async () => {
    // trigger prisma throw in our mock to emulate internal error
    (state as any).prismaThrow = true;
    const Route: any = await import('../../../../../../app/routes/apps.proxy.api.checkout.package');
    const request = new Request('https://x/apps/proxy/api/checkout/package?buildId=b1&userId=admin@rbp');
    const res = await Route.loader({ request } as any);
    (state as any).prismaThrow = false;
    expect((res as any).status).toBe(500);
    const body = await (res as any).json();
    expect(body.ok).toBe(false);
    expect(body.code).toBeDefined();
  });
});
/* <!-- END RBP GENERATED: packager-v2 --> */