// API route: /apps/proxy/api/checkout/package

import { PrismaClient } from "@prisma/client";
import { json } from "@remix-run/node";
import { readCatalogJson } from "~/proxy/catalog.server";
import { dbg, dbe } from "../../apps/rbp-shopify-app/rod-builder-pro/app/utils/debug.server";
// <!-- BEGIN RBP GENERATED: AccessV2 -->
import { requireAccess } from "../../apps/gateway/api-gateway/app/proxy/requireAccess.server";
// <!-- END RBP GENERATED: AccessV2 -->
// <!-- BEGIN RBP GENERATED: package-phase1 -->
import { buildCartPath, computeBOM, createSoftReservations, ensurePackagedSku, smartChoiceV1, upsertSourcingPlan } from "../../packages/builds/package/index";
// <!-- BEGIN RBP GENERATED: jit-recheck-phase2 -->
import { jitRecheckRbpAvailability } from "../../packages/builds/package/index";
// <!-- END RBP GENERATED: jit-recheck-phase2 -->
// <!-- END RBP GENERATED: package-phase1 -->
/* <!-- BEGIN RBP GENERATED: packager-v2 --> */
import { getPlannedLinesForOrder, resolveVariantIdsWithHints, type PlannedLine } from "../../apps/gateway/api-gateway/app/proxy/packager/plan.server";
import { calcTotals } from "../../apps/gateway/api-gateway/app/proxy/packager/totals.server";
import { getCorrelationId } from "../../apps/gateway/api-gateway/app/proxy/logger.server";
import { logPackager } from "../../apps/gateway/api-gateway/app/proxy/logger.server";
/* <!-- END RBP GENERATED: packager-v2 --> */

const prisma = new PrismaClient();
const HEADERS = { "content-type": "application/json", "cache-control": "no-store" } as const;

async function getBuildId(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("buildId")?.trim();
  if (q) return q;
  if (req.method !== "GET") {
    try {
      const body = await req.json().catch(() => null);
      const id = body?.buildId?.toString().trim();
      if (id) return id;
    } catch {}
  }
  return null;
}

export async function loader({ request }: { request: Request }) {
  // <!-- BEGIN RBP GENERATED: AccessV2 -->
  const denied = await requireAccess(request, "checkout:package");
  if (denied) return denied;
  // <!-- END RBP GENERATED: AccessV2 -->
  return handlePack(request);
}
export async function action({ request }: { request: Request }) {
  // <!-- BEGIN RBP GENERATED: AccessV2 -->
  const denied = await requireAccess(request, "checkout:package");
  if (denied) return denied;
  // <!-- END RBP GENERATED: AccessV2 -->
  return handlePack(request);
}

