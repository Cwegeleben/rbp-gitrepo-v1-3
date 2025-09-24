// <!-- BEGIN RBP GENERATED: rbp-hq-catalog-v0-2 -->
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { listProducts } from "../libs/products";

export async function loader(_args: LoaderFunctionArgs) {
  const items = listProducts();
  return json({ items });
}
// <!-- END RBP GENERATED: rbp-hq-catalog-v0-2 -->
