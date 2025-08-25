// <!-- BEGIN RBP GENERATED: package-cta-v1 -->
import React, { useEffect, useMemo, useState } from 'react';

type PackagerTotals = { subtotal: number; estTax?: number; total: number; currency?: string };
type PackagerHint = { type: string; message?: string; sku?: string };
type PackagerResult = { ok?: boolean; cartPath?: string | null; meta?: { totals?: PackagerTotals }; hints?: PackagerHint[] } & Record<string, any>;

export default function PackagePanel({ buildId, onCopy, onGoToCart }: { buildId?: string | null; onCopy?: (json: any) => void; onGoToCart?: (path: string) => void }){
  const [pending, setPending] = useState(false);
  const [items, setItems] = useState<number>(0);
  const [data, setData] = useState<PackagerResult | null>(null);
  const [msg, setMsg] = useState<string>('');

  const canClick = !!buildId && items > 0 && !pending;
  const totals = data?.meta?.totals;
  const hints = useMemo(() => Array.isArray(data?.hints) ? data!.hints! : [], [data]);

  async function getBuild(){
    if (!buildId) { setItems(0); return; }
    try {
      const r = await fetch(`/apps/proxy/api/builds/${buildId}`, { cache: 'no-store' });
      if (!r.ok) throw new Error(String(r.status));
      const b = await r.json();
      const c = Array.isArray(b?.items) ? b.items.reduce((n: number, it: any)=>n + Math.max(1, +it.quantity||1), 0) : 0;
      setItems(c);
    } catch { setItems(0); }
  }

  async function dryRun(){
    if (!buildId) { setData(null); return; }
    try {
      const r = await fetch(`/apps/proxy/api/checkout/package?buildId=${encodeURIComponent(buildId)}`, { headers: { 'X-RBP-Dry-Run': '1' }, cache: 'no-store' });
      if (!r.ok) return;
      setData(await r.json());
    } catch {}
  }

  async function onClick(){
    if (!buildId) return;
    setPending(true); setMsg('Packaging…');
    const live = document.getElementById('rbp-aria-live'); if (live) live.textContent = 'Packaging…';
    try {
      const r = await fetch(`/apps/proxy/api/checkout/package?buildId=${encodeURIComponent(buildId)}`, { cache: 'no-store' });
      const json = await r.json();
      setData(json);
      setMsg('Packaged'); if (live) live.textContent = 'Packaged';
    } catch { setMsg('Error packaging'); if (live) live.textContent = 'Error packaging'; }
    setPending(false);
  }

  useEffect(() => { getBuild(); dryRun(); }, [buildId]);
  useEffect(() => {
    const ab = (e: any) => { if (e?.detail?.id) { /* refresh with new buildId handled upstream */ } };
    const bu = () => { getBuild(); dryRun(); };
    const ps = () => { dryRun(); };
    window.addEventListener('rbp:build-updated', bu);
    window.addEventListener('rbp:part-selected', ps);
    return () => { window.removeEventListener('rbp:build-updated', bu); window.removeEventListener('rbp:part-selected', ps); };
  }, [buildId]);

  return (
    <section className="rbp-package-panel">
      <h3 className="text-base font-semibold">Package Build</h3>
      <p className="text-sm opacity-70">Create a cart from your active build.</p>
      <button aria-label="Package Build" disabled={!canClick} onClick={onClick}>Package Build</button>
      <div aria-live="polite" className="text-sm min-h-[1.2em]">{msg}</div>
      {totals && (
        <div className="mt-2">
          <div className="font-semibold">Totals</div>
          <table><tbody>
            {totals.subtotal != null && <tr><td>Subtotal</td><td className="text-right">{totals.subtotal}</td></tr>}
            {totals.estTax != null && <tr><td>Est. Tax</td><td className="text-right">{totals.estTax}</td></tr>}
            {totals.total != null && <tr><td>Total</td><td className="text-right">{totals.total}</td></tr>}
          </tbody></table>
        </div>
      )}
      {hints?.length ? (
        <div className="mt-2" role="status">
          <div className="font-semibold">Hints</div>
          <ul className="list-disc ml-5">
            {hints.map((h, i) => <li key={i}>{h.type}{h.message ? `: ${h.message}`: ''}</li>)}
          </ul>
        </div>
      ) : null}
      <div className="mt-2 flex gap-2">
        <button aria-label="Go to Cart" disabled={!data?.cartPath} onClick={() => { if (data?.cartPath) onGoToCart?.(data.cartPath); }}>Go to Cart</button>
        <button aria-label="Copy JSON" onClick={() => onCopy?.(data)}>Copy JSON</button>
      </div>
    </section>
  );
}
// <!-- END RBP GENERATED: package-cta-v1 -->
