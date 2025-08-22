// <!-- BEGIN RBP GENERATED: orders-commit-phase2 -->
import { PrismaClient } from "@prisma/client";
import { adjustRbpInventory } from "./shopifyRbpAdjust.js";

const prisma: any = new PrismaClient();

type CommitArgs = { tenantDomain?: string; orderId: string; buildId: string; sourcingPlanId: string };

export async function commitOrderForBuild(args: CommitArgs): Promise<{ ok: boolean; code?: string; message?: string }> {
  const plan = await prisma.sourcingPlan.findUnique({ where: { buildId: args.buildId } });
  if (!plan) return { ok: false, code: "plan_not_found", message: "No sourcing plan for build" };

  const lines: Array<{ sku: string; qty: number; variantId?: string; locationId: string }> = (plan.plan as any[]) ?? [];

  await prisma.$transaction(async (tx: any) => {
    for (const ln of lines) {
      const loc = await tx.inventoryLocation.findUnique({ where: { id: ln.locationId } });
      if (!loc) continue;

      if (loc.kind === "RBP") {
        if (ln.variantId) {
          await adjustRbpInventory({ variantId: ln.variantId, locationId: ln.locationId, delta: -ln.qty });
        }
        // Mirror in DB (best-effort)
        const item = await tx.inventoryItem.findFirst({ where: { sku: ln.sku } });
        if (item) {
          const current = await tx.inventoryLevel.findUnique({ where: { itemId_locationId: { itemId: item.id, locationId: ln.locationId } } });
          const nextAvail = Math.max(0, (current?.available ?? 0) - ln.qty);
          if (current) {
            await tx.inventoryLevel.update({ where: { id: current.id }, data: { available: nextAvail, updatedAt: new Date() } }).catch(() => undefined);
          }
        }
      } else if (loc.kind === "TENANT") {
        const item = await tx.inventoryItem.findFirst({ where: { sku: ln.sku } });
        if (item) {
          const current = await tx.inventoryLevel.findUnique({ where: { itemId_locationId: { itemId: item.id, locationId: ln.locationId } } });
          const nextAvail = Math.max(0, (current?.available ?? 0) - ln.qty);
          if (current) {
            await tx.inventoryLevel.update({ where: { id: current.id }, data: { available: nextAvail, updatedAt: new Date() } }).catch(() => undefined);
          }
        }
      } else if (String(loc.name).toUpperCase() === "SUPPLIER") {
        // backorder placeholder
      }

      // Flip reservations: SOFT -> HARD for this build/sku/location
      await tx.reservation.updateMany({ where: { buildId: args.buildId, status: "SOFT", locationId: ln.locationId, sku: ln.sku }, data: { status: "HARD" } });
    }

    await tx.sourcingPlan.update({ where: { buildId: args.buildId }, data: { status: "COMMITTED", committedAt: new Date() } });
  });

  return { ok: true };
}
// <!-- END RBP GENERATED: orders-commit-phase2 -->
