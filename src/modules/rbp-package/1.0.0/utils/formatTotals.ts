// <!-- BEGIN RBP GENERATED: package-cta-v1 -->
export type Totals = { subtotal: number; estTax?: number; total: number; currency?: string };

export function formatTotals(t?: Totals): Array<[string, string]> {
  if (!t) return [];
  const cur = t.currency || 'USD';
  const fmt = (v?: number) => typeof v === 'number' ? new Intl.NumberFormat(undefined, { style:'currency', currency: cur }).format(v/100) : undefined;
  const rows: Array<[string, string]> = [];
  const s = fmt(t.subtotal); if (s) rows.push(['Subtotal', s]);
  const e = fmt(t.estTax); if (e) rows.push(['Est. Tax', e]);
  const tt = fmt(t.total); if (tt) rows.push(['Total', tt]);
  return rows;
}
// <!-- END RBP GENERATED: package-cta-v1 -->
