// <!-- BEGIN RBP GENERATED: storefront-cart-e2e-v1-1 -->
import React, { useEffect, useMemo, useRef, useState } from "react";
import { GROUPS, type GroupName, type RbpPart, RbpProxyClient, type SlotSelection, emptySelection, loadSelection, persistSelection, readSelectionFromUrl, writeSelectionToUrl } from "../lib/rbpProxyClient";
import RbpProxyCallout from "../../../../packages/ui/components/RbpProxyCallout";
import { buildCartPermalink } from "../../../../packages/builds/packager";
import { LiveRegion, useLiveRegion } from "../../../../packages/ui/live-region/LiveRegion";
// <!-- BEGIN RBP GENERATED: live-proxy-default-v1 -->
import { getDataSource } from "../data/source";
import { ProxyClient } from "../api/proxyClient";
// <!-- END RBP GENERATED: live-proxy-default-v1 -->

function currency(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function AddToBuildPanel() {
  const clientRef = useRef(new RbpProxyClient(""));
  const client = clientRef.current;
  // <!-- BEGIN RBP GENERATED: live-proxy-default-v1 -->
  const proxyClientRef = useRef(new ProxyClient(""));
  const proxyClient = proxyClientRef.current;
  const [dataSource, setDataSource] = useState<"proxy" | "mock">("mock");
  const [probeReason, setProbeReason] = useState<string | undefined>(undefined);
  // <!-- END RBP GENERATED: live-proxy-default-v1 -->

  const [parts, setParts] = useState<RbpPart[]>([]);
  const [sel, setSel] = useState<SlotSelection>(() => readSelectionFromUrl() || loadSelection() || emptySelection());
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [warn, setWarn] = useState<string>("");

  // load
  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();
    (async () => {
      setLoading(true);
      // <!-- BEGIN RBP GENERATED: live-proxy-default-v1 -->
      const info = await getDataSource({ timeoutMs: 1200, signal: ac.signal });
      if (cancelled) return;
      setDataSource(info.source);
      setProbeReason(info.reason);
      if (info.source === "proxy") {
        try {
          const data = await proxyClient.getCatalog(ac.signal);
          if (cancelled) return;
          setParts(data as any);
          setUsingMock(false);
          setBlocked(false);
        } catch {
          // If proxy path fails at runtime after probe, fall back to mock provider
          const data = await client.getCatalogParts();
          if (cancelled) return;
          setParts(data);
          setUsingMock(true);
          setBlocked(true);
          console.info("RBP: Using mock data (proxy fetch failed post-probe)");
        }
      } else {
        const data = await client.getCatalogParts();
        if (cancelled) return;
        setParts(data);
        setUsingMock(true);
        setBlocked(true);
        console.info(`RBP: Using mock data (reason: ${info.reason || "unknown"})`);
      }
      // <!-- END RBP GENERATED: live-proxy-default-v1 -->
      setLoading(false);
    })();
    return () => { cancelled = true; ac.abort(); };
  }, []);

  // persist
  useEffect(() => { persistSelection(sel); writeSelectionToUrl(sel); }, [sel]);

  const groups: readonly GroupName[] = GROUPS;
  const byGroup = useMemo(() => {
    const m = new Map<GroupName, RbpPart[]>();
    groups.forEach((g: GroupName) => m.set(g, []));
    for (const p of parts) {
      const g = (p.group as GroupName);
      const arr = m.get(g) || [];
      arr.push(p);
      m.set(g, arr);
    }
    return m;
  }, [parts]);

  function onPick(group: string, p: RbpPart) {
    const next = { ...sel, [group]: p };
    setSel(next);
    announce(`Selection added: ${p.title}`);
  }
  function onRemove(group: string) {
    const next = { ...sel, [group]: null };
    setSel(next);
    announce("Selection removed");
  }
  function onReset() {
    setSel({});
    announce("Selections reset");
  }

  // <!-- BEGIN RBP GENERATED: ui-polish-v1 -->
  const { announce } = useLiveRegion();
  // <!-- END RBP GENERATED: ui-polish-v1 -->

  function onToggleMock(next: boolean) {
    client.setUseMock(next);
    setUsingMock(next);
    // reload data if switching
    (async () => {
      // <!-- BEGIN RBP GENERATED: live-proxy-default-v1 -->
      if (!next && dataSource === "proxy") {
        try {
          const data = await proxyClient.getCatalog();
          setParts(data as any);
          return;
        } catch {
          // fall through to mock
        }
      }
      // <!-- END RBP GENERATED: live-proxy-default-v1 -->
      const data = await client.getCatalogParts();
      setParts(data);
    })();
  }

  const total: number = useMemo(() => (Object.values(sel) as Array<RbpPart | null | undefined>).reduce((sum: number, p) => sum + (p?.price ?? 0), 0), [sel]);

  return (
    <div className="rbp-theme-panel">
      {/* Shared live region for SR announcements */}
      {/* <!-- BEGIN RBP GENERATED: ui-polish-v1 --> */}
      <LiveRegion />
      {/* <!-- END RBP GENERATED: ui-polish-v1 --> */}
      <header className="rbp-theme-header">
        {/* <!-- BEGIN RBP GENERATED: ui-polish-v1 --> */}
        <h3 className="rbp-heading">Add to Build</h3>
        {usingMock && (
          <span className="rbp-badge rbp-badge--subtle" aria-label="Using mock data">Using mock data</span>
        )}
        <div className="rbp-actions">
          <button className="rbp-btn rbp-btn--ghost" aria-label="Save List" onClick={() => announce("List saved")}>Save List</button>
          <button className="rbp-btn rbp-btn--primary" aria-label="Add New List" onClick={() => onReset()}>Add New List</button>
        </div>
        {/* <!-- END RBP GENERATED: ui-polish-v1 --> */}
      </header>

      <RbpProxyCallout blocked={blocked} usingMock={usingMock} onToggleMock={onToggleMock} />

      {loading ? (
        <div>Loading…</div>
      ) : (
        // <!-- BEGIN RBP GENERATED: ui-polish-v1 -->
        <div className="rbp-grid rbp-grid--responsive">
          {groups.map((g: GroupName) => {
            const current = (sel as any)[g] as RbpPart | undefined | null;
            const options = byGroup.get(g) || [];
            return (
              <div key={g} className="rbp-card">
                <div className="rbp-card__head">
                  <strong>{g}</strong>
                  <div className="rbp-buttonbar">
                    <button className="rbp-btn rbp-btn--ghost" aria-label={`Select ${g}`} onClick={() => current ? null : options[0] && onPick(g, options[0])}>Select</button>
                    <button className="rbp-btn rbp-btn--ghost" aria-label={`Remove ${g}`} disabled={!current} onClick={() => onRemove(g)}>Remove</button>
                  </div>
                </div>
                <div className="rbp-card__body">
                  {current ? (
                    <div className="rbp-row rbp-row--spread">
                      <span>{current.title}</span>
                      <span>{currency(current.price)}</span>
                    </div>
                  ) : (
                    <em className="rbp-text--muted">None selected</em>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        // <!-- END RBP GENERATED: ui-polish-v1 -->
      )}

      <footer className="rbp-footer">
        <button className="rbp-btn rbp-btn--ghost" onClick={onReset} aria-label="Reset selections">Reset</button>
        <div className="rbp-actions">
          <div className="rbp-total">Total: {currency(total)}</div>
          <button
            className="rbp-btn rbp-btn--primary"
            aria-label="Add bundle to cart"
            onClick={async () => {
              setWarn("");
              const selected = (Object.entries(sel) as Array<[string, RbpPart | null | undefined]>).map(([g, p]) => p).filter(Boolean) as RbpPart[];
              if (selected.length === 0) return;
              // Ensure variant IDs
              const missing = selected.filter(p => !p.variantId);
              let merged = selected.slice();
              if (missing.length > 0) {
                // <!-- BEGIN RBP GENERATED: live-proxy-default-v1 -->
                const map = dataSource === "proxy"
                  ? await proxyClient.getVariantsBySku().catch(async () => await client.getVariantsBySku())
                  : await client.getVariantsBySku();
                // <!-- END RBP GENERATED: live-proxy-default-v1 -->
                merged = selected.map(p => ({ ...p, variantId: p.variantId ?? map[p.sku] }));
              }
              const unresolved = merged.filter(p => !p.variantId);
              if (unresolved.length > 0) {
                setWarn("One or more selections do not have a variant. Sync required.");
                return;
              }
              const lines = merged.map(p => ({ variantId: p.variantId as number, qty: 1 }));
              const permalink = buildCartPermalink(lines);
              announce("Bundle added to cart");
              window.location.assign(permalink);
            }}
          >
            Add bundle to cart
          </button>
        </div>
      </footer>
      {warn && <div role="alert" className="rbp-warn">{warn}</div>}
    </div>
  );
}

export default AddToBuildPanel;
// <!-- END RBP GENERATED: storefront-cart-e2e-v1-1 -->

// <!-- BEGIN RBP GENERATED: ui-polish-v1 -->
// Lightweight theme class definitions (scoped by rbp- classnames). In a real theme,
// these would come from the storefront's CSS. We keep minimal styles here to avoid inline styles.
// Consumers can override via cascading.
// We intentionally avoid exporting; classes used via global CSS cascade.
//
// Note: Storybook will include these via CSS-in-JS injection. In app, include in theme CSS bundle.
if (typeof document !== 'undefined') {
  const id = 'rbp-theme-inline-css';
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .rbp-theme-header { display:flex; align-items:center; gap:.5rem; margin-bottom:.5rem }
      .rbp-heading { margin:0 }
      .rbp-actions { margin-left:auto; display:inline-flex; gap:.5rem }
      .rbp-badge { font-size:12px; padding:2px 6px; border-radius:999px; border:1px solid #e5e7eb }
      .rbp-badge--subtle { color:#6b7280; background:#f9fafb }
      .rbp-grid { display:grid; gap:.75rem }
      .rbp-grid--responsive { grid-template-columns: repeat(1, minmax(0, 1fr)); }
      @media (min-width: 640px) { .rbp-grid--responsive { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      @media (min-width: 1024px) { .rbp-grid--responsive { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      .rbp-card { border:1px solid #e5e7eb; border-radius:.5rem; padding:.5rem; background:#fff }
      .rbp-card__head { display:flex; align-items:center; justify-content:space-between }
      .rbp-card__body { margin-top:.375rem; font-size:14px; color:#374151 }
      .rbp-row { display:flex; gap:.5rem }
      .rbp-row--spread { justify-content:space-between }
      .rbp-text--muted { color:#6b7280 }
      .rbp-footer { margin-top:.75rem; display:flex; align-items:center; justify-content:space-between }
      .rbp-total { font-weight:600 }
      .rbp-btn { font: inherit; border-radius:.375rem; padding:.375rem .625rem; cursor:pointer }
      .rbp-btn--primary { background:#047857; color:white; border:0 }
      .rbp-btn--ghost { background:transparent; border:1px solid #e5e7eb; color:#111827 }
      .rbp-btn:disabled { opacity:.5; cursor:not-allowed }
      .rbp-buttonbar { display:inline-flex; gap:.375rem }
      .rbp-warn { margin-top:.5rem; color:#b45309 }
    `;
    document.head.appendChild(style);
  }
}
// <!-- END RBP GENERATED: ui-polish-v1 -->
