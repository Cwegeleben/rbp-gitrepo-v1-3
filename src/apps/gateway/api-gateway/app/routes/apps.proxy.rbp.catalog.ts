// <!-- BEGIN RBP GENERATED: storefront-cart-e2e-v1-1 -->
import { json } from "@remix-run/node";
import { enforce } from "../proxy/verify.server";

type Part = {
  id: string;
  sku: string;
  title: string;
  price: number; // cents
  group: string; // one of the 8 groups
  image?: string;
  variantId?: number;
};

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

const parts: Part[] = [
  { id: "blank-100", sku: "BL-100", title: "RBP Carbon Blank 7'", price: 12999, group: "Blanks", variantId: VARIANT_MAP["BL-100"] },
  { id: "butt-10", sku: "BC-010", title: "Butt Cap Standard", price: 599, group: "Butt Cap", variantId: VARIANT_MAP["BC-010"] },
  { id: "rear-20", sku: "RG-020", title: "Rear Grip EVA 10in", price: 1499, group: "Rear Grip", variantId: VARIANT_MAP["RG-020"] },
  { id: "seat-30", sku: "RS-030", title: "Reel Seat Size 17", price: 1899, group: "Reel Seat", variantId: VARIANT_MAP["RS-030"] },
  { id: "fore-40", sku: "FG-040", title: "Foregrip EVA 4in", price: 999, group: "Foregrip", variantId: VARIANT_MAP["FG-040"] },
  { id: "wind-50", sku: "WC-050", title: "Winding Check 12mm", price: 399, group: "Winding Check", variantId: VARIANT_MAP["WC-050"] },
  { id: "guides-60", sku: "GD-060", title: "Guide Set 9pc", price: 2499, group: "Guides", variantId: VARIANT_MAP["GD-060"] },
  { id: "tip-70", sku: "TT-070", title: "Tip Top 5.5", price: 499, group: "Tip Top", variantId: VARIANT_MAP["TT-070"] },
];

export const loader = async ({ request }: { request: Request }) => {
  const block = await enforce(request);
  if (block) return block;
  return json({ ok: true, parts }, { headers: { "cache-control": "no-store" } });
};
// <!-- END RBP GENERATED: storefront-cart-e2e-v1-1 -->
