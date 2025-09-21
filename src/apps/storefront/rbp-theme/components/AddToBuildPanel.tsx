// <!-- BEGIN RBP GENERATED: storefront-cart-e2e-v1-1 -->
import React, { useEffect, useMemo, useRef, useState } from "react";
import { GROUPS, type GroupName, type RbpPart, RbpProxyClient, type SlotSelection, emptySelection, loadSelection, persistSelection, readSelectionFromUrl, writeSelectionToUrl } from "../lib/rbpProxyClient";
import RbpProxyCallout from "../../../../packages/ui/components/RbpProxyCallout";
import { buildCartPermalink } from "../../../../packages/builds/packager";

function currency(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function AddToBuildPanel() {
  const clientRef = useRef(new RbpProxyClient(""));
  const client = clientRef.current;

  const [parts, setParts] = useState<RbpPart[]>([]);
  const [sel, setSel] = useState<SlotSelection>(() => readSelectionFromUrl() || loadSelection() || emptySelection());
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [warn, setWarn] = useState<string>("");

  // load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await client.getCatalogParts();
      if (cancelled) return;
      setParts(data);
      setUsingMock(client.state.usingMock);
      setBlocked(client.state.proxyBlocked);
      setLoading(false);
    })();
    return () => { cancelled = true; };
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

  function announce(msg: string) {
    const el = document.getElementById("rbp-live");
    if (el) { el.textContent = msg; setTimeout(() => { el.textContent = ""; }, 1000); }
  }

  function onToggleMock(next: boolean) {
    client.setUseMock(next);
    setUsingMock(next);
    // reload data if switching
    (async () => {
      const data = await (next ? client.getCatalogParts() : client.getCatalogParts());
      setParts(data);
    })();
  }

  const total: number = useMemo(() => (Object.values(sel) as Array<RbpPart | null | undefined>).reduce((sum: number, p) => sum + (p?.price ?? 0), 0), [sel]);

  return (
    <div>
      <div aria-live="polite" aria-atomic="true" id="rbp-live" style={{ position: "absolute", left: -9999, top: "auto", width: 1, height: 1, overflow: "hidden" }} />
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Add to Build</h3>
        {usingMock && <span style={{ fontSize: 12, color: "#555", border: "1px solid #ccc", padding: "2px 6px", borderRadius: 4 }}>Using mock data</span>}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button aria-label="Save List" onClick={() => announce("List saved")}>Save List</button>
          <button aria-label="Add New List" onClick={() => onReset()}>Add New List</button>
        </div>
      </header>

      <RbpProxyCallout blocked={blocked} usingMock={usingMock} onToggleMock={onToggleMock} />

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {groups.map((g: GroupName) => {
            const current = (sel as any)[g] as RbpPart | undefined | null;
            const options = byGroup.get(g) || [];
            return (
              <div key={g} style={{ border: "1px solid #ddd", padding: 8, borderRadius: 6 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <strong>{g}</strong>
                  <div>
                    <button aria-label={`Select ${g}`} onClick={() => current ? null : options[0] && onPick(g, options[0])}>Select</button>
                    <button aria-label={`Remove ${g}`} disabled={!current} onClick={() => onRemove(g)}>Remove</button>
                  </div>
                </div>
                <div style={{ marginTop: 6, fontSize: 14, color: "#333" }}>
                  {current ? (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{current.title}</span>
                      <span>{currency(current.price)}</span>
                    </div>
                  ) : (
                    <em style={{ color: "#666" }}>None selected</em>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <footer style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onReset} aria-label="Reset selections">Reset</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div>Total: {currency(total)}</div>
          <button
            aria-label="Add bundle to cart"
            onClick={async () => {
              setWarn("");
              const selected = (Object.entries(sel) as Array<[string, RbpPart | null | undefined]>).map(([g, p]) => p).filter(Boolean) as RbpPart[];
              if (selected.length === 0) return;
              // Ensure variant IDs
              const missing = selected.filter(p => !p.variantId);
              let merged = selected.slice();
              if (missing.length > 0) {
                const map = await client.getVariantsBySku();
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
            style={{ background: "#0a7", color: "#fff", border: 0, padding: "6px 10px", borderRadius: 4 }}
          >
            Add bundle to cart
          </button>
        </div>
      </footer>
      {warn && <div role="alert" style={{ marginTop: 6, color: "#b45309" }}>{warn}</div>}
    </div>
  );
}

export default AddToBuildPanel;
// <!-- END RBP GENERATED: storefront-cart-e2e-v1-1 -->
