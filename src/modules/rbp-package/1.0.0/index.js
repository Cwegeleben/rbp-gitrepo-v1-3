// <!-- BEGIN RBP GENERATED: package-cta-v1 -->
// rbp-package v1.0.0 — Package & Cart Flow v1 (Storefront module)
// Contract:
// - default export: function mount(rootEl, { ctx, navigate }?)
// - Renders a panel with "Package Build" CTA, summary (totals + hints), Go to Cart, Copy JSON.
// - Listens to: 'rbp:active-build', 'rbp:build-updated', 'rbp:part-selected' to refresh dry-run summary.
// - Uses GET / POST /apps/proxy/api/checkout/package?buildId=... (GET used for dry-run).

const API = {
  async get(url, headers) {
    const r = await fetch(url, { cache: 'no-store', headers: headers || {} });
    if (!r.ok) throw new Error(`GET ${url} ${r.status}`);
    return r.json();
  },
  async post(url, body) {
    const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, cache: 'no-store', body: body ? JSON.stringify(body) : undefined });
    if (!r.ok) throw new Error(`POST ${url} ${r.status}`);
    return r.json();
  }
};

function ensureToaster(){
  let host = document.getElementById('rbp-toast-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'rbp-toast-host';
    host.style.position = 'fixed'; host.style.top = '16px'; host.style.right = '16px'; host.style.zIndex = '9999';
    document.body.appendChild(host);
  }
  let live = document.getElementById('rbp-aria-live');
  if (!live) {
    live = document.createElement('div');
    live.id = 'rbp-aria-live';
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('aria-atomic', 'true');
    live.style.position = 'absolute'; live.style.width = '1px'; live.style.height = '1px'; live.style.overflow = 'hidden'; live.style.clipPath = 'inset(50%)';
    document.body.appendChild(live);
  }
  return { host, live };
}
function toast(kind, text){
  const { host, live } = ensureToaster();
  const card = document.createElement('div');
  card.style.marginBottom = '8px'; card.style.padding = '10px 12px'; card.style.background = '#fff'; card.style.border = '1px solid #ddd'; card.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)'; card.style.fontFamily = 'system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
  card.textContent = `[${kind}] ${text}`; host.appendChild(card);
  live.textContent = text;
  setTimeout(()=>{ if (card.parentElement===host) host.removeChild(card); }, 3000);
}

