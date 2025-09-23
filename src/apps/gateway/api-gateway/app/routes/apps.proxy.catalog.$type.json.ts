// <!-- BEGIN RBP GENERATED: storefront-builder-m0-v1-0 -->
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { shouldEnforceProxySignature, verifyShopifyProxySignature } from "../utils/appProxy";
import { getProxyDiag } from "../utils/getProxyDiag";
import { readCatalogJson } from "../proxy/catalog.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const type = String(params.type || '').toLowerCase();

  if (shouldEnforceProxySignature()) {
    if (!verifyShopifyProxySignature(url)) {
      const d = getProxyDiag(url);
      const diagHeader = `p=${d.path};t=${encodeURIComponent(type)};b=${d.bypass?1:0};e=${d.enforce?1:0};sp=${d.signaturePresent?1:0};sv=${d.signatureValid?1:0}`;
      return new Response("unauthorized", { status: 401, headers: { "cache-control":"no-store","content-type":"text/plain; charset=utf-8","X-RBP-Proxy":"fail","X-RBP-Proxy-Diag": diagHeader }});
    }
  }

  const q = (url.searchParams.get('q') || '').toLowerCase();
  const page = Math.max(1, Number(url.searchParams.get('page') || 1));
  const per = Math.max(1, Math.min(50, Number(url.searchParams.get('per') || 24)));

  let products: any[] = [];
  try {
    const data: any = await readCatalogJson();
    products = Array.isArray(data?.products) ? data.products : [];
  } catch {}

  // Heuristic filter by type and query
  const itemsAll = products.filter((p) => {
    const tags = (p?.tags||[]).map((t:any)=>String(t).toLowerCase());
    const handle = String(p?.handle||'').toLowerCase();
    const title = String(p?.title||'').toLowerCase();
    const typeOk = !type || tags.includes(type) || handle.includes(type) || title.includes(type);
    const qOk = !q || handle.includes(q) || title.includes(q);
    return typeOk && qOk;
  }).map((p)=>({ id: String(p.id||''), title: p.title, handle: p.handle, price: Number(p.price||0), vendor: p.vendor, tags: p.tags }));

  const total = itemsAll.length;
  const start = (page-1)*per;
  const slice = itemsAll.slice(start, start+per);

  const d = getProxyDiag(url);
  const diagHeader = `p=${d.path};t=${encodeURIComponent(type)};q=${encodeURIComponent(q)};pg=${page};per=${per}`;
  return json({ items: slice, total, page, per }, { headers: { "cache-control":"no-store","X-RBP-Proxy":"ok","X-RBP-Proxy-Diag": diagHeader }});
}
// <!-- END RBP GENERATED: storefront-builder-m0-v1-0 -->
