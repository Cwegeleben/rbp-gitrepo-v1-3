// <!-- BEGIN RBP GENERATED: builds-readiness-v1 -->
export type RawHint = { type: string; slotId?: string; slotType?: string; message?: string; sku?: string };
export type MappedHint = { code: string; label: string; severity: 'info' | 'warn' | 'error'; slotId?: string; slotType?: string; message?: string; sku?: string };

const HINT_MAP: Record<string, { label: string; severity: 'info'|'warn'|'error' }> = {
  MISSING_VARIANT: { label: 'Needs selection', severity: 'error' },
  NO_PRICE: { label: 'No price', severity: 'warn' },
};

export function mapHint(h: RawHint): MappedHint {
  const m = HINT_MAP[h?.type] || null;
  return {
    code: h?.type || 'UNKNOWN',
    label: m?.label || (h?.type || 'UNKNOWN'),
    severity: (m?.severity || 'info'),
    slotId: h?.slotId,
    slotType: h?.slotType,
    message: h?.message,
    sku: h?.sku,
  };
}

export function groupBySlot(hints: MappedHint[]): Map<string, MappedHint[]> {
  const bySlot = new Map<string, MappedHint[]>();
  for (const h of hints) {
    const key = h.slotId || 'unknown';
    const arr = bySlot.get(key) || [];
    arr.push(h);
    bySlot.set(key, arr);
  }
  return bySlot;
}
// <!-- END RBP GENERATED: builds-readiness-v1 -->
