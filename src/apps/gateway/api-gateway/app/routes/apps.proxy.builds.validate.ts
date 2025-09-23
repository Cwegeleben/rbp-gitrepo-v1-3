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
  let body: any = null;
  try { body = await request.json(); } catch {}
  const slots = body?.slots || {};
  const warnings: Array<{ code: string; message: string }> = [];
  if (!slots.blank) warnings.push({ code: 'MISSING_BLANK', message: 'Select a blank.' });
  if (!slots.reelSeat) warnings.push({ code: 'MISSING_REEL_SEAT', message: 'Select a reel seat.' });
  return json({ warnings }, { headers: { "cache-control":"no-store","X-RBP-Proxy":"ok","X-RBP-Proxy-Diag": `p=${url.pathname}` } });
}
// <!-- END RBP GENERATED: storefront-builder-m0-v1-0 -->
