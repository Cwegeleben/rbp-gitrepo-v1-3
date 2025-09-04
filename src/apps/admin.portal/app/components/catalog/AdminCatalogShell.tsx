/*
<!-- BEGIN RBP GENERATED: admin-catalog-v2-2 -->
*/
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useShopHostNavigate } from '../../hooks/useShopHostNavigate';
import { createCatalogApi, type CatalogListResponse, type CatalogProduct } from '../../lib/createCatalogApi';
import { DataTable, type SortKey, type SortDir } from '../DataTable';
import { Toolbar } from '../Toolbar';
import { toast } from '../../../../../shared/ui/toast';
import { LoadingSkeleton } from '../../../LoadingSkeleton';
import { ErrorState } from '../../../ErrorState';

function useSearchParamsState() {
  const { search, pathname } = useLocation();
  const nav = useShopHostNavigate();
  const sp = useMemo(() => new URLSearchParams(search), [search]);
  const set = (next: URLSearchParams) => {
    nav(`${pathname}?${next.toString()}`);
  };
  return [sp, set] as const;
}

export default function AdminCatalogShell({ api }: { api?: ReturnType<typeof createCatalogApi> }) {
  const [sp, setSp] = useSearchParamsState();
  const apiImpl = useMemo(() => api || createCatalogApi(), [api]);

  const q = sp.get('q') || '';
  const enabledParam = sp.get('enabled'); // 'true' | 'false' | null
  const sortParam = sp.get('sort') || '';
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>(() => {
    const [k, d] = sortParam.split(':');
    if ((k === 'vendor' || k === 'title' || k === 'priceBand' || k === 'enabled') && (d === 'asc' || d === 'desc')) return { key: k, dir: d } as any;
    return { key: 'vendor', dir: 'asc' };
  });
  useEffect(() => {
    const [k, d] = (sp.get('sort') || '').split(':');
    if ((k === 'vendor' || k === 'title' || k === 'priceBand' || k === 'enabled') && (d === 'asc' || d === 'desc')) setSort({ key: k as any, dir: d as any });
  }, [sp]);

  const [data, setData] = useState<CatalogListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Debounced search input value
  const [qInput, setQInput] = useState(q);
  const debounceRef = useRef<number | null>(null);
  useEffect(() => setQInput(q), [q]);

  function updateSP(mut: (next: URLSearchParams) => void) {
    const next = new URLSearchParams(sp.toString());
    mut(next);
    setSp(next);
  }

  // Fetch list on URL changes
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await apiImpl.list({ q: q || undefined, enabled: enabledParam || undefined });
        if (!alive) return;
        setData(res);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || 'Failed to load catalog');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [apiImpl, q, enabledParam]);

  // Derived sorted rows (stable)
  const rows = useMemo(() => {
    const items = data?.items || [];
    const stable = items.map((it, idx) => ({ it, idx }));
    const dir = sort.dir === 'asc' ? 1 : -1;
    const cmp = (a: CatalogProduct, b: CatalogProduct) => {
      switch (sort.key) {
        case 'vendor': return (((a.vendor || '').localeCompare(b.vendor || '')) || ((a.title || '').localeCompare(b.title || ''))) * dir;
        case 'title': return (((a.title || '').localeCompare(b.title || '')) || ((a.vendor || '').localeCompare(b.vendor || ''))) * dir;
        case 'priceBand': {
          const pa = Number(a.priceBand ?? Number.NaN), pb = Number(b.priceBand ?? Number.NaN);
          const diff = (!Number.isNaN(pa) && !Number.isNaN(pb)) ? (pa - pb) : String(a.priceBand ?? '').localeCompare(String(b.priceBand ?? ''));
          if (diff !== 0) return diff * dir;
          return ((a.vendor || '').localeCompare(b.vendor || '')) || ((a.title || '').localeCompare(b.title || ''));
        }
        case 'enabled': return (((a.enabled ? 1 : 0) - (b.enabled ? 1 : 0)) * dir) || ((a.vendor || '').localeCompare(b.vendor || '')) || ((a.title || '').localeCompare(b.title || ''));
      }
    };
    stable.sort((a, b) => {
      const c = cmp(a.it, b.it);
      return c !== 0 ? c : (a.idx - b.idx);
    });
    return stable.map(s => s.it);
  }, [data, sort]);

  const onToggle = async (id: string, next: boolean) => {
    setToggling(s => new Set(s).add(id));
    setData(d => d ? { ...d, items: d.items.map(it => it.id === id ? { ...it, enabled: next } : it) } : d);
    const last = document.activeElement as HTMLElement | null;
    try {
      await apiImpl.setEnabled(id, next);
    } catch {
      // rollback single row
      setData(d => d ? { ...d, items: d.items.map(it => it.id === id ? { ...it, enabled: !next } : it) } : d);
      toast('error', 'Update failed — rolled back');
      requestAnimationFrame(() => last?.focus());
    } finally {
      setToggling(s => { const n = new Set(s); n.delete(id); return n; });
    }
  };

  const bulk = {
    enable: async () => {
      if (selected.size === 0) return;
      const ids = Array.from(selected);
      setData(d => d ? { ...d, items: d.items.map(it => ids.includes(it.id) ? { ...it, enabled: true } : it) } : d);
      let failed = 0;
      const last = document.activeElement as HTMLElement | null;
      await Promise.all(ids.map(async (id) => {
        try { await apiImpl.setEnabled(id, true); } catch { failed++; setData(d => d ? { ...d, items: d.items.map(it => it.id === id ? { ...it, enabled: false } : it) } : d); }
      }));
      toast(failed > 0 ? 'error' : 'success', failed > 0 ? `Enabled ${ids.length - failed}/${ids.length}` : `Enabled ${ids.length}`);
      requestAnimationFrame(() => last?.focus());
    },
    disable: async () => {
      if (selected.size === 0) return;
      const ids = Array.from(selected);
      setData(d => d ? { ...d, items: d.items.map(it => ids.includes(it.id) ? { ...it, enabled: false } : it) } : d);
      let failed = 0;
      const last = document.activeElement as HTMLElement | null;
      await Promise.all(ids.map(async (id) => {
        try { await apiImpl.setEnabled(id, false); } catch { failed++; setData(d => d ? { ...d, items: d.items.map(it => it.id === id ? { ...it, enabled: true } : it) } : d); }
      }));
      toast(failed > 0 ? 'error' : 'success', failed > 0 ? `Disabled ${ids.length - failed}/${ids.length}` : `Disabled ${ids.length}`);
      requestAnimationFrame(() => last?.focus());
    }
  };

  return (
    <div>
      <h1>Catalog</h1>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '8px 0' }}>
        <input
          aria-label="Search"
          placeholder="Search"
          value={qInput}
          onChange={(e) => {
            const val = e.target.value;
            setQInput(val);
            if (debounceRef.current) window.clearTimeout(debounceRef.current);
            debounceRef.current = window.setTimeout(() => {
              updateSP(n => { if (val) n.set('q', val); else n.delete('q'); n.delete('cursor'); });
            }, 300);
          }}
        />
        <select aria-label="Sort" value={`${sort.key}:${sort.dir}`} onChange={(e) => {
          const [k, d] = e.target.value.split(':');
          setSort({ key: k as SortKey, dir: d as SortDir });
          updateSP(n => { n.set('sort', e.target.value); });
        }}>
          <option value="vendor:asc">Vendor ↑</option>
          <option value="vendor:desc">Vendor ↓</option>
          <option value="title:asc">Title ↑</option>
          <option value="title:desc">Title ↓</option>
          <option value="priceBand:asc">Price band ↑</option>
          <option value="priceBand:desc">Price band ↓</option>
          <option value="enabled:asc">Enabled ↑</option>
          <option value="enabled:desc">Enabled ↓</option>
        </select>
        <div style={{ display: 'inline-flex', gap: 6 }} aria-label="Enabled filter">
          <button type="button" onClick={() => updateSP(n => { n.set('enabled', 'true'); })} aria-pressed={enabledParam === 'true'}>Enabled</button>
          <button type="button" onClick={() => updateSP(n => { n.set('enabled', 'false'); })} aria-pressed={enabledParam === 'false'}>Disabled</button>
          {(enabledParam === 'true' || enabledParam === 'false') && (
            <button type="button" onClick={() => updateSP(n => { n.delete('enabled'); })}>Clear</button>
          )}
        </div>
      </div>

      <div role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}>
        {selected.size} selected
      </div>

      {loading && <LoadingSkeleton rows={6} />}
      {error && <ErrorState message={error} />}
      {!loading && !error && (
        data && data.items.length > 0 ? (
          <>
            <Toolbar
              selectedCount={selected.size}
              totalCount={data.pageInfo?.total ?? data.items.length}
              sortLabel={`${sort.key} ${sort.dir}`}
              onEnable={bulk.enable}
              onDisable={bulk.disable}
              onClear={() => setSelected(new Set())}
            />
            <DataTable
              rows={rows}
              toggling={toggling}
              onToggle={onToggle}
              sort={sort}
              onSortChange={(next) => {
                setSort(next);
                updateSP(n => n.set('sort', `${next.key}:${next.dir}`));
              }}
              selectedIds={selected}
              onSelectChange={({ type, id, index, checked, shiftKey }) => {
                setSelected(prev => {
                  const next = new Set(prev);
                  if (type === 'all') {
                    if (checked) rows.forEach(r => next.add(r.id)); else rows.forEach(r => next.delete(r.id));
                    return next;
                  }
                  if (!id) return prev;
                  if (checked) next.add(id); else next.delete(id);
                  return next;
                });
              }}
              pageInfo={data.pageInfo}
              onPage={() => { /* preserve, but page not implemented in shell */ }}
            />
          </>
        ) : (
          <div>No results</div>
        )
      )}
    </div>
  );
}
/*
<!-- END RBP GENERATED: admin-catalog-v2-2 -->
*/
