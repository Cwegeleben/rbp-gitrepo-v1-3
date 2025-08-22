/* <!-- BEGIN RBP GENERATED: packager-v2 --> */
export type Totals = { subtotal: number; estTax?: number; total: number; currency: 'USD' };
export type TotalsHint = { type: 'NO_PRICE'; message: string };

export type PricedLine = { qty: number; price?: number } & Record<string, any>;

export function calcTotals(lines: PricedLine[]): { totals: Totals; hints: TotalsHint[] } {
  const hints: TotalsHint[] = [];
  let subtotal = 0;
  let anyPrice = false;
  for (const ln of lines || []) {
    if (typeof ln.price === 'number' && !Number.isNaN(ln.price)) {
      anyPrice = true;
      const qty = Math.max(0, Number(ln.qty || 0));
      subtotal += ln.price * qty;
    }
  }
  if (!anyPrice) {
    hints.push({ type: 'NO_PRICE', message: 'Line prices unavailable' });
  }
  const estTax = undefined; // placeholder per spec
  const total = subtotal; // simple arithmetic; no tax logic beyond placeholder
  return { totals: { subtotal, estTax, total, currency: 'USD' }, hints };
}
/* <!-- END RBP GENERATED: packager-v2 --> */