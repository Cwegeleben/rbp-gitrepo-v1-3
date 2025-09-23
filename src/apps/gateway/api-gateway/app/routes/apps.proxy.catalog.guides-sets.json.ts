// <!-- BEGIN RBP GENERATED: storefront-builder-m1-v1-0 -->
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { shouldEnforceProxySignature, verifyShopifyProxySignature } from "../utils/appProxy";
import { getProxyDiag } from "../utils/getProxyDiag";
import { readCatalogJson } from "../proxy/catalog.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (shouldEnforceProxySignature()) {
    if (!verifyShopifyProxySignature(url)) {
      const d = getProxyDiag(url);
      const diagHeader = `p=${d.path};sp=${d.signaturePresent?1:0};sv=${d.signatureValid?1:0}`;
      return new Response("unauthorized", { status: 401, headers: { "cache-control":"no-store","X-RBP-Proxy":"fail","X-RBP-Proxy-Diag": diagHeader } });
    }
  }
  let products: any[] = [];
  try { const data: any = await readCatalogJson(); products = Array.isArray(data?.products) ? data.products : []; } catch {}

  // Heuristic: group by vendor + series token in handle
  const guides = products.filter(p => {
    const tags = (p?.tags||[]).map((t:any)=>String(t).toLowerCase());
    const handle = String(p?.handle||'').toLowerCase();
    const title = String(p?.title||'').toLowerCase();
    return tags.includes('guides') || handle.includes('guides') || title.includes('guides');
  });
  const map = new Map<string, any[]>();
  for (const g of guides){
    const series = (String(g.handle||'').split('-').slice(0,2).join('-')) || 'guides';
    const key = `${g.vendor||'gen'}:${series}`;
    const arr = map.get(key) || [];
    arr.push({ id:String(g.id||''), title:g.title, handle:g.handle, price:Number(g.price||0), vendor:g.vendor });
    map.set(key, arr);
  }
  const sets = Array.from(map.entries()).map(([k,items])=>({ id:k, name:k.split(':')[1], vendor:k.split(':')[0], items, price: items.reduce((s,x)=>s+Number(x.price||0),0) }));

  const d = getProxyDiag(url);
  return json({ sets }, { headers: { "cache-control":"no-store","X-RBP-Proxy":"ok","X-RBP-Proxy-Diag": `p=${d.path}` } });
}
// <!-- END RBP GENERATED: storefront-builder-m1-v1-0 -->
