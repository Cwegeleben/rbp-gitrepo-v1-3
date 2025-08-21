/**
 * Seed Inventory: locations and sample items
 */
// <!-- BEGIN RBP GENERATED: inventory-phase1 -->
import { PrismaClient, InventoryLocationKind } from "@prisma/client";

const prisma = new PrismaClient();

function getEnv(name: string): string | null {
  const v = process.env[name];
  return v && String(v).trim() ? String(v).trim() : null;
}

async function getDemoTenant(): Promise<string> {
  // Reuse verify logic convention: RBP_TENANT_FORCE for local
  const forced = getEnv("RBP_TENANT_FORCE");
  if (forced) return forced.endsWith(".myshopify.com") ? forced : `${forced}.myshopify.com`;
  // Default demo tenant
  return "demo.myshopify.com";
}

async function main() {
  const rbpShopifyLocId = getEnv("RBP_SHOPIFY_LOCATION_ID");
  if (!rbpShopifyLocId) {
    console.warn("RBP_SHOPIFY_LOCATION_ID not set; proceeding but RBP location will have null shopifyLocationId");
  }

  // Upsert RBP main location
  const rbpLoc = await prisma.inventoryLocation.upsert({
    where: { kind_name: { kind: InventoryLocationKind.RBP, name: "RBP Main" } },
    update: { shopifyLocationId: rbpShopifyLocId ?? undefined, active: true },
    create: {
      kind: InventoryLocationKind.RBP,
      name: "RBP Main",
      shopifyLocationId: rbpShopifyLocId ?? null,
      active: true,
    },
  });

  // Upsert TENANT demo location
  const tenant = await getDemoTenant();
  const tenantLoc = await prisma.inventoryLocation.upsert({
    where: { kind_name: { kind: InventoryLocationKind.TENANT, name: tenant } },
    update: { tenant, active: true },
    create: { kind: InventoryLocationKind.TENANT, name: tenant, tenant, active: true },
  });

  // Optional: seed a couple items
  const items = [
    { sku: "RB-SPOOL-8WT", title: "RBP Spool 8WT", shopifyVariantId: null },
    { sku: "RB-BLANK-86M", title: "RBP Blank 8'6\" Medium", shopifyVariantId: null },
  ];
  for (const it of items) {
    await prisma.inventoryItem.upsert({
      where: { sku: it.sku },
      update: { title: it.title, shopifyVariantId: it.shopifyVariantId as any },
      create: it as any,
    });
  }

  console.log("seed:inventory done", {
    rbpLocationId: rbpLoc.id,
    tenantLocationId: tenantLoc.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// <!-- END RBP GENERATED: inventory-phase1 -->
