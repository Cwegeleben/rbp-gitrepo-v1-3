import type { LoaderFunctionArgs } from "@remix-run/node";
// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { listPendingProducts } = await import("../libs/registry");
  const items = listPendingProducts();
  return Response.json({ items });
};
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
