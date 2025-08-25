// <!-- BEGIN RBP GENERATED: cart-drawer-v1 -->
export function formatCart(res: any){
  const items = Array.isArray(res?.items) ? res.items.map((it: any) => ({ title: it.title || it.name || it.sku || 'Item', qty: Math.max(1, +it.quantity||1), vendor: it.vendor || it.brand || '' })) : [];
  const totals = res?.meta?.totals || undefined;
  const hints = Array.isArray(res?.hints) ? res.hints : [];
  return { items, totals, hints, cartPath: res?.cartPath || null };
}
// <!-- END RBP GENERATED: cart-drawer-v1 -->
