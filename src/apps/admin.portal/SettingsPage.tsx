/*
<!-- BEGIN RBP GENERATED: tenant-admin-harden -->
*/
import React, { useContext, useMemo } from "react";
import { TenantContext } from "./TenantContext";
import { ui } from "./uiStrings";

function flattenTrueFlags(obj: any, prefix = ""): string[] {
  if (!obj || typeof obj !== 'object') return [];
  const out: string[] = [];
  for (const key of Object.keys(obj)) {
    const val = (obj as any)[key];
    const p = prefix ? `${prefix}.${key}` : key;
    if (val === true) out.push(p);
    else if (val && typeof val === 'object') out.push(...flattenTrueFlags(val, p));
  }
  return out;
}

export const SettingsPanel: React.FC<{ ctx?: any; loading?: boolean; error?: string | null }> = ({ ctx, loading, error }) => {
  if (loading) return <div>{ui.common.loading}</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!ctx) return <div>Loading…</div>;
  const shop = ctx.shopDomain || ctx.tenant?.domain || '—';
  const plan = ctx.plan || ctx.tenant?.plan || '—';
  const vendors: string[] = (ctx.vendors || ctx.allowlists?.vendors || ctx.allowlist?.vendors || []) as string[];
  const featureFlags = useMemo(() => {
    const f1 = flattenTrueFlags(ctx.features || {});
    const f2 = flattenTrueFlags(ctx.flags || {});
    // de-duplicate
    return Array.from(new Set([...f1, ...f2]));
  }, [ctx]);
  const [copied, setCopied] = React.useState<string | null>(null);

  return (
    <div>
      <h1>{ui.settings.title}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, maxWidth: 720 }}>
        <div style={{ fontWeight: 600 }}>{ui.settings.shopDomain}</div>
        <div>
          <span>{shop}</span>
          <button style={{ marginLeft: 8 }} aria-label={`${ui.common.copy} ${ui.settings.shopDomain}`}
            onClick={async () => { try { await navigator.clipboard.writeText(shop); setCopied('shop'); setTimeout(()=>setCopied(null), 1000); } catch {} }}>
            {ui.common.copy}
          </button>
        </div>

        <div style={{ fontWeight: 600 }}>{ui.settings.plan}</div>
        <div>
          <span>{plan}</span>
          <button style={{ marginLeft: 8 }} aria-label={`${ui.common.copy} ${ui.settings.plan}`}
            onClick={async () => { try { await navigator.clipboard.writeText(plan); setCopied('plan'); setTimeout(()=>setCopied(null), 1000); } catch {} }}>
            {ui.common.copy}
          </button>
        </div>

        <div style={{ fontWeight: 600 }}>{ui.settings.features}</div>
        <div>
          {featureFlags.length === 0 ? (
            <span>{ui.settings.noFeatures}</span>
          ) : (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {featureFlags.map((k) => (
                <span key={k} style={{ padding: '2px 8px', border: '1px solid #ddd', borderRadius: 999, fontSize: 12 }}>{k}</span>
              ))}
            </div>
          )}
        </div>

        <div style={{ fontWeight: 600 }}>{ui.settings.vendors}</div>
        <div>
          {vendors && vendors.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {vendors.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          ) : (
            <span>{ui.settings.noneConnected}</span>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <a href="mailto:support@rbp.dev?subject=RBP%20Tenant%20Admin%20Support">{ui.settings.contact}</a>
        <div role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}>
          {copied ? ui.common.copied : ''}
        </div>
      </div>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const ctx = useContext(TenantContext);
  return <SettingsPanel ctx={ctx} />;
};
/*
<!-- END RBP GENERATED: tenant-admin-harden -->
*/
