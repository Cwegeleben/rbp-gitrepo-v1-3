// <!-- BEGIN RBP GENERATED: builds-gallery-bulk-v1 -->
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiGet, apiSend, safeApiSend } from '../../../../shared/sdk/client.js';
import { toast } from '../../../../shared/ui/toast.js';
import { stableSort } from '../utils/sorters.js';
import { getUrlState, setUrlState } from '../utils/urlState.js';
import { rangeBetween } from '../utils/selection.js';

export type Build = { id: string; title?: string; items?: any[]; updatedAt?: string; handle?: string };
type State = { q: string; sort: string; view: 'grid'|'list'; buildId?: string };

export function useBuildsGallery(){
  const url = getUrlState();
  const [state, setState] = useState<State>({ q: url.q||'', sort: url.sort||'updated:desc', view: (url.view==='list'?'list':'grid'), buildId: url.buildId });
  const [list, setList] = useState<Build[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null|string>(null);

  // Selection state
  const [selectedIds, setSelected] = useState<Set<string>>(new Set());
  const lastIndexRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await apiGet<any>('/apps/proxy/api/builds');
      const items: Build[] = Array.isArray(res?.items) ? res.items : (Array.isArray(res) ? res : []);
      setList(items);
    } catch (e: any) { setError(String(e)); }
    finally { setLoading(false); }
  }, []);

  useEffect(()=>{ refresh(); }, [refresh]);

  const filteredSorted = useCallback(() => {
    const q = state.q.trim().toLowerCase();
    let items = list.filter(b => !q || (b.title||'').toLowerCase().includes(q));
    items = stableSort(items, state.sort);
    return items;
  }, [list, state.q, state.sort]);

  const search = useCallback((q: string) => { setState(s => { const ns = { ...s, q }; setUrlState(ns); return ns; }); }, []);
  const sort = useCallback((sort: string) => { setState(s => { const ns = { ...s, sort }; setUrlState(ns); return ns; }); }, []);
  const toggleView = useCallback(() => { setState(s => { const nextView: 'grid'|'list' = s.view==='grid'?'list':'grid'; const ns: State = { ...s, view: nextView }; setUrlState(ns); return ns; }); }, []);

  // Selection helpers
  const clearSelection = useCallback(()=> setSelected(new Set()), []);
  const allSelected = useMemo(()=> list.length>0 && selectedIds.size === filteredSorted().length, [selectedIds, list, state.q, state.sort]);
  const someSelected = useMemo(()=> selectedIds.size>0 && !allSelected, [selectedIds, allSelected]);

  const toggleSelect = useCallback((b: Build, index: number, withShift?: boolean) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (withShift && lastIndexRef.current != null) {
        const range = rangeBetween(lastIndexRef.current, index);
        const items = filteredSorted();
        for (const i of range) { const id = items[i]?.id; if (id) next.add(id); }
      } else {
        if (next.has(b.id)) next.delete(b.id); else next.add(b.id);
        lastIndexRef.current = index;
      }
      return next;
    });
  }, [filteredSorted]);

  const toggleSelectAll = useCallback(()=>{
    setSelected(prev => {
      const items = filteredSorted();
      if (prev.size === items.length) return new Set();
      return new Set(items.map(b => b.id));
    });
  }, [filteredSorted]);

  // Actions
  const open = useCallback((b: Build) => {
    try { const u = new URL(window.location.href); u.searchParams.set('buildId', b.id); history.replaceState({}, '', u.toString()); } catch {}
    window.dispatchEvent(new CustomEvent('rbp:active-build', { detail: { id: b.id } }));
    toast('success', 'Opened build');
  }, []);

  const duplicate = useCallback(async (b: Build) => {
    const optimisticTitle = (b.title||'Untitled') + ' (Copy)';
    const optimistic: Build = { id: 'optimistic-' + Math.random().toString(36).slice(2), title: optimisticTitle, items: b.items||[], updatedAt: new Date().toISOString() } as any;
    setList((cur)=> [optimistic, ...cur]);
    try {
      const created = await apiSend('/apps/proxy/api/builds', 'POST', { title: optimisticTitle, items: b.items||[] });
      if (created?.id) {
        toast('success', 'Build duplicated');
        setList((cur) => [created, ...cur.filter(x => x.id !== optimistic.id)]);
        open(created);
      } else {
        throw new Error('Create failed');
      }
    } catch {
      setList((cur)=> cur.filter(x => x.id !== optimistic.id));
      toast('error', 'Duplicate failed — rolled back');
    }
  }, [open]);

  const confirm = useRef<{ id: string; title: string }|null>(null);
  const confirmDelete = useCallback((b: Build) => { confirm.current = { id: b.id, title: b.title||'Untitled' }; }, []);
  const cancelConfirm = useCallback(() => { confirm.current = null; }, []);

  const doDelete = useCallback(async () => {
    const c = confirm.current; if (!c) return; const id = c.id;
    const before = list.slice();
    confirm.current = null;
    setList(before.filter(b => b.id !== id));
    try {
      await apiSend(`/apps/proxy/api/builds/${id}`, 'DELETE');
      toast('success', 'Build deleted');
    } catch {
      setList(before);
      toast('error', 'Delete failed — rolled back');
    }
  }, [list]);

  const exportJson = useCallback((b: Build) => {
    const data = JSON.stringify({ id: b.id, name: b.title, items: b.items||[] }, null, 2);
    const a = document.createElement('a');
    const blob = new Blob([data], { type: 'application/json' });
    a.href = URL.createObjectURL(blob);
    a.download = `build-${(b.handle||b.id||'x')}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('success', 'Exported');
  }, []);

  const share = useCallback(async (b: Build) => {
    const evt = new CustomEvent('rbp:share:open', { detail: { buildId: b.id }, cancelable: true });
    const handled = !window.dispatchEvent(evt);
    if (handled) return;
    try {
      const r = await apiGet<any>(`/apps/rbp/api/share/mint?buildId=${encodeURIComponent(b.id)}`);
      const token = r?.token || `UNSIGNED.${b.id}`;
      const u = new URL(window.location.href); u.searchParams.set('share', token);
      const url = u.toString();
      await (navigator as any).clipboard?.writeText?.(url);
      const expiresAt = r?.expiresAt ? new Date(r.expiresAt) : new Date(Date.now() + 7*864e5);
      const days = Math.max(0, Math.ceil((expiresAt.getTime()-Date.now())/864e5));
      toast('success', `Share link copied${days?` — expires in ${days}d`:''}`);
    } catch {
      toast('error', 'Share mint failed');
    }
  }, []);

  // Inline rename
  const renameInline = useCallback(async (b: Build, title: string) => {
    const before = list.slice();
    setList(cur => cur.map(x => x.id===b.id ? { ...x, title } : x));
    const res = await safeApiSend(`/apps/proxy/api/builds/${b.id}`, 'PATCH', { title });
    if (res.ok) {
      toast('success', 'Renamed');
    } else {
      setList(before);
      toast('error', 'Rename failed — rolled back');
    }
  }, [list]);

  // Bulk
  const [bulkConfirm, setBulkConfirm] = useState<{ kind: 'delete' }|null>(null);
  const bulkDeleteConfirm = useCallback(()=>{ setBulkConfirm({ kind: 'delete' }); }, []);
  const bulkCancel = useCallback(()=>{ setBulkConfirm(null); }, []);

  const bulkDuplicate = useCallback(async ()=>{
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    toast('info', `Duplicating ${ids.length}…`);
    const source = list.filter(b => ids.includes(b.id));
    const optimistic = source.map(b => ({ id: 'optim-'+Math.random().toString(36).slice(2), title: (b.title||'Untitled')+' (Copy)', items: b.items||[], updatedAt: new Date().toISOString() } as Build));
    setList(cur => [...optimistic, ...cur]);
    const results = await Promise.all(optimistic.map((o, i) => safeApiSend('/apps/proxy/api/builds', 'POST', { title: o.title, items: source[i]?.items||[] })));
    const created: Build[] = [];
    results.forEach((r, i)=>{ if (r.ok && (r.data as any)?.id){ created.push(r.data as any); } });
    setList(cur => [
      ...created,
      ...cur.filter(x => !optimistic.some(o=>o.id===x.id))
    ]);
    if (created.length === ids.length) toast('success', `Duplicated ${created.length}`);
    else toast('error', `Duplicated ${created.length}/${ids.length} — some failed`);
  }, [selectedIds, list]);

  const bulkDoDelete = useCallback(async ()=>{
    const ids = Array.from(selectedIds);
    setBulkConfirm(null);
    if (ids.length === 0) return;
    const before = list.slice();
    setList(before.filter(b => !ids.includes(b.id)));
    const results = await Promise.all(ids.map(id => safeApiSend(`/apps/proxy/api/builds/${id}`, 'DELETE')));
    const ok = results.filter(r=>r.ok).length;
    if (ok !== ids.length) {
      // rollback failed ones
      const failedIds = ids.filter((_,i)=> !results[i].ok);
      const failedMap = new Set(failedIds);
      setList(cur => [...cur, ...before.filter(b => failedMap.has(b.id))]);
      toast('error', `Deleted ${ok}/${ids.length} — restored ${failedIds.length}`);
    } else {
      toast('success', `Deleted ${ok}`);
    }
    clearSelection();
  }, [selectedIds, list, clearSelection]);

  const bulkShare = useCallback(async ()=>{
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    // Try event-based open
    let handledCount = 0;
    for (const id of ids) {
      const evt = new CustomEvent('rbp:share:open', { detail: { buildId: id }, cancelable: true });
      const handled = !window.dispatchEvent(evt);
      if (handled) handledCount++;
    }
    if (handledCount === ids.length) return;
    // Fallback: mint links and copy multiline
    const urls: string[] = [];
    for (const id of ids) {
      try {
        const r = await apiGet<any>(`/apps/rbp/api/share/mint?buildId=${encodeURIComponent(id)}`);
        const token = r?.token || `UNSIGNED.${id}`;
        const u = new URL(window.location.href); u.searchParams.set('share', token);
        urls.push(u.toString());
      } catch {
        // skip
      }
    }
    if (urls.length) {
      await (navigator as any).clipboard?.writeText?.(urls.join('\n'));
      toast('success', `Copied ${urls.length} links`);
    } else {
      toast('error', 'Failed to mint links');
    }
  }, [selectedIds]);

  const bulkExport = useCallback(async ()=>{
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const items = list.filter(b => ids.includes(b.id)).map(b => ({ id: b.id, name: b.title, items: b.items||[] }));
    const data = JSON.stringify(items, null, 2);
    const a = document.createElement('a');
    const blob = new Blob([data], { type: 'application/json' });
    a.href = URL.createObjectURL(blob);
    const d = new Date();
    const pad = (n:number)=> String(n).padStart(2,'0');
    const filename = `builds-export-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}.json`;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('success', `Exported ${ids.length}`);
  }, [selectedIds, list]);

  // URL persistence
  useEffect(()=>{ setUrlState(state); }, [state.q, state.sort, state.view, state.buildId]);

  const createNew = useCallback(async () => {
    try {
      const created = await apiSend('/apps/proxy/api/builds', 'POST', { title: 'Untitled Build', items: [] });
      if (created?.id) { setList(l => [created, ...l]); open(created); }
    } catch { toast('error', 'Create failed'); }
  }, [open]);

  return {
    state, setState: (p: Partial<State>) => setState(s => ({ ...s, ...p })),
    list, loading, error,
    refresh,
    filteredSorted,
    search, sort, toggleView,
    open, duplicate, confirmDelete, cancelConfirm, doDelete,
    exportJson, share,
    createNew,
    // selection
    selectedIds, toggleSelect, toggleSelectAll, clearSelection, allSelected, someSelected,
    // inline rename
    renameInline,
    // bulk
  bulkConfirm,
    bulkDeleteConfirm, bulkCancel, bulkDoDelete,
    bulkDuplicate, bulkShare, bulkExport,
  };
}
// <!-- END RBP GENERATED: builds-gallery-bulk-v1 -->
