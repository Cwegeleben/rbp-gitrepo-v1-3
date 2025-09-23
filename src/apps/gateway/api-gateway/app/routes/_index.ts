// <!-- BEGIN RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  // For bare root, return a clear 404 message; do not attempt to render a document.
  const msg = 'Admin UI is embedded in Shopify. Open Apps → RBP.';
  return new Response(msg, { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
}
// <!-- END RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
