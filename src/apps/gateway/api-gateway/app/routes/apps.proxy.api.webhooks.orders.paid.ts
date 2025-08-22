import { json } from "@remix-run/node";
// <!-- BEGIN RBP GENERATED: inventory-commit-phase2 -->
import { enforce, getTenantFromRequest } from "../proxy/verify.server";
import { getCorrelationId, log } from "../proxy/logger.server";
import { getPlannedLinesForOrder, resolveVariantIds } from "../proxy/packager/plan.server";
import { commitOrderPaid } from "../proxy/commit/orderCommit.server";

export const action = async ({ request }: { request: Request }) => {
  const block = await enforce(request);
  if (block) return block;
  const { tenant } = getTenantFromRequest(request);
  const correlationId = getCorrelationId(request);
  try {
    const payload = await request.json();
    const orderId = String(payload?.id ?? payload?.order?.id ?? "");
    const lineItems: any[] = payload?.line_items ?? payload?.order?.line_items ?? [];
    const props = lineItems.flatMap((li: any) => li?.properties ?? []);
    const buildId = props.find((p: any) => p?.name === "build_id")?.value;
    const sourcingPlanId = props.find((p: any) => p?.name === "sourcing_plan_id")?.value;

    if (!orderId) {
      log("warn", "orders.paid missing order id", { tenant, correlationId });
      return json({ ok: false, code: "missing_order_id" }, { status: 200 });
    }

    let planned = await getPlannedLinesForOrder(tenant, buildId, sourcingPlanId, correlationId);
    if (!planned.length) {
      // fallback map from line items when no stored plan exists
      planned = (lineItems || []).map((li: any) => ({ sku: li?.sku, qty: Number(li?.quantity || 1), source: "RBP" as const }));
    }
    const withVariants = await resolveVariantIds(planned);

    const res = await commitOrderPaid({ tenant, orderId, lines: withVariants, correlationId });
    const status = res.ok ? (res.idempotent ? 202 : 200) : 500;
    log("info", "orders.paid handled", { tenant, orderId, lineCount: withVariants.length, idempotent: !!(res as any).idempotent, correlationId });
    return json(res, { status });
  } catch (e: any) {
    log("error", "orders.paid unhandled", { tenant, correlationId, reason: e?.message });
    return json({ ok: false, message: e?.message || "error" }, { status: 500 });
  }
};

export const loader = async ({ request }: { request: Request }) => {
  const block = await enforce(request);
  if (block) return block;
  return json({ ok: false, code: "METHOD_NOT_ALLOWED" }, { status: 405, headers: { "cache-control": "no-store" } });
};
// <!-- END RBP GENERATED: inventory-commit-phase2 -->
