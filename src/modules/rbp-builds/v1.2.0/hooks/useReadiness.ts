// <!-- BEGIN RBP GENERATED: builds-readiness-v1 -->
import { mapHint, groupBySlot, type MappedHint } from '../utils/hintsMap';

export type Totals = { subtotal: number; estTax?: number; total: number; currency?: string };
export type DryRunResponse = { hints?: Array<{ type: string; slotId?: string; slotType?: string; message?: string; sku?: string }>; meta?: { totals?: Totals } };

export type ReadinessState = {
  loading: boolean;
  error: string | null;
  totals: Totals | null;
  issuesCount: number;
  bySlot: Map<string, MappedHint[]>;
};

export type ReadinessController = {
  getState(): ReadinessState;
  schedule(): void;
  abort(): void;
};

export function createReadiness(getBuildId: () => string | null, fetcher: (url: string, init?: RequestInit) => Promise<any>, onLive?: (msg: string)=>void, debounceMs = 300): ReadinessController {
  let debounce: any = null;
  let ctrl: AbortController | null = null;
  let last: DryRunResponse | null = null;
  let lastErr: any = null;

  function state(): ReadinessState {
    const hints = Array.isArray(last?.hints) ? last!.hints.map(mapHint) : [];
    return {
      loading: !!ctrl && !last && !lastErr,
      error: lastErr ? String(lastErr) : null,
      totals: last?.meta?.totals || null,
      issuesCount: hints.length,
      bySlot: groupBySlot(hints),
    };
  }

  async function run(signal: AbortSignal){
    const id = getBuildId();
    if (!id) { last = null; lastErr = null; return; }
    try {
      const res = await fetcher(`/apps/proxy/api/checkout/package?buildId=${encodeURIComponent(id)}`, { headers: { 'X-RBP-Dry-Run': '1' }, signal } as any);
      // Allow either Response-like or plain JSON from fetcher
      // @ts-ignore
      const data = (res && typeof res.json === 'function') ? await res.json() : res;
      last = data; lastErr = null;
    } catch (e) { if ((signal as any)?.aborted) return; lastErr = e; }
  }

  return {
    getState: state,
    schedule(){
      if (debounce) clearTimeout(debounce);
      if (ctrl) ctrl.abort();
      ctrl = new AbortController();
      onLive?.('Checking build…');
      debounce = setTimeout(() => { run((ctrl as AbortController).signal); }, debounceMs);
    },
    abort(){ if (debounce) clearTimeout(debounce); if (ctrl) ctrl.abort(); },
  };
}

export function bindReadinessEvents(ctrl: Pick<ReadinessController, 'schedule'>){
  const onActive = () => ctrl.schedule();
  const onUpdated = () => ctrl.schedule();
  const onSelected = () => ctrl.schedule();
  window.addEventListener('rbp:active-build', onActive as any);
  window.addEventListener('rbp:build-updated', onUpdated as any);
  window.addEventListener('rbp:part-selected', onSelected as any);
  return () => {
    window.removeEventListener('rbp:active-build', onActive as any);
    window.removeEventListener('rbp:build-updated', onUpdated as any);
    window.removeEventListener('rbp:part-selected', onSelected as any);
  };
}
// <!-- END RBP GENERATED: builds-readiness-v1 -->
