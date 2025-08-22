// <!-- BEGIN RBP GENERATED: inventory-commit-phase2 -->
import { PrismaClient } from "@prisma/client";
import { getVariantInventoryItemId } from "../../../../../../packages/shopify/admin";

const prisma: any = new PrismaClient();

export type PlannedLine = { sku?: string; variantId?: string; qty: number; source: "RBP" | "SUPPLIER" | "TENANT"; locationId?: string };

export async function getPlannedLinesForOrder(tenant: string, buildId?: string, sourcingPlanId?: string, correlationId?: string): Promise<PlannedLine[]> {
  // Prefer sourcing plan if present for buildId
  try {
    if (buildId) {
      const rec = await prisma.sourcingPlan.findUnique({ where: { buildId } });
      const rows: any[] = Array.isArray(rec?.plan) ? rec!.plan : [];
      // Ensure structure includes variantId and source; default source based on location kind
      const lines: PlannedLine[] = [];
      for (const r of rows) {
        const loc = r.locationId ? await prisma.inventoryLocation.findUnique({ where: { id: r.locationId } }) : null;
        const source: PlannedLine["source"] = loc?.kind === "RBP" ? "RBP" : loc?.name?.toUpperCase() === "SUPPLIER" ? "SUPPLIER" : "TENANT";
        lines.push({ sku: r.sku, variantId: r.variantId, qty: r.qty, source, locationId: r.locationId });
      }
      return lines;
    }
  } catch {
    // swallow
  }

  return [];
}

export async function resolveVariantIds(lines: PlannedLine[]): Promise<PlannedLine[]> {
  const cache = new Map<string, string>();
  const out: PlannedLine[] = [];
  for (const ln of lines) {
    if (ln.variantId || !ln.sku) { out.push(ln); continue; }
    if (cache.has(ln.sku)) { out.push({ ...ln, variantId: cache.get(ln.sku)! }); continue; }
    const vi = await getVariantInventoryItemId({ sku: ln.sku });
    if (vi.ok) {
      const v = (vi.data as any).variantId;
      cache.set(ln.sku, v);
      out.push({ ...ln, variantId: v });
    } else {
      out.push(ln);
    }
  }
  return out;
}
/* <!-- BEGIN RBP GENERATED: packager-v2 --> */
export type PackagerHint =
  | { type: "MISSING_VARIANT"; sku?: string; message: string; suggest?: string };

// Resolve variantIds with a single cached lookup pass and capture missing-variant hints
export async function resolveVariantIdsWithHints(lines: PlannedLine[]): Promise<{ lines: PlannedLine[]; hints: PackagerHint[] }> {
  const cache = new Map<string, string>();
  const out: PlannedLine[] = [];
  const hints: PackagerHint[] = [];
  for (const ln of lines) {
    if (!ln.sku) { out.push(ln); continue; }
    if (ln.variantId) { out.push(ln); continue; }
    if (cache.has(ln.sku)) {
      out.push({ ...ln, variantId: cache.get(ln.sku)! });
      continue;
    }
    try {
      const vi = await getVariantInventoryItemId({ sku: ln.sku });
      if (vi?.ok) {
        const v = (vi as any).data.variantId as string;
        cache.set(ln.sku, v);
        out.push({ ...ln, variantId: v });
      } else {
        out.push(ln);
        hints.push({ type: "MISSING_VARIANT", sku: ln.sku, message: "No variantId found for SKU", suggest: "Map SKU→variant in catalog" });
      }
    } catch {
      out.push(ln);
      hints.push({ type: "MISSING_VARIANT", sku: ln.sku, message: "No variantId found for SKU", suggest: "Map SKU→variant in catalog" });
    }
  }
  return { lines: out, hints };
}
/* <!-- END RBP GENERATED: packager-v2 --> */
// <!-- END RBP GENERATED: inventory-commit-phase2 -->
