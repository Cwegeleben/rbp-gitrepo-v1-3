// <!-- BEGIN RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
import type { LoaderFunctionArgs } from '@remix-run/node';
// <!-- BEGIN RBP GENERATED: admin-embed-fix-v1 -->
import { withEmbedHeaders } from "../utils/embedHeaders";
// <!-- END RBP GENERATED: admin-embed-fix-v1 -->

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  // Only 404 the bare /app index; allow nested routes like /app/doctor and /app/catalog to respond.
  if (url.pathname === '/app' || url.pathname === '/app/') {
    const msg = 'Admin UI is embedded in Shopify. Open Apps → RBP.';
    const res = new Response(msg, { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
    return withEmbedHeaders(res);
  }
  // Let child routes handle the response by returning loader data
  return null;
}

// No default export so this acts as a resource route for /app.
// <!-- END RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
