import type { LoaderFunctionArgs } from "@remix-run/node";
// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { listModules } = await import("../libs/registry");
  const modules = listModules();
  return Response.json({ modules });
};
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
