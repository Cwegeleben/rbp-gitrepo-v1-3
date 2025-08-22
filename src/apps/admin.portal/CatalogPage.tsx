/*
<!-- BEGIN RBP GENERATED: tenant-admin-harden -->
*/
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "../../shared/ui/toast";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ErrorState } from "./ErrorState";
/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 --> */
/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 --> */
import { createCatalogApi, CatalogListResponse, CatalogProduct } from "./app/lib/createCatalogApi";
import * as urlState from "./app/lib/urlState";
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2 --> */
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2 --> */
import { ui } from "./uiStrings";

function parseMulti(v?: string | null): string[] {
  if (!v) return [];
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}

/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 --> */
export const CatalogPage: React.FC<{ api?: ReturnType<typeof createCatalogApi>; initialData?: CatalogListResponse; skipAutoLoad?: boolean }> = ({ api, initialData, skipAutoLoad }) => {
  const [sp, setSp] = useSearchParams();
  const state = urlState.read(sp);
  const { q, vendor, tags, priceBand, cursor } = state;

  const [data, setData] = useState<CatalogListResponse | null>(initialData ?? null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<Set<string>>(new Set());

  const apiImpl = useMemo(() => api || createCatalogApi(), [api]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
  const res = await apiImpl.list({ vendor, tags, q, priceBand, cursor });
      // Stable sort for display: vendor -> product name -> price asc
      const sorted = [...(res.items || [])].sort((a: CatalogProduct, b: CatalogProduct) => {
        const va = (a.vendor || '').localeCompare(b.vendor || '');
        if (va !== 0) return va;
        const ta = (a.title || '').localeCompare(b.title || '');
        if (ta !== 0) return ta;
        const pa = Number(a.priceBand ?? Number.MAX_SAFE_INTEGER);
        const pb = Number(b.priceBand ?? Number.MAX_SAFE_INTEGER);
        return pa - pb;
      });
      setData({ ...res, items: sorted });
    } catch (e: any) {
      setError(e?.message || "Failed to load catalog");
    } finally {
      setLoading(false);
    }
  }, [apiImpl, vendor, tags, q, priceBand, cursor]);

  useEffect(() => {
    if (skipAutoLoad) return;
    refresh();
  }, [refresh, skipAutoLoad]);

  // Keep state in sync when a new initialData is provided (e.g., deep-link/rerender in tests)
  /* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 --> */
  useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);
  /* <!-- END RBP GENERATED: tenant-admin-catalog-v2 --> */

  const onSetSp = (next: Partial<{ q: string; vendor: string[]; tags: string[]; priceBand?: string; cursor?: string }>) => {
    const nextSp = new URLSearchParams(sp.toString());
    if (next.q !== undefined) nextSp.set('q', next.q || '');
    if (next.vendor !== undefined) nextSp.set('vendor', (next.vendor || []).join(','));
    if (next.tags !== undefined) nextSp.set('tags', (next.tags || []).join(','));
    if (next.priceBand !== undefined) {
      if (next.priceBand) nextSp.set('priceBand', next.priceBand);
      else nextSp.delete('priceBand');
    }
    if (next.cursor !== undefined) {
      if (next.cursor) nextSp.set('cursor', next.cursor);
      else nextSp.delete('cursor');
    } else {
      // reset cursor when any filter changes
      if (next.q !== undefined || next.vendor !== undefined || next.tags !== undefined || next.priceBand !== undefined) nextSp.delete('cursor');
    }
    setSp(nextSp, { replace: false });
  };

  const onToggle = async (id: string, next: boolean) => {
    // optimistic update
    setToggling((s) => new Set(s).add(id));
    setData((d) => {
      if (!d) return d;
      return {
        ...d,
        items: d.items.map((it) => (it.id === id ? { ...it, enabled: next } : it)),
      };
    });
    // keep focus on the last toggled control for a11y
    const activeEl = document.activeElement as HTMLElement | null;
    try {
      // tiny exponential retry up to 2 attempts on network error
      let attempt = 0;
      while (true) {
        try {
          await apiImpl.setEnabled(id, next);
          break;
        } catch (e: any) {
          const isNetwork = !e?.status; // no HTTP status implies network
          if (isNetwork && attempt < 2) {
            const delay = 200 * Math.pow(2, attempt); // 200ms, 400ms
            await new Promise((r) => setTimeout(r, delay));
            attempt++;
            continue;
          }
          throw e;
        }
      }
    } catch (e: any) {
      // rollback
      setData((d) => {
        if (!d) return d;
        return {
          ...d,
          items: d.items.map((it) => (it.id === id ? { ...it, enabled: !next } : it)),
        };
      });
      toast("error", ui.catalog.toggleFailed);
      // restore focus to the toggle control
      requestAnimationFrame(() => activeEl?.focus());
    } finally {
      setToggling((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  };

  // Ensure stable sort is applied for both initialData and fetched data
  /* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 --> */
  const sortedItems = useMemo(() => {
    const items = data?.items || [];
    return [...items].sort((a: CatalogProduct, b: CatalogProduct) => {
      const va = (a.vendor || '').localeCompare(b.vendor || '');
      if (va !== 0) return va;
      const ta = (a.title || '').localeCompare(b.title || '');
      if (ta !== 0) return ta;
      const pa = Number(a.priceBand ?? Number.MAX_SAFE_INTEGER);
      const pb = Number(b.priceBand ?? Number.MAX_SAFE_INTEGER);
      return pa - pb;
    });
  }, [data]);
  /* <!-- END RBP GENERATED: tenant-admin-catalog-v2 --> */

  return (
    <div>
      <h1>{ui.catalog.title}</h1>
  <FilterBar
        q={q}
        vendor={vendor}
        tags={tags}
        priceBand={priceBand}
        onChange={(next) => onSetSp(next)}
      />
  <div role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}>
        {loading ? ui.common.loading : (data?.pageInfo?.total != null ? `${data?.pageInfo?.total} results` : `${data?.items?.length ?? 0} results`)}
      </div>
      {loading && <LoadingSkeleton rows={6} />}
      {error && <ErrorState message={error} />}
      {!loading && !error && (
        <>
          {data && data.items.length > 0 ? (
            <DataTable
              rows={sortedItems}
              toggling={toggling}
              onToggle={onToggle}
              pageInfo={data.pageInfo}
              onPage={(cursor) => onSetSp({ cursor })}
            />
          ) : (
            <div>{ui.catalog.empty}</div>
          )}
        </>
      )}
    </div>
  );
};
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2 --> */

/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 --> */
export const FilterBar: React.FC<{
  q: string;
  vendor: string[];
  tags: string[];
  priceBand?: string;
  onChange: (next: Partial<{ q: string; vendor: string[]; tags: string[]; priceBand?: string }>) => void;
}> = ({ q, vendor, tags, priceBand, onChange }) => {
  const [qv, setQv] = useState(q);
  const [vv, setVv] = useState(vendor.join(","));
  const [tv, setTv] = useState(tags.join(","));
  const [pb, setPb] = useState(priceBand || "");

  useEffect(() => setQv(q), [q]);
  useEffect(() => setVv(vendor.join(",")), [vendor.join(",")]);
  useEffect(() => setTv(tags.join(",")), [tags.join(",")]);
  useEffect(() => setPb(priceBand || ""), [priceBand]);

  return (
    <div style={{ display: "flex", gap: 8, margin: "12px 0", alignItems: 'center' }}>
      <label>
        <span className="visually-hidden">{ui.catalog.searchPlaceholder}</span>
        <input
          aria-label={ui.catalog.searchPlaceholder}
          placeholder={ui.catalog.searchPlaceholder}
          value={qv}
          onChange={(e) => setQv(e.target.value)}
          onBlur={() => onChange({ q: qv })}
        />
      </label>
      <label>
        <span className="visually-hidden">{ui.catalog.vendorPlaceholder}</span>
        <input
          aria-label={ui.catalog.vendorPlaceholder}
          placeholder={ui.catalog.vendorPlaceholder}
          value={vv}
          onChange={(e) => setVv(e.target.value)}
          onBlur={() => onChange({ vendor: parseMulti(vv) })}
        />
      </label>
      <label>
        <span className="visually-hidden">{ui.catalog.tagsPlaceholder}</span>
        <input
          aria-label={ui.catalog.tagsPlaceholder}
          placeholder={ui.catalog.tagsPlaceholder}
          value={tv}
          onChange={(e) => setTv(e.target.value)}
          onBlur={() => onChange({ tags: parseMulti(tv) })}
        />
      </label>
      <label>
        <span className="visually-hidden">{ui.catalog.priceBandLabel}</span>
        <select aria-label={ui.catalog.priceBandLabel} value={pb} onChange={(e) => { const v = e.target.value; setPb(v); onChange({ priceBand: v || undefined }); }}>
          <option value="">{ui.catalog.priceBandAll}</option>
          <option value="low">{ui.catalog.priceBandLow}</option>
          <option value="medium">{ui.catalog.priceBandMedium}</option>
          <option value="high">{ui.catalog.priceBandHigh}</option>
        </select>
      </label>
      <button onClick={() => onChange({ q: qv, vendor: parseMulti(vv), tags: parseMulti(tv), priceBand: pb || undefined })}>{ui.catalog.apply}</button>
    </div>
  );
};
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2 --> */

export const DataTable: React.FC<{
  rows: CatalogProduct[];
  toggling: Set<string>;
  onToggle: (id: string, next: boolean) => void | Promise<void>;
  pageInfo?: { nextCursor?: string; prevCursor?: string };
  onPage: (cursor?: string) => void;
}> = ({ rows, toggling, onToggle, pageInfo, onPage }) => {
  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Product</th>
            <th>Vendor</th>
            <th>Tags</th>
            <th>Price Band</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td style={{ textAlign: "left" }}>{r.title}</td>
              <td style={{ textAlign: "center" }}>{r.vendor || "—"}</td>
              <td style={{ textAlign: "center" }}>{(r.tags || []).join(", ")}</td>
              <td style={{ textAlign: "center" }}>{String(r.priceBand ?? "—")}</td>
              <td style={{ textAlign: "center" }}>{r.enabled ? "Enabled" : "Disabled"}</td>
              <td style={{ textAlign: "center" }}>
                <ToggleCell
                  checked={r.enabled}
                  pending={toggling.has(r.id)}
                  onChange={(n) => onToggle(r.id, n)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
        <button disabled={!pageInfo?.prevCursor} onClick={() => onPage(pageInfo?.prevCursor)} aria-label={ui.common.prev}>
          {ui.common.prev}
        </button>
        <button disabled={!pageInfo?.nextCursor} onClick={() => onPage(pageInfo?.nextCursor)} aria-label={ui.common.next}>
          {ui.common.next}
        </button>
      </div>
    </div>
  );
};

export const ToggleCell: React.FC<{ checked: boolean; pending?: boolean; onChange: (next: boolean) => void }>
  = ({ checked, pending, onChange }) => {
    return (
      <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <input
          type="checkbox"
          checked={checked}
          disabled={pending}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={ui.a11y.toggle("product", !checked)}
        />
        {pending && <span>{ui.catalog.saving}</span>}
      </label>
    );
  };
// Re-export API to preserve prior public surface for tests and callers
/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 --> */
export { createCatalogApi } from './app/lib/createCatalogApi';
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2 --> */
/*
<!-- END RBP GENERATED: tenant-admin-harden -->
*/
