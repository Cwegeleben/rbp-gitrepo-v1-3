// <!-- BEGIN RBP GENERATED: AccessV2 -->
import { getTenantFromRequest } from "./verify.server";
import { getAccessForUser } from "./access.server";

export async function requireAccess(request: Request, featureKey: string) {
  const { tenant } = getTenantFromRequest(request);
  // Try to resolve userId from header or query param (MVP)
  const url = new URL(request.url);
  const userId = request.headers.get("x-rbp-user-id") || url.searchParams.get("userId");
  const { roles, features } = await getAccessForUser(tenant, userId);
  const allowed = roles.includes("RBP_ADMIN") || !!features[featureKey];
  if (!allowed) {
    return new Response(JSON.stringify({ error: "forbidden", feature: featureKey }), {
      status: 403,
      headers: { "cache-control": "no-store", "content-type": "application/json" },
    });
  }
  return null as Response | null;
}
// <!-- END RBP GENERATED: AccessV2 -->
