// <!-- BEGIN RBP GENERATED: builds-templates-v1 -->
import { useEffect, useMemo, useState } from 'react';
import { normalizeManifest, type TemplateEntry } from '../utils/manifest';
import { getUrlState, setUrlState } from '../utils/urlState';

export type FilterState = { q: string; species: string; build: string; sort: 'title'|'recency'; view: 'grid'|'list' };

export function useTemplates(){
  const [all, setAll] = useState<TemplateEntry[]>([]);
  const [error, setError] = useState<Error|null>(null);
  const [loading, setLoading] = useState(true);
  const [state, setStateInner] = useState<FilterState>(()=>({ q: '', species: '', build: '', sort: 'title', view: 'grid', ...getUrlState() } as any));

  function setState(p: Partial<FilterState>){
    setStateInner(s=>{ const next = { ...s, ...p }; setUrlState(next); return next; });
  }

  useEffect(()=>{
    let alive = true;
    (async()=>{
      try {
        setLoading(true);
        const raw = await import('../manifest.json');
        const ok = normalizeManifest((raw as any).default || raw);
        if (!alive) return;
        setAll(ok.templates);
      } catch (e:any) { if (alive) setError(e as any); }
      finally { if (alive) setLoading(false); }
    })();
    return ()=>{ alive = false; };
  },[]);

  const filtered = useMemo(()=>{
    const q = state.q.trim().toLowerCase();
    let arr = all.slice();
    if (state.species) arr = arr.filter(t => (t.species||'') === state.species);
    if (state.build) arr = arr.filter(t => (t.build||'') === state.build);
    if (q) arr = arr.filter(t => (t.title||'').toLowerCase().includes(q) || (t.notes||'').toLowerCase().includes(q));
    if (state.sort === 'title') arr.sort((a,b)=> (a.title||'').localeCompare(b.title||''));
    if (state.sort === 'recency') arr.sort((a,b)=> (b._recency||0) - (a._recency||0));
    return arr;
  },[all,state]);

  async function applyTemplate(t: TemplateEntry){
    // Create new build with items from template; on success, dispatch active-build and toast
    const items = (t.slots||[]).map(s => ({ slot: s.type || 'Unknown', label: s.productId || s.variantId || 'Item', productId: s.productId, variantId: s.variantId, quantity: s.qty ?? 1 }));
    try {
      const r = await fetch('/apps/proxy/api/builds', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: t.title, items }) });
      if (!r.ok) throw new Error(`Create failed: ${r.status}`);
      const created = await r.json();
      try { window.dispatchEvent(new CustomEvent('rbp:active-build', { detail: { id: created?.id } })); } catch {}
      announce(`Created build from “${t.title}”`);
      return created;
    } catch (e){ announce(`Failed to create from “${t.title}”`); throw e; }
  }

  function announce(msg: string){
    try {
      const live = document.querySelector('[data-rbp-templates-live]') as HTMLElement | null;
      if (live) { live.textContent = msg; return; }
      const el = document.createElement('div'); el.setAttribute('aria-live','polite'); el.style.position='absolute'; el.style.width='1px'; el.style.height='1px'; el.style.overflow='hidden'; el.style.clip='rect(1px,1px,1px,1px)'; el.dataset.rbpTemplatesLive = '1'; el.textContent = msg; document.body.appendChild(el); setTimeout(()=>{ try { el.remove(); } catch {} }, 2000);
    } catch {}
  }

  return { state, setState, templates: all, filtered, error, loading, applyTemplate };
}
// <!-- END RBP GENERATED: builds-templates-v1 -->
