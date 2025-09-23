// <!-- BEGIN RBP GENERATED: storefront-builder-m3-v1-0 -->
import { json } from "@remix-run/node";
import { shouldEnforceProxySignature, verifyShopifyProxySignature } from "../utils/appProxy";
import { list } from "../registry/savedBuilds.store.server";
import { getTenantFromRequest } from "../proxy/verify.server";

export async function loader({ request }: { request: Request }){
  const url = new URL(request.url);
  const diagHeader = `p=${url.pathname}`;
  if (shouldEnforceProxySignature()){
    if (!verifyShopifyProxySignature(url)) return new Response("unauthorized", { status: 401, headers: { "cache-control":"no-store","X-RBP-Proxy":"fail","X-RBP-Proxy-Diag": diagHeader }});
  }
  const customerId = String(url.searchParams.get('customerId')||'').slice(0,128);
  const { tenant } = getTenantFromRequest(request);
  const tenantId = String(tenant||'default');
  if (!customerId) return json({ items: [] }, { headers: { "cache-control":"no-store","X-RBP-Proxy":"ok","X-RBP-Proxy-Diag": diagHeader }});
  try {
    const items = list({ tenantId, customerId });
    return json({ items }, { headers: { "cache-control":"no-store","X-RBP-Proxy":"ok","X-RBP-Proxy-Diag": diagHeader }});
  } catch (err: any) {
    return json({ items: [], error: 'store.read_failed' }, { status: 500, headers: { "cache-control":"no-store","X-RBP-Proxy":"fail","X-RBP-Proxy-Diag": `${diagHeader}&e=${encodeURIComponent(String(err?.code||'read'))}` }});
  }
}
// <!-- END RBP GENERATED: storefront-builder-m3-v1-0 -->
