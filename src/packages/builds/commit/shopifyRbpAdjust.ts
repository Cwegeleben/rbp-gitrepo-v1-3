// <!-- BEGIN RBP GENERATED: orders-commit-phase2 -->
// Shopify Admin GraphQL adjust for RBP shop
export async function adjustRbpInventory(args: { variantId: string; locationId: string; delta: number }) {
  try {
    const [{ getVariantInventoryItemId, adjustAvailableDelta }, { PrismaClient }] = await Promise.all([
      import("../../shopify/admin.js"),
      import("@prisma/client")
    ]);
    const prisma: any = new (PrismaClient as any)();
    const loc = await prisma.inventoryLocation.findUnique({ where: { id: args.locationId } });
    if (!loc?.shopifyLocationId) return { ok: false, message: "rbp_location_missing_shopify_id" } as const;
    const vi = await getVariantInventoryItemId({ variantId: args.variantId });
    if (!vi?.ok) return { ok: false, message: "variant_inventory_item_lookup_failed" } as const;
    const res = await adjustAvailableDelta((vi as any).data.inventoryItemId, loc.shopifyLocationId, args.delta);
    if (!res?.ok) return { ok: false, message: "adjust_failed" } as const;
    return { ok: true } as const;
  } catch (e: any) {
    return { ok: false, message: e?.message || "adjust_error" } as const;
  }
}
// <!-- END RBP GENERATED: orders-commit-phase2 -->
