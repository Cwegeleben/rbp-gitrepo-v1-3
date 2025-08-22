// <!-- BEGIN RBP GENERATED: package-phase1 -->
import { PrismaClient } from "@prisma/client";
const prisma: any = new PrismaClient();

export async function computeBOM(buildId: string): Promise<Array<{ sku: string; qty: number }>> {
  const build = await prisma.build.findUnique({ where: { id: buildId }, include: { items: true } });
  const items = Array.isArray(build?.items) ? build.items : [];
  const bom = items.map((it: any) => ({ sku: String(it.productId ?? it.label ?? "SKU"), qty: Math.max(1, Number(it.quantity || 1)) }));
  return bom;
}

export async function smartChoiceV1(bom: Array<{ sku: string; qty: number }>): Promise<{ plan: Array<{ sku: string; qty: number; locationId: string }>; locationsUsed: string[] }>{
  // <!-- BEGIN RBP GENERATED: mode-a -->
  // Prefer tenant-virtual (TENANT with null shopifyLocationId) → RBP → SUPPLIER
  // SQLite lacks case-insensitive filter option; fetch one by exact name first
  const supplierLoc = await prisma.inventoryLocation.findFirst({ where: { name: "SUPPLIER" } });
  const results: Array<{ sku: string; qty: number; locationId: string }> = [];
  const used = new Set<string>();

  for (const row of bom) {
    const item = await prisma.inventoryItem.findUnique({ where: { sku: row.sku } });
    if (!item) {
      // Fallback to SUPPLIER when we don't know the item
      const supId = supplierLoc?.id ?? "SUPPLIER";
      results.push({ sku: row.sku, qty: row.qty, locationId: supId });
      used.add(supId);
      continue;
    }

    const levels = await prisma.inventoryLevel.findMany({
      where: { itemId: item.id },
      include: { location: true },
    });

    // Categorize
    const tenantVirtual = levels.find((lvl: any) => lvl.location.kind === "TENANT" && !lvl.location.shopifyLocationId && lvl.available >= row.qty);
    const rbp = levels.find((lvl: any) => lvl.location.kind === "RBP" && lvl.available >= row.qty);
  const supplier = levels.find((lvl: any) => lvl.location.name?.toUpperCase() === "SUPPLIER");

    let chosen: any = tenantVirtual ?? rbp ?? supplier ?? null;
    if (!chosen) {
      // If none meet qty, pick the RBP with max available if any, else supplier fallback
      const rbpAny = levels.filter((l: any) => l.location.kind === "RBP");
      if (rbpAny.length > 0) {
        chosen = rbpAny.sort((a: any, b: any) => b.available - a.available)[0];
      }
    }
    if (!chosen) {
      const supId = supplierLoc?.id ?? "SUPPLIER";
      results.push({ sku: row.sku, qty: row.qty, locationId: supId });
      used.add(supId);
    } else {
      results.push({ sku: row.sku, qty: row.qty, locationId: chosen.locationId ?? chosen.location?.id ?? String(chosen.location) });
      used.add(chosen.locationId ?? chosen.location?.id ?? String(chosen.location));
    }
  }

  return { plan: results, locationsUsed: Array.from(used) };
  // <!-- END RBP GENERATED: mode-a -->
}

export async function createSoftReservations(buildId: string, plan: Array<{ sku: string; qty: number; locationId: string }>, ttlMinutes = 45) {
  const now = Date.now();
  const expires = new Date(now + ttlMinutes * 60 * 1000);
  // Load existing SOFT reservations for this build
  const existing: any[] = await prisma.reservation.findMany({ where: { buildId, status: "SOFT" } });
  const sig = (arr: Array<{ sku: string; qty: number; locationId: string }>) =>
    arr
      .slice()
      .sort((a, b) => (a.sku === b.sku ? a.locationId.localeCompare(b.locationId) : a.sku.localeCompare(b.sku)))
      .map((x) => `${x.sku}@${x.locationId}#${x.qty}`)
      .join("|");
  const same = sig(plan) === sig(existing.map((r: any) => ({ sku: r.sku, qty: r.qty, locationId: r.locationId })));
  if (same) {
    // Extend TTL
    await prisma.reservation.updateMany({ where: { buildId, status: "SOFT" }, data: { expiresAt: expires } });
    return await prisma.reservation.findMany({ where: { buildId, status: "SOFT" } });
  }
  // Replace
  await prisma.reservation.deleteMany({ where: { buildId, status: "SOFT" } });
  const created = await Promise.all(
    plan.map((p) => prisma.reservation.create({ data: { buildId, sku: p.sku, locationId: p.locationId, qty: p.qty, status: "SOFT" as any, expiresAt: expires } }))
  );
  return created;
}

