// <!-- BEGIN RBP GENERATED: builds-share-links-v1 -->
// rbp-share v1.0.0 — Public read-only preview renderer for shared builds
// Contract: default export mount(rootEl)

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

  async function apiGet(url){ const r = await fetch(url, { cache: 'no-store' }); if (!r.ok) throw r; return r.json(); }
  async function apiSend(url, method, body){ const r = await fetch(url, { method, headers: { 'content-type':'application/json' }, cache: 'no-store', body: body ? JSON.stringify(body) : undefined }); if (!r.ok) throw r; return r.json(); }

  function currentHref(){ try { return (window && (window).__RBP_SHARE_URL__) || window.location.href; } catch { return ''; } }
  function parseToken(){ try { const u = new URL(currentHref()); return u.searchParams.get('share'); } catch { return null; } }

  function renderPreview(container, snapshot, actions){
    container.innerHTML = '';
    const head = h('div', { style: { fontWeight: '600', marginBottom: '8px' } }, snapshot?.name || 'Shared Build');
    const items = Array.isArray(snapshot?.items) ? snapshot.items : [];
    const list = h('div', { style: { display:'grid', gap:'6px' } }, items.map((it)=>h('div',{ style: { display:'flex', justifyContent:'space-between', borderBottom:'1px solid #eee', padding:'6px 0' } }, [
      h('div', {}, it.title || it.label || it.productId || 'Item'),
      h('div', { style: { opacity:'0.8' } }, `${it.quantity ?? 1}×`),
    ])));
    const dup = h('button', { 'aria-label': 'Duplicate to My Builds' }, 'Duplicate to My Builds');
    dup.addEventListener('click', async ()=>{
      dup.disabled = true; try { const created = await actions.duplicate(snapshot); if (created?.id) { window.dispatchEvent(new CustomEvent('rbp:active-build', { detail: { id: created.id } })); } }
      catch {} finally { dup.disabled = false; }
    });
    container.appendChild(head); container.appendChild(list); container.appendChild(dup);
  }

  function renderError(container, status){
    const title = status === 401 ? 'Invalid link' : status === 410 ? 'Link expired' : 'Unable to load preview';
    const hint = status === 401 ? 'Request a new link from the sender.' : status === 410 ? 'This link has expired. Ask for a new one.' : 'Please try again.';
    container.innerHTML = '';
    container.appendChild(h('div', { style: { fontWeight: '600', marginBottom: '6px' } }, title));
    container.appendChild(h('div', { style: { opacity:'0.8' } }, hint));
  }

  function mount(root){
    const container = h('div', { class: 'rbp-share-v100', style: { fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,sans-serif' } });
    root.appendChild(container);
    (async () => {
      const token = parseToken();
      if (!token) { renderError(container, 401); return; }
      try {
        const res = await apiGet(`/apps/rbp/api/share/resolve?token=${encodeURIComponent(token)}`);
        const snapshot = res?.build || null;
        const actions = {
          async duplicate(b){ return await apiSend('/apps/proxy/api/builds', 'POST', { title: (b?.name||'Shared Build'), items: b?.items||[] }); },
        };
        renderPreview(container, snapshot, actions);
      } catch (e){
        try { const status = e?.status ?? 500; renderError(container, status); } catch { renderError(container, 500); }
      }
    })();
    return { unmount(){ try { root.innerHTML=''; } catch {} } };
  }

  // @ts-ignore expose for manual
  if (typeof window !== 'undefined') window.RBP_SHARE_V100 = { mount };
  // CommonJS export for Jest/Storybook without ESM parsing
  // @ts-ignore
  if (typeof module !== 'undefined' && module && module.exports != null) { module.exports = mount; module.exports.default = mount; }
// <!-- END RBP GENERATED: builds-share-links-v1 -->
