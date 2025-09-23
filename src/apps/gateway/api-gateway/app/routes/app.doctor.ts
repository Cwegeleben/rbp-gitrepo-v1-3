// <!-- BEGIN RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
import { type LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop') || '';
  const host = url.searchParams.get('host') || '';
  const embedded = url.searchParams.get('embedded') || '';
  const isEmbedded = embedded === '1';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Doctor</title></head><body>
  <div ${isEmbedded ? 'data-testid="doctor-embed-ok"' : 'data-testid="doctor-embed-missing"'}></div>
  <pre>${JSON.stringify({ shop, host, embedded, pathname: url.pathname }, null, 2)}</pre>
  </body></html>`;
  return new Response(html, { status: 200, headers: {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    'content-security-policy': "frame-ancestors https://admin.shopify.com https://*.myshopify.com"
  } });
}
// <!-- END RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
