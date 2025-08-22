// <!-- BEGIN RBP GENERATED: AccessV2 -->
import { json } from "@remix-run/node";
import { ctx as baseCtx } from "../../../../rbp-shopify-app/rod-builder-pro/app/proxy/ctx.server";
// Import cfgDir to comply with path policy (no hard-coded paths)
import { cfgDir } from "../lib/paths.server";
import { getTenantFromRequest } from "../proxy/verify.server";
import { getAccessForUser } from "../proxy/access.server";

export const loader = async ({ request }: any) => {
  const base = await baseCtx(request);
  const body = await (base as Response).json();
  const { tenant } = getTenantFromRequest(request);
  const access = await getAccessForUser(tenant, null);
  // <!-- BEGIN RBP GENERATED: access-ctx-v1 -->
  // Augment ctx with required plan and vendors. Static demo values are acceptable.
  // cfgDir is available for future file-based enrichment without hard-coding paths.
  const plan = body?.tenant?.plan ?? "dev";
  const vendors = Array.isArray(body?.tenant?.vendors) ? body.tenant.vendors : ["RBP", "ThirdParty"];
  const out = { ...body, roles: access.roles, features: access.features, tenant: { ...body?.tenant, plan, vendors } };
  return json(out, { headers: { "cache-control": "no-store" } });
  // <!-- END RBP GENERATED: access-ctx-v1 -->
};
// <!-- END RBP GENERATED: AccessV2 -->
