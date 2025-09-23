// <!-- BEGIN RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  // Only 404 the bare /app index; allow nested routes like /app/doctor and /app/catalog to respond.
  if (url.pathname === '/app' || url.pathname === '/app/') {
    const msg = 'Admin UI is embedded in Shopify. Open Apps → RBP.';
    return new Response(msg, { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
  }
  // Let child routes handle the response by returning loader data
  return null;
}

export default function AppLayout() {
  // No UI at /app directly; children like /app/catalog, /app/doctor can render responses.
  return null as any;
}
// <!-- END RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
