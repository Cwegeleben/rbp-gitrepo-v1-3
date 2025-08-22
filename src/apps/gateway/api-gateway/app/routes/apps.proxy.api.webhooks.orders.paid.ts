import { json } from "@remix-run/node";
// <!-- BEGIN RBP GENERATED: orders-commit-phase2 -->
import { enforce, getTenantFromRequest } from "../proxy/verify.server";
import { commitOrderForBuild } from "../../../../../packages/builds/commit";
import { PrismaClient } from "@prisma/client";

const prisma: any = new PrismaClient();

export const action = async ({ request }: { request: Request }) => {
  const block = await enforce(request);
  if (block) return block;
  // Soft verification using existing tenant resolver; HMAC tightened via enforce()
  const { tenant } = getTenantFromRequest(request);
  try {
    const payload = await request.json();
    const orderId = String(payload?.id ?? payload?.order?.id ?? "");
    const lineProps = (payload?.line_items ?? payload?.order?.line_items ?? []).flatMap((li: any) => li?.properties ?? []);
    const buildId = lineProps.find((p: any) => p?.name === "build_id")?.value;
    const sourcingPlanId = lineProps.find((p: any) => p?.name === "sourcing_plan_id")?.value;
    const tenantDomain = tenant;

    if (!orderId || !buildId || !sourcingPlanId) {
      return json({ ok: false, code: "missing_refs", message: "order/build/sourcing refs not found" }, { status: 200 });
    }

    // Idempotency by (tenantDomain, orderId)
    const existing = await prisma.orderCommit.findUnique({ where: { tenantDomain_orderId: { tenantDomain, orderId } } }).catch(() => null);
    if (existing) return json({ ok: true });

    const result = await commitOrderForBuild({ tenantDomain, orderId, buildId, sourcingPlanId });
    if (!result.ok) return json(result, { status: 200 });

    await prisma.orderCommit.create({ data: { tenantDomain, orderId, buildId, sourcingPlanId, status: "COMMITTED" } });
    return json({ ok: true });
  } catch (e: any) {
    return json({ ok: false, code: "internal", message: e?.message ?? "unexpected" }, { status: 500 });
  }
};

export const loader = async ({ request }: { request: Request }) => {
  const block = await enforce(request);
  if (block) return block;
  // <!-- BEGIN RBP GENERATED: no-store-headers -->
  return json({ ok: false, code: "METHOD_NOT_ALLOWED" }, { status: 405, headers: { "cache-control": "no-store" } });
  // <!-- END RBP GENERATED: no-store-headers -->
};
// <!-- END RBP GENERATED: orders-commit-phase2 -->
