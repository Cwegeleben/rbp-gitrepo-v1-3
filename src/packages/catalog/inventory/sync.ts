// <!-- BEGIN RBP GENERATED: inventory-sync -->
// Lazy-load Prisma to avoid bundling browser shims
async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient() as any;
}
// <!-- BEGIN RBP GENERATED: mode-a -->
import { getTenantInventoryMode } from "../../access/config/tenant.inventory.mode";
// <!-- END RBP GENERATED: mode-a -->

let prisma: any;

export type Tenant = string; // myshopify domain

// These are placeholders. Real implementations should call Shopify Admin GraphQL.
export async function fetchShopifyLocations(tenant: Tenant): Promise<Array<{ id: string; name: string }>> {
  // TODO: call Admin GraphQL with offline token per tenant
  return [];
}

export async function fetchInventoryLevels(tenant: Tenant, after?: string): Promise<{ levels: Array<{ sku: string; shopifyLocationId: string; available: number }>; next?: string | null }> {
  // TODO: call Admin GraphQL InventoryLevel connections, map to sku/location/available
  return { levels: [], next: null };
}

export async function upsertInventoryLocations(locations: Array<{ id: string; name: string; tenant?: string }>) {
  if (!prisma) prisma = await getPrisma();
  for (const loc of locations) {
  const kind = loc.tenant ? "TENANT" : "RBP";
    await prisma.inventoryLocation.upsert({
      where: { shopifyLocationId: loc.id },
      update: { name: loc.name, tenant: loc.tenant, kind, active: true },
      create: { shopifyLocationId: loc.id, name: loc.name, tenant: loc.tenant ?? null, kind, active: true },
    });
  }
}

export async function upsertInventoryLevels(levels: Array<{ sku: string; shopifyLocationId: string; available: number }>): Promise<number> {
  if (!prisma) prisma = await getPrisma();
  let updated = 0;
  for (const lvl of levels) {
    const item = await prisma.inventoryItem.upsert({
      where: { sku: lvl.sku },
      update: {},
      create: { sku: lvl.sku, title: null, shopifyVariantId: null },
    });
    const loc = await prisma.inventoryLocation.findUnique({ where: { shopifyLocationId: lvl.shopifyLocationId } });
    if (!loc) continue;
    await prisma.inventoryLevel.upsert({
      where: { itemId_locationId: { itemId: item.id, locationId: loc.id } },
      update: { available: lvl.available, updatedAt: new Date() },
      create: { itemId: item.id, locationId: loc.id, available: lvl.available },
    });
    updated++;
  }
  return updated;
}
// <!-- BEGIN RBP GENERATED: mode-a -->
export const syncDeps = {
  fetchShopifyLocations,
  fetchInventoryLevels,
  upsertInventoryLocations,
  upsertInventoryLevels,
};

export async function syncInventory({ tenantDomain, scope }: { tenantDomain?: string; scope?: "rbp" | "tenant" | "both" } = {}) {
  const mode = getTenantInventoryMode(tenantDomain);
  const effectiveScope: "rbp" | "tenant" | "both" = scope ?? (mode === "rbp_hosted" ? "rbp" : "both");

  let locations: Array<{ id: string; name: string }> = [];
  let levelsUpdated = 0;

  if (effectiveScope === "rbp" || effectiveScope === "both") {
    // Under Mode A, only query RBP's Shopify for real inventory
    const rbpShop = process.env.RBP_SHOP_DOMAIN || process.env.SHOP_DOMAIN || "rbp.myshopify.com";
    const rbpLocations = await syncDeps.fetchShopifyLocations(rbpShop);
    await syncDeps.upsertInventoryLocations(rbpLocations.map((l) => ({ id: l.id, name: l.name })));
    locations = [...locations, ...rbpLocations];

    let after: string | undefined;
    do {
      const page = await syncDeps.fetchInventoryLevels(rbpShop as string, after);
      if (page.levels.length > 0) {
        levelsUpdated += await syncDeps.upsertInventoryLevels(page.levels);
      }
      after = page.next ?? undefined;
    } while (after);
  }

  if (effectiveScope === "tenant" || effectiveScope === "both") {
    // For Mode A (rbp_hosted), tenants don't have component inventory in Shopify.
    // We'll add tenant virtual sync when tenant_shadow is enabled.
  }

  return { locations: locations.map((l) => l.name), levelsUpdated };
}
// <!-- END RBP GENERATED: mode-a -->
// <!-- END RBP GENERATED: inventory-sync -->
