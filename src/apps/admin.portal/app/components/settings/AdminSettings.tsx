/*
<!-- BEGIN RBP GENERATED: admin-settings-v1 -->
*/
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ShopHostLink from '../ShopHostLink';
import { getParam } from '../../utils/url';
import { fetchProxy } from '../../../fetchProxy';
// <!-- BEGIN RBP GENERATED: admin-ssr-storage-guard-v1-0 -->
import { ssrLocalStorage, useClientStorage, useHydrated } from '../../../../rbp-shopify-app/rod-builder-pro/app/lib/ssrStorage';
// <!-- END RBP GENERATED: admin-ssr-storage-guard-v1-0 -->

type AccessCtx = {
  tenant?: { domain?: string };
  shopDomain?: string;
  roles?: string[];
  features?: Record<string, any>;
};

type Props = {
  loadCtx?: () => Promise<AccessCtx | null>;
};

const FLAG_KEYS = ['newCatalog', 'betaBuilds', 'debugToasts'] as const;
type FlagKey = typeof FLAG_KEYS[number];

function readFlagsSSR(): Record<string, boolean> {
  // Render-time: do not touch window; assume all false until hydrated.
  const out: Record<string, boolean> = {};
  for (const k of FLAG_KEYS) out[k] = false;
  return out;
}

function writeFlag(key: FlagKey, value: boolean) {
  const storageKey = `rbp.flags.${key}`;
  if (value) ssrLocalStorage.setItem(storageKey, '1');
  else ssrLocalStorage.removeItem(storageKey);
}

export default function AdminSettings({ loadCtx }: Props) {
  const { search } = useLocation();
  const shop = getParam(search, 'shop');
  const host = getParam(search, 'host');
  const embedded = getParam(search, 'embedded');

  const [ctx, setCtx] = useState<AccessCtx | null>(null);
  const [ctxError, setCtxError] = useState<string | null>(null);

  const [flags, setFlags] = useState<Record<string, boolean>>(() => readFlagsSSR());
  const isDev = process.env.NODE_ENV !== 'production';

  // Hydrate flags from storage on client
  // <!-- BEGIN RBP GENERATED: admin-ssr-storage-guard-v1-0 -->
  const hydrated = useHydrated();
  useEffect(() => {
    if (!hydrated) return;
    const next: Record<string, boolean> = {};
    for (const k of FLAG_KEYS) next[k] = ssrLocalStorage.getItem(`rbp.flags.${k}`) === '1';
    setFlags(next);
  }, [hydrated]);
  // <!-- END RBP GENERATED: admin-ssr-storage-guard-v1-0 -->

  useEffect(() => {
    let alive = true;
    const loader = loadCtx ?? (async () => {
      try {
        const res = await fetchProxy('/apps/proxy/api/access/ctx');
        return (await res.json()) as AccessCtx;
      } catch (e: any) {
        return null;
      }
    });
    loader()
      .then((data) => {
        if (!alive) return;
        if (!data) setCtxError('Failed to load access context');
        setCtx(data);
      })
      .catch(() => {
        if (!alive) return;
        setCtxError('Failed to load access context');
      });
    return () => {
      alive = false;
    };
  }, [loadCtx]);

  const hmacStatus: 'ok' | 'unknown' = useMemo(() => {
    if (ctx?.features && typeof ctx.features.proxy?.hmacVerified === 'boolean') {
      return ctx.features.proxy.hmacVerified ? 'ok' : 'unknown';
    }
    return ctx ? 'ok' : 'unknown';
  }, [ctx]);

  const onCopy = async (label: string, text?: string | null) => {
    try {
      await navigator.clipboard.writeText(String(text ?? ''));
    } catch {
      // no-op
    }
  };

  const Field = ({
    id,
    label,
    value,
    help,
  }: {
    id: string;
    label: string;
    value?: string | null;
    help?: string;
  }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr auto', gap: 12, alignItems: 'center', margin: '8px 0' }}>
      <label htmlFor={id} style={{ fontWeight: 600 }}>
        {label}
      </label>
      <div>
        <input id={id} aria-describedby={help ? `${id}-help` : undefined} readOnly value={value ?? ''} style={{ width: '100%' }} />
        {help ? (
          <div id={`${id}-help`} style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            {help}
          </div>
        ) : null}
      </div>
      <button onClick={() => onCopy(label, value)} aria-label={`Copy ${label}`}>Copy</button>
    </div>
  );

  return (
    <div>
      <h1>Settings</h1>

      {ctxError ? (
        <div role="alert" aria-live="polite" style={{ padding: 12, background: '#fff3f3', border: '1px solid #ffd6d6', color: '#842029', borderRadius: 6, marginBottom: 12 }}>
          Error: {ctxError}
        </div>
      ) : null}

      <section style={{ marginBottom: 24 }} aria-labelledby="shop-context-h">
        <h2 id="shop-context-h">Shop context</h2>
        <Field id="ctx-shop-domain" label="Shop domain" value={ctx?.shopDomain || ctx?.tenant?.domain || shop || ''} help="Resolved from access context or URL" />
        <Field id="ctx-host" label="Host" value={host || ''} help="Preserved across links via ShopHostLink" />
        <Field id="ctx-embedded" label="Embedded" value={embedded || ''} help="Expected to be 1 in embedded admin" />
        <div style={{ marginTop: 8 }}>
          <ShopHostLink to="/app/doctor">Go to Doctor</ShopHostLink>
        </div>
      </section>

      <section style={{ marginBottom: 24 }} aria-labelledby="proxy-security-h">
        <h2 id="proxy-security-h">Proxy & Security</h2>
        <Field id="proxy-prefix" label="App Proxy prefix" value="/apps/proxy" help="Prefix used by the App Proxy endpoints" />
        <Field id="hmac-status" label="HMAC verification" value={hmacStatus === 'ok' ? 'OK' : 'Unknown'} help="Reported by access context" />
      </section>

  {isDev && hydrated ? (
        <section aria-labelledby="dev-flags-h">
          <h2 id="dev-flags-h">Feature flags (local)</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            {FLAG_KEYS.map((k) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
      checked={!!flags[k]}
                  onChange={(e) => {
                    const next = { ...flags, [k]: e.target.checked };
                    setFlags(next);
                    writeFlag(k, e.target.checked);
                  }}
                />
                <span>{k}</span>
              </label>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>Flags are stored in localStorage as rbp.flags.*</div>
        </section>
      ) : null}
    </div>
  );
}
/*
<!-- END RBP GENERATED: admin-settings-v1 -->
*/
