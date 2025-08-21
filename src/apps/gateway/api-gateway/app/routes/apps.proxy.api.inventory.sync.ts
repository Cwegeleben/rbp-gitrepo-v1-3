import { json } from "@remix-run/node";
// <!-- BEGIN RBP GENERATED: inventory-sync -->
import { fetchInventoryLevels, fetchShopifyLocations, upsertInventoryLevels, upsertInventoryLocations } from "../../../../../packages/catalog/inventory/sync";
// <!-- BEGIN RBP GENERATED: mode-a -->
import { syncInventory } from "../../../../../packages/catalog/inventory/sync";
// <!-- END RBP GENERATED: mode-a -->
import { getTenantFromRequest } from "../proxy/verify.server";

export const action = async ({ request }: { request: Request }) => {
  if (request.method !== "POST") {
    return json({ ok: false, code: "METHOD_NOT_ALLOWED", message: "POST only" }, { status: 405, headers: { "content-type": "application/json", "cache-control": "no-store" } });
  }
  try {
    const { tenant } = getTenantFromRequest(request);
    // <!-- BEGIN RBP GENERATED: mode-a -->
    const url = new URL(request.url);
    const scopeParam = url.searchParams.get("scope") as "rbp" | "tenant" | "both" | null;
  const { levelsUpdated, locations } = await syncInventory({ tenantDomain: tenant, scope: scopeParam ?? undefined });
    return json({ ok: true, levelsUpdated, locations: locations.length }, { headers: { "content-type": "application/json", "cache-control": "no-store" } });
    // <!-- END RBP GENERATED: mode-a -->
  } catch (e: any) {
    return json({ ok: false, code: "INTERNAL", message: e?.message ?? "unexpected" }, { status: 500, headers: { "content-type": "application/json", "cache-control": "no-store" } });
  }
};

export const loader = async () => json({ ok: false, code: "METHOD_NOT_ALLOWED" }, { status: 405 });
// <!-- END RBP GENERATED: inventory-sync -->
