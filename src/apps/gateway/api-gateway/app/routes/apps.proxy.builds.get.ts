// <!-- BEGIN RBP GENERATED: storefront-builder-m3-v1-0 -->
import { json } from "@remix-run/node";
import { shouldEnforceProxySignature, verifyShopifyProxySignature } from "../utils/appProxy";
import { get } from "../registry/savedBuilds.store.server";
import { getTenantFromRequest } from "../proxy/verify.server";

export async function loader({ request }: { request: Request }){
  const url = new URL(request.url);
  const diagHeader = `p=${url.pathname}`;
  if (shouldEnforceProxySignature()){
    if (!verifyShopifyProxySignature(url)) return new Response("unauthorized", { status: 401, headers: { "cache-control":"no-store","X-RBP-Proxy":"fail","X-RBP-Proxy-Diag": diagHeader }});
  }
  const customerId = String(url.searchParams.get('customerId')||'').slice(0,128);
  const id = String(url.searchParams.get('id')||'');
  const { tenant } = getTenantFromRequest(request);
  const tenantId = String(tenant||'default');
  if (!customerId || !id) return new Response("bad request", { status: 400, headers: { "cache-control":"no-store","X-RBP-Proxy":"fail","X-RBP-Proxy-Diag": diagHeader }});
  try {
    const item = get({ tenantId, customerId }, id);
    if (!item) return new Response("not found", { status: 404, headers: { "cache-control":"no-store","X-RBP-Proxy":"fail","X-RBP-Proxy-Diag": diagHeader }});
    return json(item, { headers: { "cache-control":"no-store","X-RBP-Proxy":"ok","X-RBP-Proxy-Diag": diagHeader }});
  } catch (err: any) {
    return json({ ok:false, error: 'store.read_failed' }, { status: 500, headers: { "cache-control":"no-store","X-RBP-Proxy":"fail","X-RBP-Proxy-Diag": `${diagHeader}&e=${encodeURIComponent(String(err?.code||'read'))}` }});
  }
}
// <!-- END RBP GENERATED: storefront-builder-m3-v1-0 -->
