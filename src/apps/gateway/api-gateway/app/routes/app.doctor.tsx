// <!-- BEGIN RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader(_args: LoaderFunctionArgs) {
  const msg = 'Admin UI is embedded in Shopify. Open Apps → RBP.';
  return new Response(msg, { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
}

export default function Doctor() { return null; }
// <!-- END RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
