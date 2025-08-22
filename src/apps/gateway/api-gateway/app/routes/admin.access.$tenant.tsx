// <!-- BEGIN RBP GENERATED: AccessV2 -->
import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
// <!-- BEGIN RBP GENERATED: AccessV2 -->
import { FEATURE_KEYS } from "../proxy/features.registry";
import { getAccessForUser } from "../proxy/access.server";
// <!-- END RBP GENERATED: AccessV2 -->

const prisma = new PrismaClient();

export async function loader({ request, params }: any) {
  const tenant = params.tenant as string;
  // <!-- BEGIN RBP GENERATED: AccessV2 -->
  const userId = request.headers.get("x-rbp-user-id") || new URL(request.url).searchParams.get("userId");
  const access = await getAccessForUser(tenant, userId);
  const isAdmin = access.roles.includes("RBP_ADMIN") || access.roles.includes("TENANT_ADMIN");
  if (!isAdmin) return new Response("forbidden", { status: 403 });
  // <!-- END RBP GENERATED: AccessV2 -->
  const rows = await (prisma as any).tenantFeatureAllow.findMany({ where: { tenantId: tenant } });
  const features: Record<string, boolean> = {};
  for (const k of FEATURE_KEYS) features[k] = false;
  for (const r of rows) features[r.featureKey] = !!r.enabled;
  const html = `<!doctype html><html><head><meta charset='utf-8'><title>Access Admin</title></head><body>
  <div style='padding:16px'>
  <h2>Access Controls for ${tenant}</h2>
  <form method='post'>
    <table style='border-collapse:collapse'>
      <thead><tr><th style='text-align:left;padding:8px'>Feature</th><th style='text-align:left;padding:8px'>Enabled</th></tr></thead>
      <tbody>
        ${FEATURE_KEYS.map((k) => `<tr><td style='padding:8px'>${k}</td><td style='padding:8px'><input type='checkbox' name='${k}' ${features[k] ? "checked" : ""} /></td></tr>`).join("")}
      </tbody>
    </table>
    <div style='margin-top:12px'><button type='submit'>Save</button></div>
  </form>
  </div>
  </body></html>`;
  return new Response(html, { headers: { "content-type": "text/html", "cache-control": "no-store" } });
}

export async function action({ request, params }: any) {
  const tenant = params.tenant as string;
  // <!-- BEGIN RBP GENERATED: AccessV2 -->
  const userId = request.headers.get("x-rbp-user-id") || new URL(request.url).searchParams.get("userId");
  const access = await getAccessForUser(tenant, userId);
  const isAdmin = access.roles.includes("RBP_ADMIN") || access.roles.includes("TENANT_ADMIN");
  if (!isAdmin) {
    // <!-- BEGIN RBP GENERATED: no-store-headers -->
    return json({ ok: false, error: "forbidden" }, { status: 403, headers: { "cache-control": "no-store" } });
    // <!-- END RBP GENERATED: no-store-headers -->
  }
  // <!-- END RBP GENERATED: AccessV2 -->
  const form = await request.formData();
  for (const k of FEATURE_KEYS) {
    const enabled = form.has(k);
    await (prisma as any).tenantFeatureAllow.upsert({
      where: { tenantId_featureKey: { tenantId: tenant, featureKey: k } },
      update: { enabled },
      create: { tenantId: tenant, featureKey: k, enabled },
    });
  }
  // <!-- BEGIN RBP GENERATED: no-store-headers -->
  return json({ ok: true }, { headers: { "cache-control": "no-store" } });
  // <!-- END RBP GENERATED: no-store-headers -->
}

export default null as any;
// <!-- END RBP GENERATED: AccessV2 -->
