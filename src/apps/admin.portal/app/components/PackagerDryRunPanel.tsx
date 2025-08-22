/*
<!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPackagerApi, type PackagerDryRunResult } from '../lib/createPackagerApi';

export type PackagerDryRunPanelProps = {
  title?: string;
  sample?: 'empty' | 'demo';
  ariaLive?: 'polite' | 'assertive' | 'off';
};

export const PackagerDryRunPanel: React.FC<PackagerDryRunPanelProps> = ({ title = 'Dry-run packager', sample = 'empty', ariaLive = 'polite' }) => {
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'success' | 'empty'>('idle');
  const [result, setResult] = useState<PackagerDryRunResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const alertRef = useRef<HTMLDivElement | null>(null);

  const body = useMemo(() => {
    if (sample === 'demo') {
      return { items: [{ sku: 'DEMO-ROD', qty: 1 }] };
    }
    return undefined;
  }, [sample]);

  useEffect(() => {
    let alive = true;
    setState('loading');
    (async () => {
      try {
        const api = createPackagerApi();
        const res = await api.packageDryRun(body ? { body } : undefined);
        if (!alive) return;
        setResult(res);
        if (!res.ok) {
          setState('error');
          setError(res.code || 'Unknown error');
        } else if (!res.lines || res.lines.length === 0) {
          setState('empty');
        } else {
          setState('success');
        }
      } catch (e: any) {
        if (!alive) return;
        setState('error');
        setError(e?.message || 'Failed to run packager');
      }
    })();
    return () => { alive = false; };
  }, [body]);

  useEffect(() => {
    if ((state === 'error' || state === 'success') && alertRef.current) {
      alertRef.current.focus();
    }
  }, [state]);

  const totals = result?.meta?.totals;
  const hints = result?.hints || [];

  return (
    <section aria-labelledby="packager-dry-run-title" style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
      <h3 id="packager-dry-run-title" style={{ margin: 0, marginBottom: 8 }}>{title}</h3>
      {state === 'loading' && (
        <div role="status" aria-live={ariaLive} style={{ color: '#6b7280' }}>Running…</div>
      )}
      {state === 'error' && (
        <div role="alert" tabIndex={-1} ref={alertRef} style={{ color: '#b00020' }}>
          Error: {error}
        </div>
      )}
      {state === 'empty' && (
        <div role="note" aria-live={ariaLive} style={{ color: '#334155' }}>No lines produced. Try the demo sample.</div>
      )}
      {state === 'success' && (
        <div tabIndex={-1} ref={alertRef} aria-live={ariaLive}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
            <div style={{ fontSize: 13, color: '#334155' }}>Subtotal: <strong>{totals?.subtotal?.toFixed?.(2) ?? '—'}</strong></div>
            <div style={{ fontSize: 13, color: '#334155' }}>Est. Tax: <strong>{totals?.estTax?.toFixed?.(2) ?? '—'}</strong></div>
            <div style={{ fontSize: 13, color: '#334155' }}>Total: <strong>{totals?.total?.toFixed?.(2) ?? '—'}</strong></div>
            {typeof totals?.currency === 'string' && <div style={{ fontSize: 12, color: '#64748b' }}>Currency: {totals.currency}</div>}
          </div>
          {hints.length > 0 && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: 8, borderRadius: 6 }}>
              <div style={{ fontWeight: 600, color: '#92400e', marginBottom: 4 }}>Hints</div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {hints.map((h, i) => (
                  <li key={i} style={{ color: '#92400e', fontSize: 13 }}>
                    {h.message || h.type}{h.sku ? ` (SKU ${h.sku})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
/*
<!-- END RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
