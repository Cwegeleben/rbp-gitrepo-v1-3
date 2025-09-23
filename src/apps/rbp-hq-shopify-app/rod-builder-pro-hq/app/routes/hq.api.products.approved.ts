// <!-- BEGIN RBP GENERATED: rbp-hq-catalog-v0-2 -->
import type { LoaderFunctionArgs } from "@remix-run/node";
import { listApprovedProducts } from "../libs/products";

export async function loader(_args: LoaderFunctionArgs) {
  const items = listApprovedProducts();
  return Response.json({ items });
}
// <!-- END RBP GENERATED: rbp-hq-catalog-v0-2 -->
