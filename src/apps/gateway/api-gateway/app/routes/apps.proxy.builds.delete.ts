// <!-- BEGIN RBP GENERATED: storefront-builder-m3-v1-0 -->
import { json } from "@remix-run/node";
import { shouldEnforceProxySignature, verifyShopifyProxySignature } from "../utils/appProxy";
import { remove } from "../registry/savedBuilds.store.server";
import { getTenantFromRequest } from "../proxy/verify.server";

export async function action({ request }: { request: Request }){
  const url = new URL(request.url);
  const diagHeader = `p=${url.pathname}`;
  if (shouldEnforceProxySignature()){
    if (!verifyShopifyProxySignature(url)) return new Response("unauthorized", { status: 401, headers: { "cache-control":"no-store","X-RBP-Proxy":"fail","X-RBP-Proxy-Diag": diagHeader }});
  }
  let body: any = null; try { body = await request.json(); } catch {}
  const customerId = String(body?.customerId||'').slice(0,128);
  const { tenant } = getTenantFromRequest(request);
  const tenantId = String(tenant||'default');
  try {
    const ok = customerId && body?.id ? remove({ tenantId, customerId }, String(body.id)) : false;
    return json({ ok: !!ok }, { headers: { "cache-control":"no-store","X-RBP-Proxy":"ok","X-RBP-Proxy-Diag": diagHeader }});
  } catch (err: any) {
    return json({ ok:false, error: 'store.write_failed' }, { status: 500, headers: { "cache-control":"no-store","X-RBP-Proxy":"fail","X-RBP-Proxy-Diag": `${diagHeader}&e=${encodeURIComponent(String(err?.code||'write'))}` }});
  }
}
// <!-- END RBP GENERATED: storefront-builder-m3-v1-0 -->
