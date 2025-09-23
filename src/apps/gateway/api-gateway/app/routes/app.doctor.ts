// <!-- BEGIN RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
import { type LoaderFunctionArgs } from "@remix-run/node";
// <!-- BEGIN RBP GENERATED: admin-embed-fix-v1 -->
import { withEmbedHeaders } from "../utils/embedHeaders";
// <!-- END RBP GENERATED: admin-embed-fix-v1 -->

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
  const res = new Response(html, { status: 200, headers: {
    'content-type': 'text/html; charset=utf-8'
  } });
  return withEmbedHeaders(res);
}
// <!-- END RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