export async function handlePack(request: Request) {
  try {
    dbg("packager:start", { url: request.url, method: request.method });
    /* <!-- BEGIN RBP GENERATED: packager-v2 --> */
    const correlationId = getCorrelationId(request);
    /* <!-- END RBP GENERATED: packager-v2 --> */
    const buildId = await getBuildId(request);
    dbg("packager:buildId", buildId);
    if (!buildId) {
      /* <!-- BEGIN RBP GENERATED: packager-v2 --> */
      return json({ ok: false, code: "BAD_REQUEST", message: "buildId required" }, { status: 400, headers: HEADERS });
      /* <!-- END RBP GENERATED: packager-v2 --> */
    }

    const build = await prisma.build.findUnique({
      where: { id: buildId },
      include: { items: true },
    });
    if (!build) {
      dbg("packager:not_found", { buildId });
      /* <!-- BEGIN RBP GENERATED: packager-v2 --> */
      return json({ ok: false, code: "NOT_FOUND", message: "build not found" }, { status: 404, headers: HEADERS });
      /* <!-- END RBP GENERATED: packager-v2 --> */
    }
    dbg("packager:build_loaded", { id: build.id, tenant: build.tenant, items: build.items?.length ?? 0 });

    // Optional variant mapping from catalog
    let catalog: any = null;
    try { catalog = await readCatalogJson(); } catch {}

  const normItems: Array<{ productId: string | null; title: string; quantity: number; variantId?: string; price?: number }> = (build.items ?? []).map((it: any) => {
      const qty = Math.max(1, Math.min(999, Number(it.quantity ?? 1)));
      const title = (it as any).label ?? (it as any).productId ?? "Item";
      const price = typeof (it as any).price === 'number' ? (it as any).price : undefined;
      let variantId: string | undefined;
      if (catalog && it.productId) {
        const p = (catalog.products || catalog || []).find((x: any) => x.id === it.productId || x.handle === it.productId);
        if (p?.variantId) variantId = String(p.variantId);
      }
      return { productId: it.productId ?? null, title: String(title), quantity: qty, ...(variantId ? { variantId } : {}), ...(price != null ? { price } : {}) };
    });
  const withVariants = normItems.filter((i) => "variantId" in i).length;
    dbg("packager:normalized", { total: normItems.length, withVariants });

    // Build cartPath if every item has variantId
  const allHaveVariants = normItems.length > 0 && normItems.every((i) => !!(i as any).variantId);
    const cartPath = allHaveVariants
  ? `/cart/${normItems.map((i) => `${(i as any).variantId}:${i.quantity}`).join(",")}`
      : null;
    const addJsPayload = allHaveVariants
  ? { items: normItems.map((i) => ({ id: (i as any).variantId, quantity: i.quantity })) }
      : null;
    dbg("packager:cart", { cartPath, addJsItems: addJsPayload?.items?.length ?? 0 });

  // <!-- BEGIN RBP GENERATED: package-phase1 -->
  const bom = await computeBOM(buildId);
    const bomHash = Buffer.from(JSON.stringify(bom)).toString("base64");
  const choice = await smartChoiceV1(bom);
  // <!-- BEGIN RBP GENERATED: jit-recheck-phase2 -->
  // JIT live recheck of RBP availability before creating SOFT reservations
  const { adjustedPlan, rbpOut } = await jitRecheckRbpAvailability(
    choice.plan.map((p: any) => ({ ...p, variantId: undefined }))
  );
  const sp = await upsertSourcingPlan(buildId, adjustedPlan, "PLANNED");
  const softReservationsFull = await createSoftReservations(buildId, adjustedPlan);
  // <!-- END RBP GENERATED: jit-recheck-phase2 -->
  const softReservations = softReservationsFull.map((r: any) => ({ sku: r.sku, locationId: r.locationId, qty: r.qty, expiresAt: r.expiresAt }));
    const packagedSku = await ensurePackagedSku(buildId, bomHash);
    const upgradedCartPath = buildCartPath(packagedSku.variantId, 1);
    // <!-- END RBP GENERATED: package-phase1 -->

    const payload = {
      buildId,
      totalItems: normItems.length,
      items: normItems,
      cart: { cartPath, addJsPayload },
      // <!-- BEGIN RBP GENERATED: package-phase1 -->
      cartPath: cartPath ?? upgradedCartPath,
      packagedSku,
  sourcingPlanId: sp?.id ?? null,
      softReservations,
      // <!-- END RBP GENERATED: package-phase1 -->
      /* <!-- BEGIN RBP GENERATED: packager-v2 --> */
      ok: true as const,
      // planning lines + hints
      lines: [] as Array<{ sku?: string; variantId?: string; qty: number; source: "RBP" | "SUPPLIER" | "TENANT"; locationId?: string }> | undefined,
      meta: undefined as any,
      hints: [] as Array<{ type: string; [k: string]: any }>,
      correlationId,
      /* <!-- END RBP GENERATED: packager-v2 --> */
    } as any;

    /* <!-- BEGIN RBP GENERATED: packager-v2 --> */
    // Build planning lines from stored sourcing plan (preferred) or BOM
    let planned: PlannedLine[] = [];
    try {
      planned = await getPlannedLinesForOrder(build.tenant, buildId, sp?.id ?? undefined, correlationId);
    } catch {}
    if (!planned.length) {
      planned = bom.map((b: any) => ({ sku: b.sku, qty: b.qty, source: "RBP" as const }));
    }
    const { lines, hints } = await resolveVariantIdsWithHints(planned);
    payload.lines = lines;

    // Totals from item prices when present
    const totalsRes = calcTotals(normItems.map((i) => ({ qty: i.quantity, price: (i as any).price })) as any);
  payload.meta = { totals: totalsRes.totals };
  payload.hints = [...hints, ...totalsRes.hints];
  logPackager('info', 'packager.v2 packaged', { correlationId, lineCount: payload.lines?.length ?? 0, hintCount: payload.hints?.length ?? 0 });
    /* correlation logging will be handled by gateway logger consumer */
    /* <!-- END RBP GENERATED: packager-v2 --> */

    return json(payload, { headers: HEADERS });
  } catch (e: any) {
    dbe("packager:error", e?.message);
    /* <!-- BEGIN RBP GENERATED: packager-v2 --> */
    return json({ ok: false, code: "INTERNAL", message: e?.message ?? "unexpected" }, { status: 500, headers: HEADERS });
    /* <!-- END RBP GENERATED: packager-v2 --> */
  }
}
