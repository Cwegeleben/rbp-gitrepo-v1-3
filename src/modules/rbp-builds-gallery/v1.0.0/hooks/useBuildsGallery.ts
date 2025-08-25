// <!-- BEGIN RBP GENERATED: builds-gallery-v1 -->
import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiGet, apiSend } from '../../../../shared/sdk/client.js';
import { toast } from '../../../../shared/ui/toast.js';
import { stableSort } from '../utils/sorters.js';
import { getUrlState, setUrlState } from '../utils/urlState.js';

export type Build = { id: string; title?: string; items?: any[]; updatedAt?: string; handle?: string };

type State = { q: string; sort: string; view: 'grid'|'list'; buildId?: string };

export function useBuildsGallery(){
  const url = getUrlState();
  const [state, setState] = useState<State>({ q: url.q||'', sort: url.sort||'updated:desc', view: (url.view==='list'?'list':'grid'), buildId: url.buildId });
  const [list, setList] = useState<Build[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null|string>(null);
  const [confirm, setConfirm] = useState<{ id: string; title: string }|null>(null);

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

  // Actions
  const open = useCallback((b: Build) => {
    try { const u = new URL(window.location.href); u.searchParams.set('buildId', b.id); history.replaceState({}, '', u.toString()); } catch {}
  window.dispatchEvent(new CustomEvent('rbp:active-build', { detail: { id: b.id } }));
  toast('success', 'Opened build');
  }, []);

  const duplicate = useCallback(async (b: Build) => {
    const optimisticTitle = (b.title||'Untitled') + ' (Copy)';
    const optimistic: Build = { id: 'optimistic', title: optimisticTitle, items: b.items||[], updatedAt: new Date().toISOString() } as any;
    setList((cur)=> [optimistic, ...cur]);
    try {
      const created = await apiSend('/apps/proxy/api/builds', 'POST', { title: optimisticTitle, items: b.items||[] });
      if (created?.id) {
  toast('success', 'Build duplicated');
        setList((cur) => [created, ...cur.filter(x => x!==optimistic)]);
        // select new
        open(created);
      } else {
        throw new Error('Create failed');
      }
    } catch {
      setList((cur)=> cur.filter(x => x!==optimistic));
  toast('error', 'Duplicate failed — rolled back');
    }
  }, [open]);

  const confirmDelete = useCallback((b: Build) => { setConfirm({ id: b.id, title: b.title||'Untitled' }); }, []);
  const cancelConfirm = useCallback(() => { setConfirm(null); }, []);

  const doDelete = useCallback(async () => {
    if (!confirm) return; const id = confirm.id;
    const before = list.slice();
    setConfirm(null);
    setList(before.filter(b => b.id !== id));
    try {
  await apiSend(`/apps/proxy/api/builds/${id}`, 'DELETE');
  toast('success', 'Build deleted');
    } catch {
  setList(before);
  toast('error', 'Delete failed — rolled back');
    }
  }, [confirm, list]);

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
    const handled = !window.dispatchEvent(evt); // false => preventDefault called by listener
    if (handled) return;
    // Fallback: mint via existing endpoint (v1.3.0 path)
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
    confirm,
    createNew,
  };
}
// <!-- END RBP GENERATED: builds-gallery-v1 -->
