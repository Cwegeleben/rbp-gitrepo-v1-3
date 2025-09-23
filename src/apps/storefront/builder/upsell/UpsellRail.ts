/* <!-- BEGIN RBP GENERATED: storefront-builder-m2-v1-0 --> */
export type UpsellItem = { id: string; title?: string; price?: number; family?: string; model?: string; material?: string; available?: boolean };

export function recommendUpsells(candidates: UpsellItem[], current?: UpsellItem): UpsellItem[] {
  const curPrice = Number(current?.price || 0);
  const fam = (current?.family || current?.model || '').toString().toLowerCase();
  const mat = (current?.material || '').toString().toLowerCase();
  const inBand = (x:UpsellItem)=>{
    const p = Number(x.price || 0);
    const priceOk = !curPrice || (p >= curPrice*0.85 && p <= curPrice*1.15);
    const famOk = !fam || ((x.family||x.model||'').toString().toLowerCase().includes(fam));
    const matOk = !mat || (String(x.material||'').toLowerCase()===mat);
    const avail = (x as any).available !== false;
    return priceOk && (famOk || matOk) && avail;
  };
  let res = candidates.filter(inBand);
  if (!res.length) {
    const byDelta = candidates.slice().sort((a,b)=> Math.abs(Number(a.price||0)-curPrice) - Math.abs(Number(b.price||0)-curPrice));
    res = byDelta.slice(0, 8);
  }
  return res.slice(0, 8);
}

export function mountUpsellRail(host: HTMLElement, items: UpsellItem[], onPick: (it:UpsellItem)=>void){
  const rail = document.createElement('div');
  rail.className = 'rbp-rail rbp-upsell';
  const title = document.createElement('div'); title.className = 'rbp-rail-title'; title.textContent = 'You might also like';
  rail.appendChild(title);
  const list = document.createElement('div'); list.className = 'rbp-rail-pills'; rail.appendChild(list);
  items.forEach(it=>{
    const btn = document.createElement('button');
    btn.className = 'rbp-pill';
    btn.textContent = `${it.title || 'Item'} — $${Number(it.price||0).toFixed(2)}`;
    btn.addEventListener('click', ()=> onPick(it));
    list.appendChild(btn);
  });
  host.appendChild(rail);
}
/* <!-- END RBP GENERATED: storefront-builder-m2-v1-0 --> */
