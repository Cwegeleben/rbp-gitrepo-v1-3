import type { LoaderFunctionArgs } from "@remix-run/node";
// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { listTenants } = await import("../libs/registry");
  const tenants = listTenants();
  return Response.json({ tenants });
};
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
