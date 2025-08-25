// <!-- BEGIN RBP GENERATED: catalog-picker-v2 -->
// rbp-catalog v1.1.0 — Catalog Picker v2 (Storefront)
// Default export: function mount(rootEl, { ctx, navigate }?)
// - Deep link via ?type=&slot=
// - Listen to rbp:start-part-selection { type, slotId }
// - Add to Build with optimistic PATCH to Builds API; rollback on failure
// - Dispatch rbp:part-selected on success

import { parseQuery, writeQuery } from './utils/query.js';
import { makeAddPatch, handleStartSelectionEvent, announceSelected } from './hooks/useCatalogPicker.js';

const API = {
  async get(url){ const r = await fetch(url, { cache: 'no-store' }); if (!r.ok) throw new Error(`GET ${url} ${r.status}`); return r.json(); },
  async send(url, method, body){ const r = await fetch(url, { method, headers: { 'content-type':'application/json' }, cache: 'no-store', body: body ? JSON.stringify(body) : undefined }); if (!r.ok) throw new Error(`${method} ${url} ${r.status}`); return r.status===204 ? null : r.json(); }
};

function ensureToaster(root){
  let host = root.querySelector('.rbp-toast-host');
  if (!host) { host = document.createElement('div'); host.className = 'rbp-toast-host'; host.style.position='fixed'; host.style.top='16px'; host.style.right='16px'; host.style.zIndex='9999'; root.appendChild(host); }
  let live = root.querySelector('[aria-live]');
  if (!live) { live = document.createElement('div'); live.setAttribute('aria-live','polite'); live.setAttribute('aria-atomic','true'); live.style.position='absolute'; live.style.width='1px'; live.style.height='1px'; live.style.overflow='hidden'; live.style.clipPath='inset(50%)'; root.appendChild(live); }
  return { host, live };
}
function toast(root, kind, text){ const { host, live } = ensureToaster(root); const el = document.createElement('div'); el.style.marginBottom='8px'; el.style.padding='8px 10px'; el.style.background='#fff'; el.style.border='1px solid #ddd'; el.style.boxShadow='0 2px 6px rgba(0,0,0,0.1)'; el.textContent = `[${kind}] ${text}`; host.appendChild(el); live.textContent = text; setTimeout(()=>{ try { host.removeChild(el); } catch {} }, 3000); }

function h(tag, attrs = {}, children = []){ const el = document.createElement(tag); for (const [k,v] of Object.entries(attrs||{})) { if (k==='class') el.className=v; else if (k==='style' && v && typeof v === 'object') Object.assign(el.style, v); else if (k.startsWith('on') && typeof v==='function') el.addEventListener(k.slice(2).toLowerCase(), v); else if (k==='dataset' && v) { for (const [dk,dv] of Object.entries(v)) el.dataset[dk]=dv; } else if (v!=null) el.setAttribute(k,String(v)); } for (const c of ([]).concat(children)) { if (c==null) continue; if (c instanceof Node) el.appendChild(c); else el.appendChild(document.createTextNode(String(c))); } return el; }

function buildQuery(filters){ try { const url = new URL(window.location.href); writeQuery(url, filters); window.history.replaceState({}, '', url.toString()); } catch {} }

