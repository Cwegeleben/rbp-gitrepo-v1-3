// <!-- BEGIN RBP GENERATED: storefront-builder-m2-v1-0 -->
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || '';
  const family = url.searchParams.get('family') || '';
  const price = Number(url.searchParams.get('price')||0);

  // Heuristic upsells: same type, same family if present, within +30% price band
  const path = `/apps/proxy/catalog/${encodeURIComponent(type)}.json`;
  const res = await fetch(new URL(path, url.origin).toString(), { headers: { 'x-rbp-internal': '1' } }).catch(()=>null);
  const data = res && res.ok ? await res.json().catch(()=>null) : null;
  const items = Array.isArray(data?.items)? data.items : Array.isArray(data)? data : [];
  const band = price>0? [price*0.9, price*1.3] : [0, Infinity];
  const picks = items.filter((it: any)=>{
    const p = Number(it.price||0);
    const fam = (it.family||it.vendor||'')+'';
    const sameFamily = family? fam.toLowerCase().includes(family.toLowerCase()) : true;
    return p>=band[0] && p<=band[1] && sameFamily;
  }).slice(0,8);
  return new Response(JSON.stringify({ items: picks }), { status: 200, headers: { 'content-type': 'application/json' } });
}
// <!-- END RBP GENERATED: storefront-builder-m2-v1-0 -->
