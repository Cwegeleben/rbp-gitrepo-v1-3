/*
<!-- BEGIN RBP GENERATED: dev-debug-panel-v1 -->
*/
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { TenantContext } from '../../TenantContext';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 bg-white shadow-sm">
      <div className="font-semibold text-slate-700 mb-2">{title}</div>
      <div className="text-xs">
        {children}
      </div>
    </div>
  );
}

export const DevDebugPanel: React.FC = () => {
  const ctx = useContext(TenantContext);
  const [open, setOpen] = useState(false);
  const [shop, setShop] = useState<string>(() => localStorage.getItem('rbp.dev.shop') || '');

  useEffect(() => {
    try {
      localStorage.setItem('rbp.dev.shop', shop || '');
    } catch {}
  }, [shop]);

  const prettyCtx = useMemo(() => {
    const obj = ctx || {};
    return JSON.stringify(obj, null, 2);
  }, [ctx]);

  const flags = useMemo(() => ctx?.flags || {}, [ctx]);
  const plan = ctx?.plan || ctx?.tenant?.plan || '—';
  const domain = ctx?.shopDomain || ctx?.tenant?.domain || '—';

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50">
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls="dev-debug-content"
      >
        <span className="text-sm font-semibold text-amber-900">Developer Debug</span>
        <span aria-hidden className="text-amber-900">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div id="dev-debug-content" className="grid gap-3 px-3 pb-3">
          <Section title="Access Context">
            <pre className="overflow-auto max-h-64 p-2 bg-slate-50 border border-slate-200 rounded">
{prettyCtx}
            </pre>
          </Section>
          <Section title="Plan / Flags">
            <div className="grid gap-1">
              <div><strong>Domain:</strong> {domain}</div>
              <div><strong>Plan:</strong> {plan}</div>
              <div><strong>Flags:</strong> <code>{JSON.stringify(flags)}</code></div>
            </div>
          </Section>
          <Section title="Signed URL helper">
            <div className="space-y-2">
              <div className="text-slate-700">Use this to access proxy endpoints locally:</div>
              <code className="block bg-slate-100 p-2 rounded border border-slate-200 text-[11px] break-words">
                pnpm proxy:sign --path "/apps/proxy/api/checkout/package?shop={domain}"
              </code>
              <div className="text-[11px] text-slate-500">Replace the path as needed; open the generated signed URL in your browser.</div>
            </div>
          </Section>
          <Section title="Shop Domain (dev)">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="demo.myshopify.com"
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                className="flex-1 rounded border px-2 py-1 text-sm"
              />
              <button
                className="rounded bg-amber-600 text-white px-3 py-1 text-sm"
                onClick={() => window.location.reload()}
              >Save & Reload</button>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Stored in localStorage as <code>rbp.dev.shop</code>.</div>
          </Section>
        </div>
      )}
    </div>
  );
};
/*
<!-- END RBP GENERATED: dev-debug-panel-v1 -->
*/
