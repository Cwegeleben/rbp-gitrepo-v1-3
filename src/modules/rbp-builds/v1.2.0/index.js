// <!-- BEGIN RBP GENERATED: builds-readiness-v1 -->
// rbp-builds v1.2.0 — Build Selector Panel v2 + Readiness & Fix-It v1 (Storefront module)
// Contract:
// - default export: function mount(rootEl, { ctx, navigate }?)
// - Renders Saved Builds bar + actions + slots grouping, plus Readiness summary & badges
// - Emits/custom events:
//    • 'rbp:active-build' => detail: { id }
//    • 'rbp:build-updated' => detail: { id }
//    • 'rbp:start-part-selection' => detail: { type, slotId }
// - Listens to: 'rbp:active-build', 'rbp:build-updated', 'rbp:part-selected' (debounced dry-run)

  const API = {
    async get(url, init){ const r = await fetch(url, { cache: 'no-store', ...(init||{}) }); if (!r.ok) throw new Error(`GET ${url} ${r.status}`); return r.json(); },
    async send(url, method, body){ const r = await fetch(url, { method, headers: { 'content-type': 'application/json' }, cache: 'no-store', body: body ? JSON.stringify(body) : undefined }); if (!r.ok) throw new Error(`${method} ${url} ${r.status}`); return r.status===204 ? null : r.json(); }
  };

  function ensureToaster(){
    let host = document.getElementById('rbp-toast-host');
    if (!host) { host = document.createElement('div'); host.id = 'rbp-toast-host'; host.style.position = 'fixed'; host.style.top = '16px'; host.style.right = '16px'; host.style.zIndex = '9999'; document.body.appendChild(host); }
    let live = document.getElementById('rbp-aria-live');
    if (!live) { live = document.createElement('div'); live.id = 'rbp-aria-live'; live.setAttribute('aria-live','polite'); live.setAttribute('aria-atomic','true'); live.style.position='absolute'; live.style.width='1px'; live.style.height='1px'; live.style.overflow='hidden'; live.style.clipPath='inset(50%)'; document.body.appendChild(live); }
    return { host, live };
  }
  function toast(kind, text){ const { host, live } = ensureToaster(); const card = document.createElement('div'); card.style.marginBottom='8px'; card.style.padding='10px 12px'; card.style.background='#fff'; card.style.border='1px solid #ddd'; card.style.boxShadow='0 2px 6px rgba(0,0,0,0.1)'; card.style.fontFamily='system-ui,-apple-system,Segoe UI,Roboto,sans-serif'; card.textContent = `[${kind}] ${text}`; host.appendChild(card); live.textContent = text; setTimeout(()=>{ if(card.parentElement===host) host.removeChild(card); }, 3200); }

  function h(tag, props = {}, children = []){
    const el = document.createElement(tag);
    for (const [k,v] of Object.entries(props||{})) {
      if (k === 'class') el.className = v;
      else if (k === 'style' && v && typeof v === 'object') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'dataset' && v && typeof v === 'object') { for (const [dk,dv] of Object.entries(v)) el.dataset[dk] = dv; }
      else if (v != null) el.setAttribute(k, String(v));
    }
    for (const c of ([]).concat(children)) { if (c == null) continue; if (c instanceof Node) el.appendChild(c); else el.appendChild(document.createTextNode(String(c))); }
    return el;
  }

  function groupItems(items){ const g = new Map(); (items||[]).forEach(it => { const t = it.type || it.slotType || 'Other'; if (!g.has(t)) g.set(t, []); g.get(t).push(it); }); return g; }

  // --- Readiness mapping helpers ---
  const HINT_MAP = {
    MISSING_VARIANT: { label: 'Needs selection', severity: 'error' },
    NO_PRICE: { label: 'No price', severity: 'warn' },
  };
  function mapHint(h){ const m = HINT_MAP[h?.type]; return { code: h?.type || 'UNKNOWN', label: m?.label || (h?.type || 'UNKNOWN'), severity: m?.severity || 'info', slotId: h?.slotId, slotType: h?.slotType, message: h?.message, sku: h?.sku }; }

  // --- Readiness section ---
  function renderReadinessHeader(state){
    const box = h('div', { class: 'rbp-readiness', style: { border: '1px solid #eee', borderRadius: '6px', padding: '8px', marginTop: '8px' } });
    const title = h('div', { style: { fontWeight: '600', marginBottom: '4px' } }, 'Build Readiness');
    const status = h('div', { id: 'rbp-readiness-status', 'aria-live': 'polite', style: { minHeight: '1.2em' } }, '');
    const totals = h('div', { class: 'rbp-readiness-totals', style: { marginTop: '6px' } });
    const actions = h('div', { style: { marginTop: '6px', display: 'flex', gap: '8px' } });
    const btnRetry = h('button', { 'aria-label': 'Retry readiness check' }, 'Retry');
    btnRetry.addEventListener('click', () => state.readiness?.retry?.());
    actions.appendChild(btnRetry);
    box.appendChild(title); box.appendChild(status); box.appendChild(totals); box.appendChild(actions);

    function update(){
      const r = state.readiness;
      if (!r) return;
      const live = ensureToaster().live;
      if (r.loading) { status.textContent = 'Checking build…'; live.textContent = 'Checking build…'; }
      else if (r.error) { status.textContent = 'Network error — showing last known result'; live.textContent = 'Network error'; }
      else if (r.issuesCount > 0) { status.textContent = 'Issues found'; live.textContent = 'Issues found'; }
      else { status.textContent = 'Ready to package'; live.textContent = 'Ready to package'; }
      totals.innerHTML = '';
      const t = r.totals; if (t) { const cur = t.currency || 'USD'; const fmt = (v)=> typeof v === 'number' ? new Intl.NumberFormat(undefined,{ style:'currency', currency: cur }).format(v/100) : null; const rows = [ ['Subtotal', fmt(t.subtotal)], ['Est. Tax', fmt(t.estTax)], ['Total', fmt(t.total)] ].filter(x=>x[1]); const tbl = h('table', { style: { width:'100%', borderCollapse:'collapse' } }, [ h('tbody', {}, rows.map(([k,v]) => h('tr', {}, [ h('td', { style: { padding: '2px 4px', opacity: '0.8' } }, k), h('td', { style: { padding: '2px 4px', textAlign: 'right' } }, v) ]))) ]); totals.appendChild(tbl); }
    }
    box.update = update;
    return box;
  }

  function renderSlotBadgeFor(hints){
    if (!hints || !hints.length) return null;
    const worst = hints.find(h=>h.severity==='error') || hints.find(h=>h.severity==='warn') || hints[0];
    const color = worst.severity==='error' ? '#fee2e2' : worst.severity==='warn' ? '#fff7ed' : '#eff6ff';
    const txt = worst.label;
    return h('span', { class: 'rbp-badge', style: { marginLeft: '6px', padding: '2px 6px', borderRadius: '999px', background: color, border: '1px solid #ddd', fontSize: '12px' } }, txt);
  }

  function renderSavedBuildsBar(state, setState){
    const { builds, activeId } = state;
    const wrap = h('div', { class: 'rbp-savedbar', style: { display: 'flex', gap: '8px', overflowX: 'auto', padding: '6px 2px' } });
    // Add New
    const btnAdd = h('button', { 'aria-label': 'Add New List' }, 'Add New');
    btnAdd.addEventListener('click', async () => {
      btnAdd.disabled = true;
      try {
        const created = await API.send('/apps/proxy/api/builds', 'POST', { title: 'Untitled Build', items: [] });
        if (created?.id) {
          setState({ activeId: created.id, dirty: false });
          toast('success', 'New list created');
          await refreshBuilds(state, setState);
          window.dispatchEvent(new CustomEvent('rbp:active-build', { detail: { id: created.id }}));
        }
      } catch (e) { toast('error', 'Create failed'); }
      btnAdd.disabled = false;
    });
    wrap.appendChild(btnAdd);

    // Save List
    const btnSave = h('button', { 'aria-label': 'Save List' }, 'Save');
    btnSave.addEventListener('click', async () => {
      const b = state.currentBuild;
      if (!b?.id) return;
      try {
        await API.send(`/apps/proxy/api/builds/${b.id}`, 'PATCH', { title: b.title, items: b.items });
        toast('success', 'Saved');
        setState({ dirty: false });
        window.dispatchEvent(new CustomEvent('rbp:build-updated', { detail: { id: b.id } }));
      } catch { toast('error','Save failed'); }
    });
    wrap.appendChild(btnSave);

    // Pills for builds
    const pills = h('div', { class: 'rbp-pills', style: { display: 'flex', gap: '6px', marginLeft: '6px' } });
    let focusIndex = Math.max(0, builds.findIndex(b => b.id === activeId));
    function focusPill(i){ const btn = pills.querySelector(`[data-idx="${i}"]`); if (btn) btn.focus(); }
    function onKeyNav(e){ if (e.key === 'ArrowRight') { e.preventDefault(); focusIndex = Math.min(builds.length-1, focusIndex+1); focusPill(focusIndex); } else if (e.key === 'ArrowLeft') { e.preventDefault(); focusIndex = Math.max(0, focusIndex-1); focusPill(focusIndex); } }
    pills.addEventListener('keydown', onKeyNav);
    for (let i=0;i<builds.length;i++){
      const b = builds[i];
      const partsCount = Array.isArray(b.items) ? b.items.reduce((n,it)=>n+Math.max(1, +it.quantity||1),0) : 0;
      const btn = h('button', { 'data-idx': String(i), class: 'rbp-pill', style: { padding: '6px 10px', borderRadius: '999px', border: '1px solid #ddd', background: b.id===activeId ? '#eef6ff' : '#fff' }, 'aria-pressed': String(b.id===activeId) }, `${b.title || 'Untitled'} (${partsCount})`);
      btn.addEventListener('click', () => { setState({ activeId: b.id }); window.dispatchEvent(new CustomEvent('rbp:active-build', { detail: { id: b.id } })); });
      pills.appendChild(btn);
    }
    wrap.appendChild(pills);
    return wrap;
  }

  function renderBuildActions(state, setState){
    const bar = h('div', { class: 'rbp-actions', style: { display:'flex', gap:'8px', flexWrap:'wrap', margin: '8px 0' } });
    const b = state.currentBuild;

    const btnDup = h('button', { 'aria-label': 'Duplicate Build' }, 'Duplicate');
    btnDup.addEventListener('click', async () => {
      if (!b) return;
      const optimisticMsg = 'Duplicating…'; toast('info', optimisticMsg);
      try {
        const created = await API.send('/apps/proxy/api/builds', 'POST', { title: (b.title||'Untitled') + ' (Copy)', items: b.items||[] });
        if (created?.id) {
          setState({ activeId: created.id });
          toast('success', 'Build duplicated');
          await refreshBuilds(state, setState);
          window.dispatchEvent(new CustomEvent('rbp:active-build', { detail: { id: created.id } }));
        }
      } catch { toast('error', 'Duplicate failed'); }
    });

    const btnClear = h('button', { 'aria-label': 'Clear Build' }, 'Clear');
    btnClear.addEventListener('click', async () => {
      if (!b?.id) return;
      if (!confirm('Clear all items from this build?')) return;
      const before = (b.items||[]).slice();
      setState({ currentBuild: { ...b, items: [] }, dirty: true });
      try {
        await API.send(`/apps/proxy/api/builds/${b.id}`, 'PATCH', { items: [] });
        toast('success', 'Build cleared');
        await refreshBuilds(state, setState);
      } catch {
        setState({ currentBuild: { ...b, items: before }, dirty: false });
        toast('error', 'Clear failed — rolled back');
      }
    });

    const btnExport = h('button', { 'aria-label': 'Export Build (JSON)' }, 'Export');
    btnExport.addEventListener('click', () => {
      if (!b) return;
      const data = JSON.stringify({ id: b.id, name: b.title, items: b.items||[] }, null, 2);
      const a = document.createElement('a');
      const blob = new Blob([data], { type: 'application/json' });
      a.href = URL.createObjectURL(blob);
      a.download = `build-${(b.handle||b.id||'x')}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast('success', 'Exported');
    });

    const lblImport = h('label', { style: { display: 'inline-block' } }, [
      h('input', { type: 'file', accept: 'application/json', style: { display: 'none' }, id: 'rbp-import-json' }),
      h('span', { role: 'button', tabIndex: '0', style: { cursor: 'pointer', padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' } }, 'Import')
    ]);
    lblImport.addEventListener('change', async (e) => {
      const file = e.target?.files?.[0];
      if (!file) return; const txt = await file.text(); e.target.value = '';
      try {
        const parsed = JSON.parse(txt);
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.items)) { toast('error','Invalid schema'); return; }
        const created = await API.send('/apps/proxy/api/builds', 'POST', { title: parsed.name || 'Imported Build', items: parsed.items });
        if (created?.id) {
          setState({ activeId: created.id });
          toast('success', 'Imported');
          await refreshBuilds(state, setState);
          window.dispatchEvent(new CustomEvent('rbp:active-build', { detail: { id: created.id } }));
        }
      } catch { toast('error', 'Invalid JSON'); }
    });

    bar.appendChild(btnDup);
    bar.appendChild(btnClear);
    bar.appendChild(btnExport);
    bar.appendChild(lblImport);
    return bar;
  }

  function renderSlots(state, setState){
    const b = state.currentBuild; if (!b) return h('div');
    const wrap = h('div', { class: 'rbp-slots' });
    const byType = groupItems(b.items||[]);
    for (const [type, items] of byType.entries()){
      wrap.appendChild(h('div', { class:'rbp-group', style: { marginTop: '10px', paddingTop: '6px', borderTop: '1px solid #eee' } }, [
        h('div', { style: { fontWeight: 'bold', marginBottom: '6px' } }, type),
        ...items.map((it, idx) => {
          const row = h('div', { class: 'rbp-slot-row', style: { display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' } });
          // name editable
          const name = h('input', { value: it.label || it.name || it.productId || '', 'aria-label': 'Slot name', style: { flex: '1 1 auto', minWidth: '120px' } });
          name.addEventListener('blur', async () => {
            const newItems = (b.items||[]).map(x => x===it ? { ...x, label: name.value } : x);
            const prev = b.items||[]; setState({ currentBuild: { ...b, items: newItems }, dirty: true });
            try { await API.send(`/apps/proxy/api/builds/${b.id}`, 'PATCH', { items: newItems }); toast('success','Renamed'); window.dispatchEvent(new CustomEvent('rbp:build-updated', { detail: { id: b.id } })); }
            catch { setState({ currentBuild: { ...b, items: prev }, dirty: false }); toast('error','Rename failed — rolled back'); }
          });
          // reorder
          const up = h('button', { 'aria-label': 'Move up' }, '↑');
          const down = h('button', { 'aria-label': 'Move down' }, '↓');
          const remove = h('button', { 'aria-label': 'Remove slot', style: { color: '#b00' } }, '×');
          up.disabled = idx === 0; down.disabled = idx === items.length-1;
          up.addEventListener('click', () => move(it, -1));
          down.addEventListener('click', () => move(it, +1));
          remove.addEventListener('click', () => del(it));
          // Select/Fix part
          const slotId = it.id || it.slotId || `${type}-${idx}`;
          const sel = h('button', { 'aria-label': 'Fix slot', title: 'Fix', }, 'Fix');
          sel.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('rbp:start-part-selection', { detail: { type, slotId } }));
            // Update deep-link query so Catalog Picker v2 opens correctly
            try {
              const url = new URL(window.location.href);
              url.searchParams.set('type', type);
              url.searchParams.set('slot', String(slotId));
              history.replaceState({}, '', url.toString());
            } catch {}
          });

          row.appendChild(name);
          // Add per-slot badge if issues exist
          const issues = (state.readiness?.bySlot?.get(slotId)) || [];
          const badge = renderSlotBadgeFor(issues);
          if (badge) row.appendChild(badge);
          row.appendChild(up); row.appendChild(down); row.appendChild(remove); row.appendChild(sel);
          return row;
        })
      ]));
    }
    function move(item, delta){
      const items = (b.items||[]).slice();
      const i = items.indexOf(item); const j = i + delta; if (i<0 || j<0 || j>=items.length) return;
      const before = items.slice(); [items[i], items[j]] = [items[j], items[i]];
      setState({ currentBuild: { ...b, items }, dirty: true });
      API.send(`/apps/proxy/api/builds/${b.id}`, 'PATCH', { items }).then(()=>{
        toast('success','Reordered'); window.dispatchEvent(new CustomEvent('rbp:build-updated', { detail: { id: b.id } }));
      }).catch(()=>{ setState({ currentBuild: { ...b, items: before }, dirty: false }); toast('error','Reorder failed — rolled back'); });
    }
    function del(item){
      const before = (b.items||[]).slice();
      const items = before.filter(x => x!==item);
      setState({ currentBuild: { ...b, items }, dirty: true });
      API.send(`/apps/proxy/api/builds/${b.id}`, 'PATCH', { items }).then(()=>{
        toast('success', 'Removed'); window.dispatchEvent(new CustomEvent('rbp:build-updated', { detail: { id: b.id } }));
      }).catch(()=>{ setState({ currentBuild: { ...b, items: before }, dirty: false }); toast('error','Remove failed — rolled back'); });
    }
    return wrap;
  }

  async function refreshBuilds(state, setState){
    try {
      const list = await API.get('/apps/proxy/api/builds');
      const items = Array.isArray(list?.items) ? list.items : (Array.isArray(list) ? list : []);
      const activeId = state.activeId || items[0]?.id || null;
      setState({ builds: items, activeId });
      if (activeId) {
        const b = await API.get(`/apps/proxy/api/builds/${activeId}`);
        setState({ currentBuild: b, dirty: false });
      } else {
        setState({ currentBuild: null, dirty: false });
      }
    } catch (e) { toast('error', 'Failed to load builds'); }
  }

  function mount(root, _props){
    try { root.innerHTML = ''; } catch {}
    const container = h('div', { class: 'rbp-builds-v212', style: { fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,sans-serif' } });
    root.appendChild(container);

    const state = { builds: [], activeId: null, currentBuild: null, dirty: false, readiness: null };
    function setState(patch){ Object.assign(state, patch||{}); render(); }

    // Readiness state + debounced dry-run
    let debounceTimer = null; let inFlight = null; let lastResult = null; let lastError = null;
    async function runDryRun(signal){
      if (!state.activeId) { lastResult = null; lastError = null; updateReadiness(); return; }
      try {
        const res = await API.get(`/apps/proxy/api/checkout/package?buildId=${encodeURIComponent(state.activeId)}`, { headers: { 'X-RBP-Dry-Run': '1' }, signal });
        lastResult = res; lastError = null; updateReadiness();
      } catch (e) { if (signal?.aborted) return; lastError = e; updateReadiness(); }
    }
    function scheduleDryRun(){
      if (debounceTimer) clearTimeout(debounceTimer);
      if (inFlight) inFlight.abort();
      const ctrl = new AbortController(); inFlight = ctrl;
      state.readiness = { loading: true, error: null, totals: null, issuesCount: 0, bySlot: new Map(), retry: () => { scheduleDryRun(); } };
      const live = ensureToaster().live; live.textContent = 'Checking build…';
      debounceTimer = setTimeout(()=>{ runDryRun(ctrl.signal); }, 300);
    }
    function updateReadiness(){
      const hints = Array.isArray(lastResult?.hints) ? lastResult.hints.map(mapHint) : [];
      const bySlot = new Map();
      for (const h of hints){ const key = h.slotId || 'unknown'; if (!bySlot.has(key)) bySlot.set(key, []); bySlot.get(key).push(h); }
      state.readiness = {
        loading: false,
        error: lastError ? String(lastError) : null,
        totals: lastResult?.meta?.totals || null,
        issuesCount: hints.length,
        bySlot,
        retry: () => scheduleDryRun(),
      };
      render();
    }

    function render(){
      container.innerHTML = '';
      container.appendChild(renderSavedBuildsBar(state, setState));

      const bTitle = h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' } });
      const title = h('input', { value: state.currentBuild?.title || '', placeholder: 'Untitled Build', 'aria-label': 'Build title', style: { fontSize: '16px', padding: '6px 8px', flex: '0 1 320px' } });
      title.addEventListener('blur', async () => {
        const b = state.currentBuild; if (!b?.id) return;
        const prev = b.title; setState({ currentBuild: { ...b, title: title.value }, dirty: true });
        try { await API.send(`/apps/proxy/api/builds/${b.id}`, 'PATCH', { title: title.value }); toast('success','Title saved'); }
        catch { setState({ currentBuild: { ...b, title: prev }, dirty: false }); toast('error','Rename failed — rolled back'); }
      });
      bTitle.appendChild(h('div', {}, 'Active Build:'));
      bTitle.appendChild(title);
      container.appendChild(bTitle);

      // Readiness summary block
      const readinessBox = renderReadinessHeader(state);
      container.appendChild(readinessBox);
      // Update after render
      readinessBox.update?.();

      container.appendChild(renderBuildActions(state, setState));
      container.appendChild(renderSlots(state, setState));
    }

    window.addEventListener('rbp:active-build', async (e) => { const id = e?.detail?.id; setState({ activeId: id }); scheduleDryRun(); });
    window.addEventListener('rbp:build-updated', async (e) => { const id = e?.detail?.id; if (!id || id!==state.activeId) return; await refreshBuilds(state, setState); scheduleDryRun(); });
    window.addEventListener('rbp:part-selected', async () => { scheduleDryRun(); });

    // initial load
    (async () => { await refreshBuilds(state, setState); scheduleDryRun(); })();

    return { unmount(){ try { root.innerHTML = ''; } catch {} if (debounceTimer) clearTimeout(debounceTimer); if (inFlight) inFlight.abort(); } };
  }
  // @ts-ignore expose for manual testing
  if (typeof window !== 'undefined') window.RBP_BUILDS_V212 = { mount };

export default mount;
// <!-- END RBP GENERATED: builds-readiness-v1 -->
