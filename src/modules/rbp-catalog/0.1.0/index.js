// --- Excerpt: Add button handler and PATCH call ---
async function addProductToActiveBuild(product, btn) {
  if (btn) btn.disabled = true;
  try {
    let buildId = activeBuildId();
    if (!buildId) {
      await ensureActiveBuild();
      buildId = activeBuildId();
    }
    const build = await apiGet(`/apps/proxy/api/builds/${buildId}`);
    const items = Array.isArray(build.items) ? build.items.slice() : [];
  items.push({ slot: "Product", label: product.title, productId: product.handle, quantity: 1 });
    await apiSend(`/apps/proxy/api/builds/${buildId}`, "PATCH", { items });
    if (btn) {
      btn.textContent = '✓';
      setTimeout(() => { btn.textContent = 'Add'; btn.disabled = false; }, 900);
    }
  } catch (err) {
    if (btn) btn.disabled = false;
    console.error("Add to build failed", err);
  }
}
// Minimal Catalog UI module

// --- Helpers ---
async function apiGet(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.json();
}
async function apiSend(path, method, body) {
  const res = await fetch(path, {
    method,
    headers: { 'content-type': 'application/json' },
    cache: 'no-store',
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.status === 204 ? null : res.json();
}

export default async function init(ctx) {
  try {
    let root = document.getElementById("rbp-catalog-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "rbp-catalog-root";
      root.style.position = "fixed";
      root.style.top = "20px";
      root.style.right = "20px";
      root.style.zIndex = "9999";
      root.style.background = "#fff";
      root.style.border = "1px solid #ccc";
      root.style.padding = "16px";
      root.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      root.innerHTML = `<strong>Catalog</strong><br>
        <div id='rbp-build-controls' style='margin-bottom:8px'></div>
        <input id='rbp-catalog-search' placeholder='Search catalog…' style='width:100%;margin:8px 0;padding:4px;' />
        <div id='rbp-catalog-list'></div>`;
      document.body.appendChild(root);
    }
    const buildControls = root.querySelector('#rbp-build-controls');
    const searchInput = root.querySelector("#rbp-catalog-search");
    const list = root.querySelector("#rbp-catalog-list");

    let debounceTimer = null;
    let lastQuery = "";
    let builds = [];
    let activeBuild = null;

    function activeBuildId() {
      const sel = buildControls.querySelector('#rbp-active-build');
      const id = sel && sel.value ? sel.value : null;
      if (id) {
        // Broadcast active build id
        window.dispatchEvent(new CustomEvent("rbp:active-build", { detail: { id } }));
      }
      return id;
    }

    async function refreshBuilds() {
      try {
  builds = await apiGet('/apps/proxy/api/builds');
  let sel = buildControls.querySelector('#rbp-active-build');
  let currentId = sel && sel.value;
  buildControls.innerHTML = `<select id='rbp-active-build' style='margin-right:8px'></select>
          <button id='rbp-new-build' style='margin-right:8px'>New Build</button>`;
        sel = buildControls.querySelector('#rbp-active-build');
        builds.forEach(b => {
          const opt = document.createElement('option');
          opt.value = b.id;
          opt.textContent = b.title || `Build ${b.id}`;
          sel.appendChild(opt);
        });
        if (builds.length) {
          sel.value = currentId || builds[0].id;
          activeBuild = builds.find(b => b.id === sel.value) || builds[0];
          // Broadcast on init
          window.dispatchEvent(new CustomEvent("rbp:active-build", { detail: { id: sel.value } }));
        } else {
          sel.value = '';
          activeBuild = null;
        }
        buildControls.querySelector('#rbp-new-build').onclick = async () => {
          try {
            await apiSend('/apps/proxy/api/builds', 'POST', { title: 'Untitled Build' });
            await refreshBuilds();
          } catch (err) {
            console.error('New build failed', err);
          }
        };
        sel.onchange = () => {
          activeBuild = builds.find(b => b.id === sel.value) || null;
        };
      } catch (err) {
        console.error('Builds fetch error', err);
      }
    }

    async function ensureActiveBuild() {
      await refreshBuilds();
      if (!builds.length) {
        await apiSend('/apps/proxy/api/builds', 'POST', { title: 'Untitled Build' });
        await refreshBuilds();
      }
    }

    async function addProductToActiveBuild(product, btn) {
      if (btn) btn.disabled = true;
      try {
        let buildId = activeBuildId();
        if (!buildId) {
          await ensureActiveBuild();
          buildId = activeBuildId();
        }
        const build = await apiGet(`/apps/proxy/api/builds/${buildId}`);
        const items = Array.isArray(build.items) ? build.items.slice() : [];
        items.push({ slot: "Product", label: product.title, productId: product.id, quantity: 1 });
        await apiSend(`/apps/proxy/api/builds/${buildId}`, "PATCH", { items });
        if (btn) {
          btn.textContent = '✓';
          setTimeout(() => { btn.textContent = 'Add'; btn.disabled = false; }, 900);
        }
      } catch (err) {
        if (btn) btn.disabled = false;
        console.error("Add to build failed", err);
      }
    }

    async function showCollections() {
      try {
        const collections = await apiGet("/apps/proxy/api/catalog/collections");
        if (!Array.isArray(collections) || collections.length === 0) {
          list.textContent = "No collections found.";
          return;
        }
        list.innerHTML = collections.map(c => `<button data-handle='${c.handle}' style='margin:2px'>${c.title} (${c.productCount})</button>`).join("");
        list.querySelectorAll("button").forEach(btn => {
          btn.onclick = async () => {
            try {
              const handle = btn.getAttribute("data-handle");
              const products = await apiGet(`/apps/proxy/api/catalog/products?collection=${encodeURIComponent(handle)}&limit=20`);
              if (!Array.isArray(products) || products.length === 0) {
                list.innerHTML = "No products found.";
                return;
              }
              list.innerHTML = `<button id='rbp-catalog-back'>Back</button>` + products.map(p => {
                return `<div style='margin:4px 0;display:flex;align-items:center'>
                  <b>${p.title}</b> <small style='margin-left:4px'>${p.vendor}</small> <span style='margin-left:8px'>$${p.price}</span>
                  <button style='margin-left:8px;font-size:11px;padding:2px 6px' data-add='${p.id}'>Add</button>
                </div>`;
              }).join("");
              list.querySelector("#rbp-catalog-back").onclick = () => showCollections();
              products.forEach(p => {
                const btn = list.querySelector(`button[data-add='${p.id}']`);
                if (btn) {
                  // <!-- BEGIN RBP GENERATED: AccessV2 -->
                  if (!(ctx && ctx.features && ctx.features['builds:edit'])) { btn.disabled = true; btn.title = 'Requires builds:edit'; }
                  // <!-- END RBP GENERATED: AccessV2 -->
                  btn.onclick = () => addProductToActiveBuild(p, btn);
                }
              });
            } catch (err) {
              console.error("Catalog products fetch error", err);
            }
          };
        });
      } catch (err) {
        console.error("Catalog collections fetch error", err);
      }
    }

    async function showSearchResults(query) {
      try {
        const results = await apiGet(`/apps/proxy/api/catalog/search?q=${encodeURIComponent(query)}&limit=20`);
        if (!Array.isArray(results) || results.length === 0) {
          list.innerHTML = "No products found.";
          return;
        }
        list.innerHTML = results.map(p => {
          return `<div style='margin:4px 0;display:flex;align-items:center'>
            <b>${p.title}</b> <small style='margin-left:4px'>${p.vendor}</small> <span style='margin-left:8px'>$${p.price}</span>
            <button style='margin-left:8px;font-size:11px;padding:2px 6px' data-add='${p.id}'>Add</button>
          </div>`;
        }).join("");
        results.forEach(p => {
          const btn = list.querySelector(`button[data-add='${p.id}']`);
          if (btn) {
            // <!-- BEGIN RBP GENERATED: AccessV2 -->
            if (!(ctx && ctx.features && ctx.features['builds:edit'])) { btn.disabled = true; btn.title = 'Requires builds:edit'; }
            // <!-- END RBP GENERATED: AccessV2 -->
            btn.onclick = () => addProductToActiveBuild(p, btn);
          }
        });
      } catch (err) {
        console.error("Catalog search error", err);
      }
    }

    searchInput.oninput = function () {
      const query = searchInput.value.trim();
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (!query) {
          showCollections();
        } else {
          showSearchResults(query);
        }
        lastQuery = query;
      }, 300);
    };

    // Initial load: ensure a build exists and show collections
    await ensureActiveBuild();
    showCollections();
    await refreshBuilds();
  } catch (err) {
    console.error("Catalog UI error", err);
  }
}
