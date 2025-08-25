// <!-- BEGIN RBP GENERATED: catalog-picker-v2 -->
type Filters = { type?: string; slot?: string } & Record<string, any>;

export function handleStartSelectionEvent(filters: Filters, detail: any): Filters {
  const type = detail?.type || filters.type || '';
  const slot = detail?.slotId || filters.slot || '';
  return { ...filters, type, slot, page: 1 };
}

export function makeAddPatch(items: any[], slotId: string | null, part: { id?: string; handle?: string; title?: string; type?: string; variantId?: string | number | null }): { items: any[] } {
  const out = (items||[]).slice();
  const label = part.title || part.handle || String(part.id || '');
  const item = { label, productId: part.id || part.handle, variantId: part.variantId || null, type: part.type || 'Part', slotId: slotId || undefined, quantity: 1 };
  out.push(item);
  return { items: out };
}

export function announceSelected(evt: { buildId: string; slotId: string | null; type?: string; productId: any; variantId?: any }){
  try { window.dispatchEvent(new CustomEvent('rbp:part-selected', { detail: evt })); } catch {}
}
// <!-- END RBP GENERATED: catalog-picker-v2 -->
