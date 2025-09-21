// <!-- BEGIN RBP GENERATED: storefront-cart-e2e-v1-1 -->
import { json } from "@remix-run/node";
import { enforce } from "../proxy/verify.server";

// Deterministic fake variant IDs for dev
const VARIANT_MAP: Record<string, number> = {
  "BL-100": 111000001,
  "BC-010": 111000002,
  "RG-020": 111000003,
  "RS-030": 111000004,
  "FG-040": 111000005,
  "WC-050": 111000006,
  "GD-060": 111000007,
  "TT-070": 111000008,
};

export const loader = async ({ request }: { request: Request }) => {
  const block = await enforce(request);
  if (block) return block;
  return json({ ok: true, map: VARIANT_MAP }, { headers: { "cache-control": "no-store" } });
};
// <!-- END RBP GENERATED: storefront-cart-e2e-v1-1 -->