function h(tag, props = {}, children = []){
  const el = document.createElement(tag);
  for (const [k,v] of Object.entries(props||{})) {
    if (k === 'class') el.className = v;
    else if (k === 'style' && v && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset' && v && typeof v === 'object') { for (const [dk,dv] of Object.entries(v)) el.dataset[dk] = dv; }
    else if (v != null) el.setAttribute(k, String(v));
  }
  for (const c of ([]).concat(children)) {
    if (c == null) continue;
    if (c instanceof Node) el.appendChild(c); else el.appendChild(document.createTextNode(String(c)));
  }
  return el;
}

export default function mount(root, { navigate } = {}){
  try { root.innerHTML = ''; } catch {}
  const container = h('section', { class: 'rbp-package', style: { fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,sans-serif' } });
  const title = h('h2', { class: 'text-lg font-semibold mb-2' }, 'Package Build');
  const desc = h('div', { class: 'opacity-70 text-sm', role: 'note' }, 'Create a cart from your current build.');
  const cta = h('button', { 'aria-label': 'Package Build', class: 'rbp-btn-primary', style: { marginTop: '8px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', background: '#1e293b', color: '#fff' } }, 'Package Build');
  const status = h('div', { id: 'rbp-package-status', 'aria-live': 'polite', class: 'text-sm', style: { marginTop: '6px', minHeight: '1.2em' } });
  const summary = h('div', { id: 'rbp-package-summary', class: 'rbp-summary', style: { marginTop: '10px' } });
  container.appendChild(title); container.appendChild(desc); container.appendChild(cta); container.appendChild(status); container.appendChild(summary);
  root.appendChild(container);

  let activeBuildId = null;
  let itemsCount = 0;
  let last = null;
  let pending = false;

  function setStatus(text){ status.textContent = text || ''; }
  function setDisabled(dis){ cta.disabled = !!dis; cta.style.opacity = dis ? '0.6' : '1'; }

  async function fetchActiveBuild(id){
    if (!id) { itemsCount = 0; setDisabled(true); return; }
    try {
      const b = await API.get(`/apps/proxy/api/builds/${id}`);
      itemsCount = Array.isArray(b?.items) ? b.items.reduce((n,it)=>n + Math.max(1, +it.quantity||1), 0) : 0;
      setDisabled(!itemsCount || pending);
    } catch { itemsCount = 0; setDisabled(true); }
  }

  function renderSummary(data){
    summary.innerHTML = '';
    if (!data) return;
    const list = h('div', { class: 'grid gap-2' });
    // Totals
    const totals = data?.meta?.totals;
    if (totals) {
      const cur = totals.currency || 'USD';
      const fmt = (v)=> typeof v === 'number' ? new Intl.NumberFormat(undefined, { style:'currency', currency: cur }).format(v/100) : null;
      const rows = [ ['Subtotal', fmt(totals.subtotal)], ['Est. Tax', fmt(totals.estTax)], ['Total', fmt(totals.total)] ].filter(r=>r[1]);
      const tbl = h('table', { class: 'rbp-totals', style: { width: '100%', borderCollapse: 'collapse' } }, [
        h('tbody', {}, rows.map(([k,v]) => h('tr', {}, [ h('td', { style: { padding: '2px 4px', opacity: '0.8' } }, k), h('td', { style: { padding: '2px 4px', textAlign: 'right' } }, v) ])))
      ]);
      list.appendChild(h('div', {}, [ h('div', { style: { fontWeight: '600' } }, 'Totals'), tbl ]));
    }
    // Hints
    const hints = Array.isArray(data?.hints) ? data.hints : [];
    if (hints.length) {
      const ul = h('ul', { class: 'rbp-hints', style: { paddingLeft: '18px' } }, hints.map(hh => h('li', {}, `${hh.type}${hh.message ? ': '+hh.message : ''}${hh.sku ? ` (${hh.sku})` : ''}`)));
      list.appendChild(h('div', {}, [ h('div', { style: { fontWeight: '600' } }, 'Hints'), ul ]));
    }
    // Actions
    const actions = h('div', { class: 'rbp-actions', style: { display:'flex', gap:'8px', marginTop: '6px' } });
    const go = h('a', { href: data?.cartPath || '#', role: 'button', 'aria-disabled': String(!data?.cartPath), tabIndex: data?.cartPath ? '0' : '0', style: { pointerEvents: data?.cartPath ? 'auto' : 'none', opacity: data?.cartPath ? '1' : '0.5', padding: '6px 10px', border: '1px solid #ccc', borderRadius: '6px', background: '#fff' } }, 'Go to Cart');
    const copy = h('button', { 'aria-label': 'Copy JSON', style: { padding: '6px 10px', border: '1px solid #ccc', borderRadius: '6px', background: '#fff' } }, 'Copy JSON');
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(JSON.stringify(data, null, 2)); toast('success', 'Copied response'); }
      catch { toast('error', 'Copy failed'); }
    });
    actions.appendChild(go); actions.appendChild(copy);
    summary.appendChild(list); summary.appendChild(actions);
  }

  async function dryRun(){
    if (!activeBuildId) { last = null; renderSummary(last); return; }
    try {
      const res = await API.get(`/apps/proxy/api/checkout/package?buildId=${encodeURIComponent(activeBuildId)}`, { 'X-RBP-Dry-Run': '1' });
      last = res; renderSummary(last);
    } catch {
      // silent for dry-run
    }
  }

  cta.addEventListener('click', async () => {
    if (!activeBuildId || pending) return;
    pending = true; setDisabled(true); setStatus('Packaging…'); ensureToaster().live.textContent = 'Packaging…';
    try {
      const res = await API.get(`/apps/proxy/api/checkout/package?buildId=${encodeURIComponent(activeBuildId)}`);
      last = res; renderSummary(last);
      setStatus('Packaged'); ensureToaster().live.textContent = 'Packaged';
      if (res?.cartPath) {
        // show a subtle nudge toast
        toast('success', 'Cart is ready');
      } else if (Array.isArray(res?.hints) && res.hints.length) {
        toast('info', 'Review hints before checkout');
      }
    } catch (e) {
      setStatus('Error packaging.'); ensureToaster().live.textContent = 'Error packaging'; toast('error', 'Network error while packaging');
    }
    pending = false; setDisabled(!itemsCount);
  });

  // Initial derivation of active build (fallback if no event yet)
  (async () => {
    try {
      const list = await API.get('/apps/proxy/api/builds');
      const items = Array.isArray(list?.items) ? list.items : (Array.isArray(list) ? list : []);
      activeBuildId = items[0]?.id || null; await fetchActiveBuild(activeBuildId); await dryRun();
    } catch {}
  })();

  // Event listeners to sync with Builds panel
  window.addEventListener('rbp:active-build', async (e) => {
    activeBuildId = e?.detail?.id || null; await fetchActiveBuild(activeBuildId); await dryRun();
  });
  window.addEventListener('rbp:build-updated', async (e) => {
    const id = e?.detail?.id; if (!id || id !== activeBuildId) return; await fetchActiveBuild(activeBuildId); await dryRun();
  });
  window.addEventListener('rbp:part-selected', async () => { await dryRun(); });

  return { unmount(){ try { root.innerHTML = ''; } catch {} } };
}
// <!-- END RBP GENERATED: package-cta-v1 -->