export async function ensurePackagedSku(buildId: string, bomHash: string): Promise<{ productId: string; variantId: string }>{
  // <!-- BEGIN RBP GENERATED: mode-a -->
  // Intent: always ensure the packaged SKU exists in the TENANT store as an untracked variant.
  // Components remain hosted in RBP; decomposition will occur on commit (Phase 2).
  // <!-- END RBP GENERATED: mode-a -->
  const map = await prisma.packagedSkuMap.upsert({
    where: { buildId },
    update: { lastBOMHash: bomHash },
    create: { buildId, productId: "gid://shopify/Product/0", variantId: "gid://shopify/ProductVariant/0", lastBOMHash: bomHash },
  });
  return { productId: map.productId, variantId: map.variantId };
}

export function buildCartPath(packagedVariantId: string, qty = 1): string {
  return `/cart/${packagedVariantId}:${qty}`;
}

export async function upsertSourcingPlan(buildId: string, plan: Array<{ sku: string; qty: number; locationId: string }>, status: "PLANNED" | "CONFIRMED" | "CANCELLED" = "PLANNED") {
  const rec = await prisma.sourcingPlan.upsert({
    where: { buildId },
    update: { plan, status },
    create: { buildId, plan, status },
  });
  return rec;
}
// <!-- BEGIN RBP GENERATED: jit-recheck-phase2 -->
// JIT live recheck (RBP-only): trim qty for RBP lines based on live Shopify availability
export async function jitRecheckRbpAvailability(plan: Array<{ sku: string; variantId?: string; qty: number; locationId: string }>) {
  // Placeholder baseline upgraded: if env is present and we can map to Shopify location, trim qtys to currently available
  try {
  const { getVariantInventoryItemId, getAvailableAtLocation } = await import("../../shopify/admin");
    const prismaLocal: any = prisma;
    const adjusted: typeof plan = [];
    const rbpOut: Array<{ sku: string; qty: number }> = [];
    for (const ln of plan) {
      // Look up location; only apply to RBP kind with shopifyLocationId
      const loc = await prismaLocal.inventoryLocation.findUnique({ where: { id: ln.locationId } });
      if (!loc || loc.kind !== "RBP" || !loc.shopifyLocationId) { adjusted.push(ln); continue; }

      // Resolve inventoryItemId via variantId or SKU
      const variantRef: any = ln.variantId ? { variantId: ln.variantId } : { sku: ln.sku };
      const vi = await getVariantInventoryItemId(variantRef as any);
      if (!vi?.ok) { adjusted.push(ln); continue; }
      const iv = await getAvailableAtLocation((vi as any).data.inventoryItemId, loc.shopifyLocationId);
      if (!iv?.ok) { adjusted.push(ln); continue; }

      const available = Math.max(0, Number((iv as any).data.available ?? 0));
      if (available <= 0) {
        // No stock: push to supplier if present in our plan's ecosystem by swapping location to SUPPLIER fallback
        const supplier = await prismaLocal.inventoryLocation.findFirst({ where: { name: "SUPPLIER" } });
        if (supplier) {
          adjusted.push({ ...ln, locationId: supplier.id });
          rbpOut.push({ sku: ln.sku, qty: ln.qty });
        } else {
          adjusted.push(ln);
        }
      } else if (available < ln.qty) {
        // Partial: trim to available and leave remainder to supplier if found
        adjusted.push({ ...ln, qty: available });
        const remainder = ln.qty - available;
        const supplier = await prismaLocal.inventoryLocation.findFirst({ where: { name: "SUPPLIER" } });
        if (supplier && remainder > 0) {
          adjusted.push({ sku: ln.sku, qty: remainder, locationId: supplier.id });
        }
        rbpOut.push({ sku: ln.sku, qty: remainder });
      } else {
        adjusted.push(ln);
      }
    }
    return { adjustedPlan: adjusted, rbpOut };
  } catch {
    const rbpOut: Array<{ sku: string; qty: number }> = [];
    return { adjustedPlan: plan, rbpOut };
  }
}
// <!-- END RBP GENERATED: jit-recheck-phase2 -->
// <!-- END RBP GENERATED: package-phase1 -->
