// <!-- BEGIN RBP GENERATED: inventory-commit-phase2 -->
import { PrismaClient } from "@prisma/client";
import { getVariantInventoryItemId, adjustAvailableDelta } from "../../../../../../packages/shopify/admin";
import { log } from "../logger.server";

const prisma: any = new PrismaClient();

export type PlannedLine = { sku?: string; variantId?: string; qty: number; source: "RBP" | "SUPPLIER" | "TENANT"; locationId?: string };

export async function commitOrderPaid(args: { tenant: string; orderId: string; lines: PlannedLine[]; correlationId: string }) {
  const { tenant, orderId, lines, correlationId } = args;

  // Idempotency check
  const existing = await prisma.orderCommit.findUnique({ where: { tenantDomain_orderId: { tenantDomain: tenant, orderId } } }).catch(() => null);
  if (existing) {
    log("info", "orders.paid idempotent", { tenant, orderId, correlationId });
    return { ok: true as const, idempotent: true as const };
  }

  // Resolve location mapping for RBP operations
  const rbpLocations = await prisma.inventoryLocation.findMany({ where: { kind: "RBP" } });
  const rbpById = new Map<string, any>(rbpLocations.map((l: any) => [l.id, l]));

  type Applied = { inventoryItemId: string; shopifyLocationId: string; delta: number };
  const applied: Applied[] = [];

  // Decrement per line; rollback on failure
  try {
    for (const line of lines) {
      if (line.source !== "RBP") continue; // only RBP inventory adjusted here
      if (!line.variantId && !line.sku) continue;
      const qty = Math.max(0, Number(line.qty || 0));
      if (qty <= 0) continue;

      // Find a concrete RBP location. Prefer provided locationId
      let loc: any = null;
      if (line.locationId && rbpById.has(line.locationId)) loc = rbpById.get(line.locationId);
      else loc = rbpLocations[0];
      if (!loc?.shopifyLocationId) {
        log("warn", "rbp location missing shopify id", { correlationId, tenant, orderId, line });
        continue;
      }

      // Variant resolution
      const vi = await getVariantInventoryItemId(line.variantId ? { variantId: line.variantId } : { sku: line.sku! });
      if (!vi.ok) throw new Error(`variant_resolution_failed`);
      const { inventoryItemId } = vi.data as any;

      // Adjust negative to decrement
      const adj = await adjustAvailableDelta(inventoryItemId, loc.shopifyLocationId, -qty);
      if (!adj.ok) throw new Error(`adjust_failed`);
      applied.push({ inventoryItemId, shopifyLocationId: loc.shopifyLocationId, delta: -qty });
    }

    // Persist commit record
    await prisma.orderCommit.create({
      data: { tenantDomain: tenant, orderId, status: "COMMITTED", lines, committedAt: new Date(), correlationId },
    });

    log("info", "orders.paid committed", { tenant, orderId, lineCount: lines.length, correlationId });
    return { ok: true as const, idempotent: false as const };
  } catch (e: any) {
    // Rollback any applied decrements in this request
    for (const a of applied.reverse()) {
      try {
        await adjustAvailableDelta(a.inventoryItemId, a.shopifyLocationId, -a.delta); // invert
      } catch {}
    }
    log("error", "orders.paid commit failed", { tenant, orderId, correlationId, reason: e?.message });
    return { ok: false as const, message: e?.message || "commit_failed" };
  }
}
// <!-- END RBP GENERATED: inventory-commit-phase2 -->
