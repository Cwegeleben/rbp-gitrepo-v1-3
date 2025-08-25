// <!-- BEGIN RBP GENERATED: cart-drawer-v1 -->
// rbp-cart v1.0.0 — Mini Cart Drawer v1 (Storefront module)
// Contract:
// - default export: function mount(rootEl, { navigate }?)
// - Provides CTA mode ("Package & View Cart") and Event mode (auto-open on rbp:packager:result success)
// - Exposes/handles rbp:cart:open and rbp:cart:close events

import React from 'react';
import { createRoot } from 'react-dom/client';
import CartDrawer from './components/CartDrawer.js';

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

function ensureLive(){
  let live = document.getElementById('rbp-aria-live');
  if (!live) {
    live = document.createElement('div');
    live.id = 'rbp-aria-live';
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('aria-atomic', 'true');
    live.style.position = 'absolute'; live.style.width = '1px'; live.style.height = '1px'; live.style.overflow = 'hidden'; live.style.clipPath = 'inset(50%)';
    document.body.appendChild(live);
  }
  return live;
}

export default function mount(root, { navigate } = {}){
  ensureLive();
  try { root.innerHTML = ''; } catch {}

  const host = document.createElement('div');
  host.className = 'rbp-cart-host';
  root.appendChild(host);

  let activeBuildId = null;
  let reactRoot = null;

  const state = {
    open: false,
    status: 'idle', // idle | pending | ready | error
    data: null,
    raw: null,
    error: null,
  };

  function render(){
    if (!reactRoot) reactRoot = createRoot(host);
    reactRoot.render(
      React.createElement(CartDrawer, {
        open: state.open,
        status: state.status,
        data: state.data,
        raw: state.raw,
        error: state.error,
        onClose: () => {
          state.open = false; state.status = 'idle'; state.error = null;
          window.dispatchEvent(new CustomEvent('rbp:cart:close'));
          render();
        },
        onCopy: () => {
          if (!state.raw) return;
          navigator.clipboard?.writeText?.(JSON.stringify(state.raw, null, 2)).catch(()=>{});
        },
        onGoToCart: (path) => {
          if (!path) return;
          if (typeof navigate === 'function') navigate(path); else window.location.assign(path);
        },
        onRetry: () => {
          if (!activeBuildId) return;
          packageNow(activeBuildId);
        },
      })
    );
  }

  function setLive(text){ ensureLive().textContent = text || ''; }

  function normalize(res){
    const items = Array.isArray(res?.items) ? res.items.map(it => ({ title: it.title || it.name || it.sku || 'Item', qty: Math.max(1, +it.quantity||1), vendor: it.vendor || it.brand || '' })) : [];
    const totals = res?.meta?.totals || undefined;
    const hints = Array.isArray(res?.hints) ? res.hints : [];
    return { items, totals, hints, cartPath: res?.cartPath || null };
  }

  async function packageNow(buildId){
    state.status = 'pending'; state.error = null; setLive('Packaging…'); render();
    try {
      const res = await API.post('/apps/proxy/api/checkout/package', { buildId });
      state.raw = res;
      state.data = normalize(res);
      state.status = 'ready'; setLive('Cart ready');
      state.open = true;
      render();
    } catch (e) {
      state.error = e instanceof Error ? e.message : 'Network error';
      state.status = 'error'; setLive('Packaging error');
      state.open = true;
      render();
    }
  }

  // CTA mode button when drawer is idle
  const cta = document.createElement('button');
  cta.type = 'button';
  cta.textContent = 'Package & View Cart';
  cta.setAttribute('aria-label', 'Package & View Cart');
  Object.assign(cta.style, { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', background: '#1e293b', color: '#fff' });
  host.appendChild(cta);
  cta.addEventListener('click', async () => {
    if (!activeBuildId) await pickActiveBuild();
    if (activeBuildId) packageNow(activeBuildId);
  });

  async function pickActiveBuild(){
    try {
      const list = await API.get('/apps/proxy/api/builds');
      const items = Array.isArray(list?.items) ? list.items : (Array.isArray(list) ? list : []);
      activeBuildId = items[0]?.id || null;
    } catch { activeBuildId = null; }
  }

  // Wire events
  function onPackagerResult(e){
    const d = e?.detail;
    if (!d) return;
    if (d.status === 'success') {
      state.raw = d.response || d; // keep raw
      state.data = normalize(d.response || d);
      state.status = 'ready'; state.error = null; setLive('Cart ready');
      state.open = true; render();
    } else if (d.status === 'error') {
      state.raw = d.response || d; state.data = null; state.error = 'Packaging error';
      state.status = 'error'; setLive('Packaging error'); state.open = true; render();
    }
  }
  function onCartOpen(e){
    const payload = e?.detail; // optional { response }
    if (payload?.response) {
      state.raw = payload.response; state.data = normalize(payload.response);
      state.status = 'ready';
    }
    state.open = true; render();
  }
  function onCartClose(){ state.open = false; render(); }

  window.addEventListener('rbp:packager:result', onPackagerResult);
  window.addEventListener('rbp:cart:open', onCartOpen);
  window.addEventListener('rbp:cart:close', onCartClose);
  window.addEventListener('rbp:active-build', (e) => { activeBuildId = e?.detail?.id || null; });

  // initial attempt to find a build id
  pickActiveBuild();
  render();

  return { unmount(){
    try {
      window.removeEventListener('rbp:packager:result', onPackagerResult);
      window.removeEventListener('rbp:cart:open', onCartOpen);
      window.removeEventListener('rbp:cart:close', onCartClose);
      if (reactRoot) reactRoot.unmount();
      root.removeChild(host);
    } catch {}
  } };
}
// <!-- END RBP GENERATED: cart-drawer-v1 -->
