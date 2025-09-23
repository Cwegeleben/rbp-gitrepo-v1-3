/* <!-- BEGIN RBP GENERATED: storefront-builder-m2-v1-0 --> */
export type SlotWeights = {
  blank?: { weight?: number } | null;
  reelSeat?: { weight?: number } | null;
  rearGrip?: { weight?: number } | null;
  foregrip?: { weight?: number } | null;
  guides?: Array<{ weight?: number }> | null;
  tipTop?: { weight?: number } | null;
};

export function estimateWeight(slots: SlotWeights): { total: number; confidence: 'low'|'med'|'high'; missing: string[] }{
  const parts: number[] = [];
  const missing: string[] = [];
  function add(name: string, w?: number){ if (typeof w === 'number' && !Number.isNaN(w)) parts.push(Math.max(0, w)); else missing.push(name); }
  add('blank', slots.blank?.weight);
  add('reelSeat', slots.reelSeat?.weight);
  add('rearGrip', slots.rearGrip?.weight);
  add('foregrip', slots.foregrip?.weight);
  for (const g of (slots.guides||[])) add('guides', g?.weight);
  add('tipTop', slots.tipTop?.weight);
  const total = Number(parts.reduce((a,b)=>a+b,0).toFixed(2));
  const filled = 6 - missing.filter(m=>m!=='guides').length; // guides count as a single dimension for confidence
  const confidence: 'low'|'med'|'high' = filled>=5? 'high' : filled>=3? 'med' : 'low';
  return { total, confidence, missing };
}

export function renderWeightSummary(slots: SlotWeights): HTMLElement{
  const r = estimateWeight(slots);
  const el = document.createElement('div');
  el.className = 'rbp-card';
  el.innerHTML = `<div style="font-weight:600">Estimated Weight</div>
    <div style="margin-top:6px">Total: <strong>${r.total.toFixed(2)} oz</strong> <span class="muted">(${r.confidence} confidence)</span></div>
    ${r.missing.length? `<div class="muted" style="margin-top:4px">Missing: ${Array.from(new Set(r.missing)).join(', ')}</div>`: ''}`;
  return el;
}
/* <!-- END RBP GENERATED: storefront-builder-m2-v1-0 --> */
