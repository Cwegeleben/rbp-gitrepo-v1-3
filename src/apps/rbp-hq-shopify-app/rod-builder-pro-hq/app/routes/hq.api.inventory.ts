// <!-- BEGIN RBP GENERATED: rbp-hq-catalog-inventory-v0-4 -->
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getInventoryForProducts } from "../libs/inventory.server";

export async function loader(args: LoaderFunctionArgs) {
  try {
    const { admin } = await authenticate.admin(args.request);
    const url = new URL(args.request.url);
    const productIds = (url.searchParams.get("productIds") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const locationId = url.searchParams.get("locationId") || undefined;
    const byProductId = await getInventoryForProducts(admin, productIds, { locationId });
    return json({ byProductId });
  } catch (err: any) {
    // If any Response was thrown (Shopify auth redirect or fetch Response), return a JSON error with its status
    if (typeof Response !== "undefined" && err instanceof Response) {
      const status = err.status || 401;
      return json({ error: "unauthorized" }, { status });
    }
    const message = (err && (err.message || String(err))) || "Unknown error";
    return json({ error: "inventory_error", message }, { status: 500 });
  }
}
// <!-- END RBP GENERATED: rbp-hq-catalog-inventory-v0-4 -->
