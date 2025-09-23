// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import type {
  ModulesResponse,
  TenantModulesResponse,
  CatalogMasterResponse,
  PricingBookResponse,
  UsageResponse,
  Module,
  Component,
  Rule,
} from '../types/hq';

export const mockModules: ModulesResponse = [
  { id: 'm1', key: 'rbp-builds', name: 'Builds', enabledByDefault: true },
  { id: 'm2', key: 'rbp-catalog', name: 'Catalog', enabledByDefault: true },
  { id: 'm3', key: 'rbp-pricing', name: 'Pricing', enabledByDefault: false },
];

export function mockTenantModules(tenantId: string): TenantModulesResponse {
  const enabled = tenantId === 'demo.myshopify.com'
    ? mockModules
    : mockModules.filter((m) => m.enabledByDefault);
  return { tenantId, modules: enabled };
}

export const mockCatalogMaster: CatalogMasterResponse = {
  components: [
    { id: 'c1', type: 'blank', name: 'Blank' },
    { id: 'c2', type: 'seat', name: 'Seat' },
    { id: 'c3', type: 'handle', name: 'Handle' },
  ],
  updatedAt: new Date().toISOString(),
};

export function mockPricingBook(id: string): PricingBookResponse {
  const rules: Rule[] = [
    { condition: 'component:blank', value: 99 },
    { condition: 'component:seat', value: 29 },
  ];
  return { id, name: `Book ${id}`, currency: 'USD', rules };
}

export function mockUsage(tenantId: string): UsageResponse {
  return {
    tenantId,
    period: '2025-09',
    counters: { 'builds.created': 12, 'orders.paid': 5 },
  };
}
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
