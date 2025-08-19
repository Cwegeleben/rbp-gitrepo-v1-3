// rbp-builds module: Builds Panel v1
// This file implements a floating panel for Active Build management.

let activeBuildId = null;
let lastBuildData = null;

function ensureDiv(sel) {
  let el = document.querySelector(sel);
  if (!el) {
    el = document.createElement('div');
    el.id = sel.replace('#','');
    el.style.position = 'fixed';
    el.style.top = '20px';
    el.style.right = '20px';
    el.style.zIndex = '9999';
    el.style.background = '#fff';
    el.style.border = '1px solid #ccc';
    el.style.padding = '16px';
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    document.body.appendChild(el);
  }
  return el;
}

async function apiGet(p){
  try {
    const r=await fetch(p,{cache:'no-store'});
    if(!r.ok) throw new Error(p+' '+r.status);
    return r.json();
  } catch(e) { console.error(e); return null; }
}
async function apiSend(p,m,b){
  try {
    const r=await fetch(p,{method:m,headers:{'content-type':'application/json'},cache:'no-store',body:b?JSON.stringify(b):undefined});
    if(!r.ok) throw new Error(p+' '+r.status);
    return r.status===204?null:r.json();
  } catch(e) { console.error(e); return null; }
}
async function loadActiveBuild(){
  if(!activeBuildId) return null;
  return apiGet(`/apps/proxy/api/builds/${activeBuildId}`);
}
async function saveItems(items){
  return apiSend(`/apps/proxy/api/builds/${activeBuildId}`, 'PATCH', { items });
}
async function renameBuild(title){
  return apiSend(`/apps/proxy/api/builds/${activeBuildId}`, 'PATCH', { title });
}

function renderPanel(build) {
  const panel = ensureDiv('#rbp-builds-panel');
  if (!activeBuildId) {
    panel.innerHTML = '<div class="rbp-panel"><div class="rbp-hdr">Active Build</div><div>No active build selected.</div></div>';
    return;
  }
  if (!build) {
    panel.innerHTML = '<div class="rbp-panel"><div class="rbp-hdr">Active Build</div><div style="color:#c00;font-size:12px;">Error loading build.</div></div>';
    return;
  }
  panel.innerHTML = `
    <div class="rbp-panel">
      <div class="rbp-hdr">Active Build</div>
      <input id="rbp-build-title" value="${build.title||''}" placeholder="Untitled Build" style="width:100%;margin-bottom:8px;" />
      <div id="rbp-build-items"></div>
      <div id="rbp-build-summary" style="margin-top:8px;font-size:12px;color:#666;"></div>
      <div id="rbp-build-package" style="margin-top:12px;"></div>
    </div>`;
  const titleInput = panel.querySelector('#rbp-build-title');
  titleInput.onblur = async () => {
    await renameBuild(titleInput.value);
    refreshPanel();
  };
  const itemsDiv = panel.querySelector('#rbp-build-items');
  const items = Array.isArray(build.items) ? build.items : [];
  let total = 0;
  itemsDiv.innerHTML = items.map((item,i) => {
    const label = item.label || item.productId || 'Item';
    const qty = Math.max(1, Math.min(999, item.quantity||1));
    total += qty;
    return `<div class="rbp-item-row" style="display:flex;align-items:center;margin-bottom:4px;">
      <span style="flex:1;">${label}</span>
      <button data-i="${i}" data-diff="-1" style="width:24px;">-</button>
      <input data-i="${i}" type="number" min="1" max="999" value="${qty}" style="width:40px;text-align:center;" />
      <button data-i="${i}" data-diff="1" style="width:24px;">+</button>
      <button data-i="${i}" class="rbp-remove" style="width:24px;color:#c00;">×</button>
    </div>`;
  }).join('');
  panel.querySelector('#rbp-build-summary').textContent = `Total items: ${total}`;
  // Package Build button and summary
  const pkgDiv = panel.querySelector('#rbp-build-package');
  pkgDiv.innerHTML = `<button id="rbp-package-btn" style="margin-bottom:6px;">Package Build</button><div id="rbp-package-summary"></div>`;
  const pkgBtn = pkgDiv.querySelector('#rbp-package-btn');
  const pkgSummary = pkgDiv.querySelector('#rbp-package-summary');
  let pkgJson = null;
  pkgBtn.onclick = async () => {
    pkgBtn.disabled = true;
    pkgSummary.textContent = 'Packaging…';
    try {
      const pkg = await apiGet(`/apps/proxy/api/checkout/package?buildId=${activeBuildId}`);
      pkgJson = pkg;
      if (pkg.error) {
        pkgSummary.textContent = `Error: ${pkg.message}`;
      } else {
        let html = `<div>Total items: ${pkg.totalItems}</div>`;
        if (pkg.cart && pkg.cart.cartPath) {
          html += `<a href="${pkg.cart.cartPath}" target="_blank" style="margin-right:8px;">Go to Cart</a>`;
        }
        html += `<button id="rbp-copy-json" style="margin-left:8px;">Copy JSON</button>`;
        pkgSummary.innerHTML = html;
        const copyBtn = pkgSummary.querySelector('#rbp-copy-json');
        if (copyBtn) {
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(JSON.stringify(pkgJson, null, 2));
            copyBtn.textContent = 'Copied!';
            setTimeout(()=>{copyBtn.textContent='Copy JSON';},900);
          };
        }
      }
    } catch(e) {
      console.error(e);
      pkgSummary.textContent = 'Error packaging build.';
    }
    pkgBtn.disabled = false;
  };
  // Qty +/- handlers
  itemsDiv.querySelectorAll('button[data-diff]').forEach(btn => {
    btn.onclick = async () => {
      const i = +btn.dataset.i;
      const diff = +btn.dataset.diff;
      const newItems = items.map((it,j) => j===i ? {...it, quantity: Math.max(1, Math.min(999, (it.quantity||1)+diff))} : it);
      await saveItems(newItems);
      refreshPanel();
    };
  });
  // Qty direct input
  itemsDiv.querySelectorAll('input[type=number]').forEach(inp => {
    inp.onblur = async () => {
      const i = +inp.dataset.i;
      const val = Math.max(1, Math.min(999, +inp.value||1));
      const newItems = items.map((it,j) => j===i ? {...it, quantity: val} : it);
      await saveItems(newItems);
      refreshPanel();
    };
  });
  // Remove handler
  itemsDiv.querySelectorAll('.rbp-remove').forEach(btn => {
    btn.onclick = async () => {
      const i = +btn.dataset.i;
      const newItems = items.filter((_,j) => j!==i);
      await saveItems(newItems);
      refreshPanel();
    };
  });
}

async function refreshPanel() {
  if (!activeBuildId) {
    renderPanel(null);
    return;
  }
  const build = await loadActiveBuild();
  lastBuildData = build;
  renderPanel(build);
}

export default function init() {
  window.addEventListener("rbp:active-build", e => {
    activeBuildId = e.detail.id;
    refreshPanel();
  });
  window.addEventListener("rbp:build-updated", e => {
    if (e.detail.id === activeBuildId) refreshPanel();
  });
  refreshPanel();
}
