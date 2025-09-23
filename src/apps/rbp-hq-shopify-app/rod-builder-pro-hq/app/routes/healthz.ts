import type { LoaderFunctionArgs } from "@remix-run/node";
// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
export const loader = async ({ request }: LoaderFunctionArgs) => {
  return Response.json({ ok: true, app: "hq", time: new Date().toISOString() });
};
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
