// <!-- BEGIN RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop') || '';
  const hostB64 = url.searchParams.get('host') || '';
  // <!-- BEGIN RBP GENERATED: admin-embed-fix-v1 -->
  const embedded = url.searchParams.get('embedded') || '';
  const secFetchDest = request.headers.get('sec-fetch-dest') || '';
  const isEmbedded = embedded === '1' || secFetchDest === 'iframe';
  // <!-- END RBP GENERATED: admin-embed-fix-v1 -->

  // If we can infer the store slug, deep-link to the embedded app inside Shopify Admin.
  let store = '';
  if (shop) {
    store = shop.endsWith('.myshopify.com') ? shop.replace('.myshopify.com', '') : shop;
  } else if (hostB64) {
    try {
      const decoded = Buffer.from(hostB64, 'base64').toString('utf8');
      const m = decoded.match(/\/store\/([^/]+)/);
      if (m) store = m[1];
    } catch {}
  }

  if (store) {
    const target = `https://admin.shopify.com/store/${store}/apps/rod-builder-pro-2`;
    // <!-- BEGIN RBP GENERATED: admin-embed-fix-v1 -->
    // Do NOT redirect inside an iframe/embedded context; Shopify Admin cannot be framed (XFO: DENY)
    if (!isEmbedded) {
      return new Response(null, { status: 302, headers: { Location: target, 'cache-control': 'no-store' } });
    }
    // Otherwise, fall through and show the plain message with CSP; add a diagnostic header
    // <!-- END RBP GENERATED: admin-embed-fix-v1 -->
  }

  // Otherwise, show a clear message (no document rendering at root)
  const msg = 'Admin UI is embedded in Shopify. Open Apps → RBP.';
  return new Response(msg, { status: 404, headers: {
    'content-type': 'text/plain; charset=utf-8',
    'cache-control': 'no-store',
    'content-security-policy': "frame-ancestors https://admin.shopify.com https://*.myshopify.com",
    // <!-- BEGIN RBP GENERATED: admin-embed-fix-v1 -->
    'X-RBP-Root-Redirect': store ? 'skipped-embedded' : 'no-store',
    // <!-- END RBP GENERATED: admin-embed-fix-v1 -->
  } });
}
// <!-- END RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
