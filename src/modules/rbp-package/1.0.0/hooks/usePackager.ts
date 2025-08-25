// <!-- BEGIN RBP GENERATED: package-cta-v1 -->
import { useCallback, useState } from 'react';

export type Totals = { subtotal: number; estTax?: number; total: number; currency?: string };
export type Hint = { type: string; message?: string; sku?: string };
export type Result = { ok?: boolean; cartPath?: string | null; meta?: { totals?: Totals }; hints?: Hint[] } & Record<string, any>;

export function usePackager(buildId?: string | null){
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const dryRun = useCallback(async ()=>{
    if (!buildId) { setResult(null); return; }
    try {
      const r = await fetch(`/apps/proxy/api/checkout/package?buildId=${encodeURIComponent(buildId)}`, { headers: { 'X-RBP-Dry-Run': '1' }, cache: 'no-store' });
      if (!r.ok) return; setResult(await r.json());
    } catch {}
  }, [buildId]);

  const run = useCallback(async ()=>{
    if (!buildId) return;
    setPending(true); setError(null);
    try {
      const r = await fetch(`/apps/proxy/api/checkout/package?buildId=${encodeURIComponent(buildId)}`, { cache: 'no-store' });
      setResult(await r.json());
    } catch (e: any) {
      setError(e instanceof Error ? e : new Error('network'));
    } finally {
      setPending(false);
    }
  }, [buildId]);

  return { pending, result, error, dryRun, run };
}
// <!-- END RBP GENERATED: package-cta-v1 -->
