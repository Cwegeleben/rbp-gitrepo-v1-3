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
/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
import { DataTable as DataTableV21 } from './app/components/DataTable';
import type { SortKey, SortDir } from './app/components/DataTable';
import { Toolbar } from './app/components/Toolbar';
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */

function parseMulti(v?: string | null): string[] {
  if (!v) return [];
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}

/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 --> */
export const CatalogPage: React.FC<{ api?: ReturnType<typeof createCatalogApi>; initialData?: CatalogListResponse; skipAutoLoad?: boolean }> = ({ api, initialData, skipAutoLoad }) => {
  const [sp, setSp] = useSearchParams();
  const state = urlState.read(sp);
  const { q, vendor, tags, priceBand, cursor } = state;
  /* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>(() => state.sort || { key: 'vendor', dir: 'asc' });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  /* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */

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
      setData(res);
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
  /* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
  const sortedItems = useMemo(() => {
    const items = data?.items || [];
    const stable = [...items].map((it, idx) => ({ it, idx }));
    const dirMul = sort.dir === 'asc' ? 1 : -1;
    const cmp = (a: CatalogProduct, b: CatalogProduct): number => {
      switch (sort.key) {
        case 'vendor': {
          const va = (a.vendor || '').localeCompare(b.vendor || '');
          if (va !== 0) return va * dirMul;
          const ta = (a.title || '').localeCompare(b.title || '');
          if (ta !== 0) return ta;
          // stability fallbacks
          const pa = Number(a.priceBand ?? Number.NaN);
          const pb = Number(b.priceBand ?? Number.NaN);
          const bothNum = !Number.isNaN(pa) && !Number.isNaN(pb);
          const pd = bothNum ? (pa - pb) : String(a.priceBand ?? '').localeCompare(String(b.priceBand ?? ''));
          if (pd !== 0) return pd;
          const ed = (a.enabled ? 1 : 0) - (b.enabled ? 1 : 0);
          if (ed !== 0) return ed;
          return 0;
        }
        case 'title': {
          const ta = (a.title || '').localeCompare(b.title || '');
          if (ta !== 0) return ta * dirMul;
          const va = (a.vendor || '').localeCompare(b.vendor || '');
          if (va !== 0) return va;
          const pa = Number(a.priceBand ?? Number.NaN);
          const pb = Number(b.priceBand ?? Number.NaN);
          const bothNum = !Number.isNaN(pa) && !Number.isNaN(pb);
          const pd = bothNum ? (pa - pb) : String(a.priceBand ?? '').localeCompare(String(b.priceBand ?? ''));
          if (pd !== 0) return pd;
          const ed = (a.enabled ? 1 : 0) - (b.enabled ? 1 : 0);
          if (ed !== 0) return ed;
          return 0;
        }
        case 'priceBand': {
          const pa = Number(a.priceBand ?? Number.NaN);
          const pb = Number(b.priceBand ?? Number.NaN);
          const bothNum = !Number.isNaN(pa) && !Number.isNaN(pb);
          const diff = bothNum ? (pa - pb) : String(a.priceBand ?? '').localeCompare(String(b.priceBand ?? ''));
          if (diff !== 0) return diff * dirMul;
          const va = (a.vendor || '').localeCompare(b.vendor || '');
          if (va !== 0) return va;
          const ta = (a.title || '').localeCompare(b.title || '');
          if (ta !== 0) return ta;
          const ed = (a.enabled ? 1 : 0) - (b.enabled ? 1 : 0);
          if (ed !== 0) return ed;
          return 0;
        }
        case 'enabled': {
          const ea = a.enabled ? 1 : 0;
          const eb = b.enabled ? 1 : 0;
          const diff = ea - eb; // asc: false->true
          if (diff !== 0) return diff * dirMul;
          const va = (a.vendor || '').localeCompare(b.vendor || '');
          if (va !== 0) return va;
          const ta = (a.title || '').localeCompare(b.title || '');
          if (ta !== 0) return ta;
          const pa = Number(a.priceBand ?? Number.NaN);
          const pb = Number(b.priceBand ?? Number.NaN);
          const bothNum = !Number.isNaN(pa) && !Number.isNaN(pb);
          const pd = bothNum ? (pa - pb) : String(a.priceBand ?? '').localeCompare(String(b.priceBand ?? ''));
          if (pd !== 0) return pd;
          return 0;
        }
      }
    };
    stable.sort((a, b) => {
      const c = cmp(a.it, b.it);
      if (c !== 0) return c;
      // stable
      return a.idx - b.idx;
    });
    return stable.map(s => s.it);
  }, [data, sort]);
  /* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */

  /* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
  const setUrlSort = (next: { key: SortKey; dir: SortDir }) => {
    setSort(next);
    const nextSp = new URLSearchParams(sp.toString());
    nextSp.set('sort', `${next.key}:${next.dir}`);
    setSp(nextSp, { replace: false });
  };
  /* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */
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
  {/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */}
      <div role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}>
        {loading ? ui.common.loading : ui.catalog.totalResults(data?.pageInfo?.total ?? data?.items?.length ?? 0)}
      </div>
  <div style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 3, padding: '4px 0', borderBottom: '1px solid #eee', display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ marginRight: 'auto' }}>
          {ui.catalog.totalResults(data?.pageInfo?.total ?? data?.items?.length ?? 0)} • {ui.catalog.sortedBy(ui.catalog.sortLabels[sort.key](sort.dir))} • {selected.size} selected
        </div>
      </div>
  {/* live status for completion announcements */}
  <div role="status" aria-live="polite" data-testid="bulk-status" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}></div>
  {/* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */}
      {loading && <LoadingSkeleton rows={6} />}
      {error && <ErrorState message={error} />}
      {!loading && !error && (
        <>
          {data && data.items.length > 0 ? (
            <>
              {/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */}
              <Toolbar
                selectedCount={selected.size}
                totalCount={data.pageInfo?.total ?? data.items.length}
                sortLabel={ui.catalog.sortLabels[sort.key](sort.dir)}
                onEnable={async () => {
                  if (selected.size === 0) return;
                  const ids = Array.from(selected);
                  // optimistic
                  setData(d => d ? { ...d, items: d.items.map(it => ids.includes(it.id) ? { ...it, enabled: true } : it) } : d);
                  let failed = 0;
                  const lastActive = document.activeElement as HTMLElement | null;
                  await Promise.all(ids.map(async (id) => {
                    try { await apiImpl.setEnabled(id, true); }
                    catch {
                      failed++;
                      // rollback this row
                      setData(d => d ? { ...d, items: d.items.map(it => it.id === id ? { ...it, enabled: false } : it) } : d);
                    }
                  }));
                  if (failed > 0) toast('error', ui.catalog.bulkFailedSummary(failed));
                  else toast('success', ui.catalog.bulkDone(ids.length));
                  requestAnimationFrame(() => lastActive?.focus());
                }}
                onDisable={async () => {
                  if (selected.size === 0) return;
                  const ids = Array.from(selected);
                  setData(d => d ? { ...d, items: d.items.map(it => ids.includes(it.id) ? { ...it, enabled: false } : it) } : d);
                  let failed = 0;
                  const lastActive = document.activeElement as HTMLElement | null;
                  await Promise.all(ids.map(async (id) => {
                    try { await apiImpl.setEnabled(id, false); }
                    catch {
                      failed++;
                      setData(d => d ? { ...d, items: d.items.map(it => it.id === id ? { ...it, enabled: true } : it) } : d);
                    }
                  }));
                  if (failed > 0) toast('error', ui.catalog.bulkFailedSummary(failed));
                  else toast('success', ui.catalog.bulkDone(ids.length));
                  requestAnimationFrame(() => lastActive?.focus());
                }}
                onClear={() => setSelected(new Set())}
              />
              <DataTableV21
                rows={sortedItems}
                toggling={toggling}
                onToggle={onToggle}
                sort={sort}
                onSortChange={(next) => setUrlSort(next)}
                selectedIds={selected}
                onSelectChange={({ type, id, index, checked, shiftKey }) => {
                  setSelected(prev => {
                    const nextSel = new Set(prev);
                    if (type === 'all') {
                      if (checked) sortedItems.forEach((r: CatalogProduct) => nextSel.add(r.id)); else sortedItems.forEach((r: CatalogProduct) => nextSel.delete(r.id));
                      setLastSelectedIndex(null);
                      return nextSel;
                    }
                    if (!id || index == null) return prev;
                    if (shiftKey && lastSelectedIndex != null) {
                      const [start, end] = [lastSelectedIndex, index].sort((a, b) => a - b);
                      for (let i = start; i <= end; i++) {
                        const rid = sortedItems[i].id;
                        if (checked) nextSel.add(rid); else nextSel.delete(rid);
                      }
                    } else {
                      if (checked) nextSel.add(id); else nextSel.delete(id);
                      setLastSelectedIndex(index);
                    }
                    return nextSel;
                  });
                }}
                pageInfo={data.pageInfo}
                onPage={(cursor) => onSetSp({ cursor })}
              />
              {/* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */}
            </>
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

/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
// Deprecated inline table replaced by app/components/DataTable
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */
// Re-export API to preserve prior public surface for tests and callers
/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 --> */
export { createCatalogApi } from './app/lib/createCatalogApi';
/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
export { ToggleCell } from './app/components/DataTable';
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2 --> */
/*
<!-- END RBP GENERATED: tenant-admin-harden -->
*/
