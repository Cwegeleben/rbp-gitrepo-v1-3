// <!-- BEGIN RBP GENERATED: mode-a -->
import { PrismaClient } from "@prisma/client";

export const locationDefs = {
  tenantVirtual: { kind: "TENANT", name: "Tenant Virtual", shopifyLocationId: null as string | null },
  rbp: { kind: "RBP", name: "RBP Main", shopifyLocationId: "gid://shopify/Location/2" },
  supplier: { kind: "TENANT", name: "SUPPLIER", shopifyLocationId: null as string | null },
} as const;

export async function seedInventoryFixtures(prismaInput?: any) {
  const prisma: any = prismaInput ?? new PrismaClient();
  // Ensure locations exist with fixed IDs for deterministic tests
  await (prisma as any)["inventoryLocation"].upsert({
    where: { kind_name: { kind: "TENANT", name: locationDefs.tenantVirtual.name } },
    update: { name: locationDefs.tenantVirtual.name, shopifyLocationId: null, tenant: "demo" },
    create: { kind: "TENANT", name: locationDefs.tenantVirtual.name, shopifyLocationId: null, tenant: "demo" },
  });
  await (prisma as any)["inventoryLocation"].upsert({
    where: { kind_name: { kind: "RBP", name: locationDefs.rbp.name } },
    update: { name: locationDefs.rbp.name, shopifyLocationId: locationDefs.rbp.shopifyLocationId },
    create: { kind: "RBP", name: locationDefs.rbp.name, shopifyLocationId: locationDefs.rbp.shopifyLocationId },
  });
  await (prisma as any)["inventoryLocation"].upsert({
    where: { kind_name: { kind: "TENANT", name: locationDefs.supplier.name } },
    update: { name: locationDefs.supplier.name, shopifyLocationId: null },
    create: { kind: "TENANT", name: locationDefs.supplier.name, shopifyLocationId: null },
  });

  // Items
  const reelSeat = await (prisma as any)["inventoryItem"].upsert({ where: { sku: "REELSEAT" }, update: {}, create: { sku: "REELSEAT" } });
  const blank = await (prisma as any)["inventoryItem"].upsert({ where: { sku: "BLANK" }, update: {}, create: { sku: "BLANK" } });

  // Levels: REELSEAT at tenantVirtual; BLANK at RBP
  const tenantVirtualLoc = await (prisma as any)["inventoryLocation"].findUnique({ where: { kind_name: { kind: "TENANT", name: locationDefs.tenantVirtual.name } } });
  const rbpLoc = await (prisma as any)["inventoryLocation"].findUnique({ where: { kind_name: { kind: "RBP", name: locationDefs.rbp.name } } });
  await (prisma as any)["inventoryLevel"].upsert({
    where: { itemId_locationId: { itemId: reelSeat.id, locationId: tenantVirtualLoc.id } },
    update: { available: 10 },
    create: { itemId: reelSeat.id, locationId: tenantVirtualLoc.id, available: 10 },
  });
  await (prisma as any)["inventoryLevel"].upsert({
    where: { itemId_locationId: { itemId: blank.id, locationId: rbpLoc.id } },
    update: { available: 5 },
    create: { itemId: blank.id, locationId: rbpLoc.id, available: 5 },
  });

  return { items: { reelSeat, blank }, locations: { tenantVirtual: tenantVirtualLoc, rbp: rbpLoc } } as const;
}
export async function getResolvedLocations(prismaInput?: any) {
  const prisma: any = prismaInput ?? new PrismaClient();
  const tenantVirtual = await prisma.inventoryLocation.findUnique({ where: { kind_name: { kind: "TENANT", name: locationDefs.tenantVirtual.name } } });
  const rbp = await prisma.inventoryLocation.findUnique({ where: { kind_name: { kind: "RBP", name: locationDefs.rbp.name } } });
  const supplier = await prisma.inventoryLocation.findUnique({ where: { kind_name: { kind: "TENANT", name: locationDefs.supplier.name } } });
  return { tenantVirtual, rbp, supplier } as const;
}
// <!-- END RBP GENERATED: mode-a -->
