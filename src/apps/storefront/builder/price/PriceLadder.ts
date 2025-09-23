/* <!-- BEGIN RBP GENERATED: storefront-builder-m2-v1-0 --> */
export type Priced = { id?: string; title?: string; price?: number };

export type PriceTier = { label: 'Budget'|'Mid'|'Premium'; min: number; max: number; items: Priced[] };

export function buildPriceLadder(items: Priced[]): PriceTier[] {
  const arr = (items||[]).filter(Boolean).slice().sort((a,b)=> (a.price||0)-(b.price||0));
  if (!arr.length) return [
    { label:'Budget', min:0, max:0, items:[] },
    { label:'Mid', min:0, max:0, items:[] },
    { label:'Premium', min:0, max:0, items:[] },
  ];
  const n = arr.length; const q1 = arr[Math.floor(n*0.33)]?.price||0; const q2 = arr[Math.floor(n*0.66)]?.price||0; const min = arr[0].price||0; const max = arr[n-1].price||0;
  const tiers: PriceTier[] = [
    { label:'Budget', min, max:q1, items: [] },
    { label:'Mid', min:q1, max:q2, items: [] },
    { label:'Premium', min:q2, max, items: [] },
  ];
  for (const it of arr){ const p = it.price||0; const t = p<=q1? tiers[0] : p<=q2? tiers[1] : tiers[2]; t.items.push(it); }
  return tiers;
}

export function renderPriceLadder(items: Priced[], highlight?: Priced): HTMLElement {
  const tiers = buildPriceLadder(items);
  const wrap = document.createElement('div');
  wrap.className = 'rbp-card';
  const title = document.createElement('div'); title.style.fontWeight='600'; title.textContent = 'Price ladder'; wrap.appendChild(title);
  const list = document.createElement('div'); list.style.display='flex'; list.style.gap='8px'; list.style.marginTop='6px';
  for (const t of tiers){
    const pill = document.createElement('div'); pill.className='rbp-pill'; pill.textContent = `${t.label} (${t.items.length})`;
    if (highlight && t.items.some(x=> (x.id||x.title)===(highlight.id||highlight.title))) pill.style.borderColor = '#0f172a';
    list.appendChild(pill);
  }
  wrap.appendChild(list);
  return wrap;
}
/* <!-- END RBP GENERATED: storefront-builder-m2-v1-0 --> */
