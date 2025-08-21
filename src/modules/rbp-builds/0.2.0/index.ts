// <!-- BEGIN RBP GENERATED: BuildsQoL -->
import { apiGet, apiSend } from "../../../shared/sdk/client";
import { toast } from "../../../shared/ui/toast";

let activeBuildId: string | null = null;

async function duplicateActive(build: any) {
  const name = (build?.title || 'Untitled') + ' (Copy)';
  const body = { title: name, items: build?.items || [] };
  const created = await apiSend('/apps/proxy/api/builds', 'POST', body);
  if (created?.id) {
    activeBuildId = created.id;
    window.dispatchEvent(new CustomEvent('rbp:active-build', { detail: { id: activeBuildId } }));
    toast('success', 'Build duplicated');
  } else {
    toast('error', 'Duplicate failed');
  }
}

async function clearActive() {
  if (!activeBuildId) return;
  if (!confirm('Clear all items from this build?')) return;
  await apiSend(`/apps/proxy/api/builds/${activeBuildId}`, 'PATCH', { items: [] });
  toast('success', 'Build cleared');
  window.dispatchEvent(new CustomEvent('rbp:build-updated', { detail: { id: activeBuildId } }));
}

async function reorderItem(build: any, idx: number, dir: 'up'|'down') {
  const items = (build?.items || []).slice();
  const j = dir === 'up' ? idx - 1 : idx + 1;
  if (idx < 0 || j < 0 || idx >= items.length || j >= items.length) return;
  const tmp = items[idx]; items[idx] = items[j]; items[j] = tmp;
  await apiSend(`/apps/proxy/api/builds/${activeBuildId}`, 'PATCH', { items });
  toast('success', 'Item reordered');
  window.dispatchEvent(new CustomEvent('rbp:build-updated', { detail: { id: activeBuildId } }));
}

function exportBuild(build: any) {
  const data = JSON.stringify({ id: build?.id, name: build?.title, items: build?.items||[] }, null, 2);
  const a = document.createElement('a');
  const blob = new Blob([data], { type: 'application/json' });
  a.href = URL.createObjectURL(blob);
  a.download = `${(build?.handle||build?.id||'build')}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('success', 'Exported');
}

async function importBuild(file: File) {
  const txt = await file.text();
  let parsed: any;
  try { parsed = JSON.parse(txt); } catch { toast('error', 'Invalid JSON'); return; }
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.items)) { toast('error','Invalid schema'); return; }
  const created = await apiSend('/apps/proxy/api/builds', 'POST', { title: parsed.name || 'Imported Build', items: parsed.items });
  if (created?.id) {
    activeBuildId = created.id;
    window.dispatchEvent(new CustomEvent('rbp:active-build', { detail: { id: activeBuildId } }));
    toast('success', 'Imported');
  } else {
    toast('error', 'Import failed');
  }
}

function ensurePanel() {
  let el = document.getElementById('rbp-builds-qol');
  if (!el) {
    el = document.createElement('div');
    el.id = 'rbp-builds-qol';
    el.style.position = 'fixed';
    el.style.top = '20px';
    el.style.left = '20px';
    el.style.zIndex = '9999';
    el.style.background = '#fff';
    el.style.border = '1px solid #ccc';
    el.style.padding = '10px';
    el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
    el.innerHTML = `
      <div style="font-weight:bold;margin-bottom:6px;">Builds QoL</div>
      <div>
        <button id="rbp-dup">Duplicate</button>
        <button id="rbp-clear">Clear</button>
        <input id="rbp-import" type="file" accept="application/json" style="margin-left:6px;" />
      </div>
    `;
    document.body.appendChild(el);
    el.querySelector('#rbp-dup')!.addEventListener('click', async () => {
      if (!activeBuildId) { toast('error','No active build'); return; }
      const build = await apiGet(`/apps/proxy/api/builds/${activeBuildId}`);
      await duplicateActive(build);
    });
    el.querySelector('#rbp-clear')!.addEventListener('click', async () => {
      await clearActive();
    });
    el.querySelector('#rbp-import')!.addEventListener('change', async (e: any) => {
      const f = e.target.files?.[0]; if (f) await importBuild(f);
      e.target.value = '';
    });
  }
  return el;
}

async function wireReorderControls() {
  // naive wiring: look for elements with data-rbp-reorder
  document.querySelectorAll('[data-rbp-reorder]')?.forEach((btn) => {
    const el = btn as HTMLElement & { dataset: any };
    el.onclick = async () => {
      if (!activeBuildId) { toast('error','No active build'); return; }
      const idx = Number(el.dataset.index||'-1');
      const dir = (el.dataset.dir||'up') as 'up'|'down';
      const build = await apiGet(`/apps/proxy/api/builds/${activeBuildId}`);
      await reorderItem(build, idx, dir);
    };
  });
}

export default function init() {
  ensurePanel();
  window.addEventListener('rbp:active-build', (e: any) => {
    activeBuildId = e.detail?.id || null;
  });
  window.addEventListener('DOMContentLoaded', () => {
    wireReorderControls();
  });
}
// <!-- END RBP GENERATED: BuildsQoL -->
