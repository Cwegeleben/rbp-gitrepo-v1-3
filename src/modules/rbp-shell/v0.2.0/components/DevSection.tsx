/*
<!-- BEGIN RBP GENERATED: dev-debug-panel-v1 -->
*/
import React, { useMemo, useState } from 'react';

export default function DevSection({ ctx, error }: { ctx?: { tenant?: { domain?: string }; plan?: string; flags?: any }; error?: any }) {
  const [open, setOpen] = useState(false);
  const info = useMemo(() => {
    const domain = ctx?.tenant?.domain || '—';
    const plan = ctx?.plan || '—';
    const flags = ctx?.flags || {};
    return { domain, plan, flags };
  }, [ctx]);

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50">
      <button type="button" className="w-full flex items-center justify-between px-3 py-2" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className="text-sm font-semibold text-amber-900">Dev</span>
        <span aria-hidden className="text-amber-900">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 text-sm">
          {error ? (
            <div role="alert" className="text-red-700">
              HMAC validation failed. Open via Theme Editor or use a signed URL.
            </div>
          ) : (
            <div className="grid gap-1">
              <div><strong>Domain:</strong> {info.domain}</div>
              <div><strong>Plan:</strong> {info.plan}</div>
              <div><strong>Flags:</strong> <code className="text-[11px]">{JSON.stringify(info.flags)}</code></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
/*
<!-- END RBP GENERATED: dev-debug-panel-v1 -->
*/
