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
  const slots = body?.slots || {};
  const price = Number(slots?.blank?.price || 0) + Number(slots?.reelSeat?.price || 0);
  const weight = Number(slots?.blank?.weight || 0) + Number(slots?.reelSeat?.weight || 0);
  return json({ totals: { price, weight } }, { headers: { "cache-control":"no-store","X-RBP-Proxy":"ok","X-RBP-Proxy-Diag": `p=${url.pathname}` } });
}
// <!-- END RBP GENERATED: storefront-builder-m0-v1-0 -->