export default function mount(root){
  root.innerHTML = '';
  const container = h('div', { class: 'rbp-catalog-v2', style: { fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,sans-serif' } });
  root.appendChild(container);

  const state = { filters: { type: '', vendor: '', tag: '', q: '', page: 1, sort: 'title:asc', slot: '' }, loading: false, results: [], pageInfo: { hasNext: false, hasPrev: false }, activeBuildId: null };
  function setState(p){ Object.assign(state, p); render(); }

  function getFiltersFromUrl(){ try { const u = new URL(window.location.href); const f = parseQuery(u.search); return { ...state.filters, ...f }; } catch { return state.filters; } }
  state.filters = getFiltersFromUrl();

  function onStartSelection(e){ const d = e?.detail || {}; const nf = handleStartSelectionEvent(state.filters, d); setState({ filters: nf }); buildQuery(nf); focusTableSoon(); toast(root,'info', `Selecting ${nf.type || 'part'}…`); }
  window.addEventListener('rbp:start-part-selection', onStartSelection);

  function focusTableSoon(){ setTimeout(()=>{ const tbl = container.querySelector('table'); try { tbl?.focus?.(); } catch{} }, 30); }

  async function load(){ setState({ loading: true }); try { const { q, type, vendor, tag, page, sort } = state.filters; const qs = new URLSearchParams({ q: q||'', type: type||'', vendor: vendor||'', tag: tag||'', page: String(page||1), sort: sort||'' }); const res = await API.get(`/apps/proxy/api/catalog/search?${qs.toString()}`); const items = Array.isArray(res?.items) ? res.items : (Array.isArray(res) ? res : []); const pi = res?.pageInfo || { hasNext: false, hasPrev: false }; setState({ results: items, pageInfo: pi, loading: false }); const n = items.length|0; const { live } = ensureToaster(root); live.textContent = `Loaded ${n} results`; } catch { setState({ loading: false }); toast(root,'error','Failed to load catalog'); } }

  async function addToBuild(product, btn){ if (btn) { btn.disabled = true; btn.setAttribute('aria-disabled','true'); }
    try {
      let buildId = state.activeBuildId;
      if (!buildId) {
        // attempt to infer active build via last event or list API
        const list = await API.get('/apps/proxy/api/builds');
        buildId = list?.[0]?.id || list?.items?.[0]?.id || null;
      }
      if (!buildId) throw new Error('No active build');
      const build = await API.get(`/apps/proxy/api/builds/${buildId}`);
      const { items: nextItems } = makeAddPatch(Array.isArray(build?.items) ? build.items : [], state.filters.slot || null, { id: product.id, handle: product.handle, title: product.title, type: state.filters.type || product.type, variantId: product.variantId });
      toast(root,'info','Added to build');
      await API.send(`/apps/proxy/api/builds/${buildId}`, 'PATCH', { items: nextItems });
      announceSelected({ buildId, slotId: state.filters.slot || null, type: state.filters.type || product.type, productId: product.id || product.handle, variantId: product.variantId || null });
      try { window.dispatchEvent(new CustomEvent('rbp:build-updated', { detail: { id: buildId } })); } catch {}
    } catch (e) {
      toast(root,'error','Add failed — rolled back');
    } finally { if (btn) { btn.disabled = false; btn.setAttribute('aria-disabled','false'); } }
  }

  function render(){
    container.innerHTML = '';
    // Filter bar
    const f = state.filters;
    const bar = h('div', { class: 'rbp-filterbar', style: { display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap', marginBottom:'8px' } }, [
      h('label', {}, ['Type ', h('input', { value: f.type, 'aria-label':'Type', oninput: (e)=>{ f.type = e.target.value; setState({ filters: { ...f, page: 1 } }); buildQuery(state.filters); } }) ]),
      h('label', {}, ['Vendor ', h('input', { value: f.vendor, 'aria-label':'Vendor', oninput: (e)=>{ f.vendor = e.target.value; setState({ filters: { ...f, page: 1 } }); buildQuery(state.filters); } }) ]),
      h('label', {}, ['Tag ', h('input', { value: f.tag, 'aria-label':'Tag', oninput: (e)=>{ f.tag = e.target.value; setState({ filters: { ...f, page: 1 } }); buildQuery(state.filters); } }) ]),
      h('label', {}, ['Search ', h('input', { value: f.q, 'aria-label':'Search', oninput: (e)=>{ f.q = e.target.value; setState({ filters: { ...f, page: 1 } }); buildQuery(state.filters); } }) ]),
      h('span', {}, [`Slot: ${f.slot ? f.slot : '—'}`]),
    ]);
    container.appendChild(bar);

    // Table
    const tbl = h('table', { tabindex: '0', style: { width: '100%', borderCollapse: 'collapse' } });
    const thead = h('thead');
    const hdr = h('tr');
    function sortBtn(label, key){ const b = h('button', { 'aria-label': `Sort by ${label}`, onclick: ()=>{ const [k,dir] = (state.filters.sort||'title:asc').split(':'); const ndir = k===key && dir==='asc' ? 'desc':'asc'; const sort = `${key}:${ndir}`; setState({ filters: { ...state.filters, sort } }); buildQuery({ ...state.filters, sort }); load(); } }, label); return b; }
    hdr.appendChild(h('th', {}, [sortBtn('Title','title')]));
    hdr.appendChild(h('th', {}, [sortBtn('Vendor','vendor')]));
    hdr.appendChild(h('th', {}, [sortBtn('Price','price')]));
    hdr.appendChild(h('th', {}, 'Tags'));
    hdr.appendChild(h('th', {}, 'Actions'));
    thead.appendChild(hdr);
    tbl.appendChild(thead);
    const tb = h('tbody');
    (state.results||[]).forEach(p => {
      tb.appendChild(h('tr', {}, [
        h('td', { style: { borderTop: '1px solid #eee', padding: '4px' } }, p.title || p.handle || ''),
        h('td', { style: { borderTop: '1px solid #eee', padding: '4px' } }, p.vendor || ''),
        h('td', { style: { borderTop: '1px solid #eee', padding: '4px' } }, p.price != null ? `$${p.price}` : ''),
        h('td', { style: { borderTop: '1px solid #eee', padding: '4px' } }, Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '')),
        h('td', { style: { borderTop: '1px solid #eee', padding: '4px' } }, [ h('button', { 'aria-label': 'Add to Build', onclick: (e)=> addToBuild(p, e.currentTarget) }, 'Add') ])
      ]));
    });
    tbl.appendChild(tb);
    container.appendChild(tbl);

    // Paging
    const pager = h('div', { style: { marginTop: '8px', display: 'flex', gap: '8px' } }, [
      h('button', { disabled: !state.pageInfo?.hasPrev, 'aria-disabled': String(!state.pageInfo?.hasPrev), onclick: ()=>{ if (!state.pageInfo?.hasPrev) return; const page = Math.max(1, (state.filters.page||1)-1); const filters = { ...state.filters, page }; setState({ filters }); buildQuery(filters); load(); } }, 'Prev'),
      h('button', { disabled: !state.pageInfo?.hasNext, 'aria-disabled': String(!state.pageInfo?.hasNext), onclick: ()=>{ if (!state.pageInfo?.hasNext) return; const page = (state.filters.page||1)+1; const filters = { ...state.filters, page }; setState({ filters }); buildQuery(filters); load(); } }, 'Next')
    ]);
    container.appendChild(pager);
  }

  // Listen for active build id from other modules
  window.addEventListener('rbp:active-build', (e)=>{ const id = e?.detail?.id; if (id) state.activeBuildId = id; });

  // Initial
  render();
  load();

  return { unmount(){ try { window.removeEventListener('rbp:start-part-selection', onStartSelection); root.innerHTML=''; } catch{} } };
}
// <!-- END RBP GENERATED: catalog-picker-v2 -->
