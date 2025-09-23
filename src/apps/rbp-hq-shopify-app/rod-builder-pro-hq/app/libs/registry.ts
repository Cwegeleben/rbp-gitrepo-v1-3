// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
export type Module = { id: string; key: string; title: string };
export type ProductStub = { id: string; title: string };
export type TenantStub = { id: string; shop: string };
export type PricingBookStub = { id: string; name: string; version: string };

export function listModules(): Module[] {
  return [
    { id: "mod-001", key: "catalog", title: "Catalog" },
    { id: "mod-002", key: "builds", title: "Builds" },
    { id: "mod-003", key: "pricing", title: "Pricing" },
  ];
}

export function listPendingProducts(): ProductStub[] {
  return [
    { id: "p-1001", title: "RBP Pending Product 1" },
    { id: "p-1002", title: "RBP Pending Product 2" },
  ];
}

export function listTenants(): TenantStub[] {
  return [
    { id: "t-rbp-dev", shop: "rbp-dev.myshopify.com" },
  ];
}

export function listPricingBooks(): PricingBookStub[] {
  return [
    { id: "pb-001", name: "Default", version: "v1" },
  ];
}
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
