// <!-- BEGIN RBP GENERATED: catalog-picker-v2 -->
export type PickerQuery = { type?: string; slot?: string; q?: string; page?: number; sort?: string; vendor?: string; tag?: string };

export function parseQuery(search: string | null | undefined): PickerQuery {
  const out: PickerQuery = {};
  const s = typeof search === 'string' ? search : '';
  const sp = new URLSearchParams(s.startsWith('?') ? s.slice(1) : s);
  const num = (v: string | null) => { const n = v ? parseInt(v, 10) : NaN; return Number.isFinite(n) ? n : undefined; };
  out.type = sp.get('type') || undefined;
  out.slot = sp.get('slot') || undefined;
  out.q = sp.get('q') || undefined;
  out.page = num(sp.get('page')) || 1;
  out.sort = sp.get('sort') || undefined;
  out.vendor = sp.get('vendor') || undefined;
  out.tag = sp.get('tag') || undefined;
  return out;
}

export function writeQuery(url: URL, q: PickerQuery){
  const sp = url.searchParams;
  function set(key: string, val?: string | number){ if (val==null || val==='') sp.delete(key); else sp.set(key, String(val)); }
  set('type', q.type);
  set('slot', q.slot);
  set('q', q.q);
  set('page', q.page || 1);
  set('sort', q.sort);
  set('vendor', q.vendor);
  set('tag', q.tag);
}
// <!-- END RBP GENERATED: catalog-picker-v2 -->
