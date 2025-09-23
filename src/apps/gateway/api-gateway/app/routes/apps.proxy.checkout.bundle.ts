// <!-- BEGIN RBP GENERATED: storefront-builder-m0-v1-0 -->
import { json } from "@remix-run/node";
import { shouldEnforceProxySignature, verifyShopifyProxySignature } from "../utils/appProxy";
import { getProxyDiag } from "../utils/getProxyDiag";

export async function action({ request }: { request: Request }) {
  const url = new URL(request.url);
  if (shouldEnforceProxySignature()) {
    if (!verifyShopifyProxySignature(url)) {
      const d = getProxyDiag(url);
      return new Response("unauthorized", { status: 401, headers: { "cache-control":"no-store","X-RBP-Proxy":"fail","X-RBP-Proxy-Diag": `p=${d.path}` }});
    }
  }
  let body: any = null; try { body = await request.json(); } catch {}
  // Use packager v2 in future; M0 returns a fake cart URL to complete flow
  const cartUrl = '/cart';
  return json({ ok: true, cartUrl }, { headers: { "cache-control":"no-store","X-RBP-Proxy":"ok","X-RBP-Proxy-Diag": `p=${url.pathname}` } });
}
// <!-- END RBP GENERATED: storefront-builder-m0-v1-0 -->
