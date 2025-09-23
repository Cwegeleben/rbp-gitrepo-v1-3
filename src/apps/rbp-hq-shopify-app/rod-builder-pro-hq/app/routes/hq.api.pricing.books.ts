import type { LoaderFunctionArgs } from "@remix-run/node";
// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { listPricingBooks } = await import("../libs/registry");
  const books = listPricingBooks();
  return Response.json({ books });
};
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
