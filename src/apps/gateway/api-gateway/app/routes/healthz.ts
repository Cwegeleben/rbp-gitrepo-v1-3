// <!-- BEGIN RBP GENERATED: healthz-v2 -->
import { json, type LoaderFunctionArgs } from "@remix-run/node";

export async function loader(_args: LoaderFunctionArgs) {
  return json({ ok: true }, { headers: { "cache-control": "no-store" } });
}
// <!-- END RBP GENERATED: healthz-v2 -->
