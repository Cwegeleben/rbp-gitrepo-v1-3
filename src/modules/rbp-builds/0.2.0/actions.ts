// <!-- BEGIN RBP GENERATED: BuildsQoL -->
import { apiSend } from "../../../shared/sdk/client";

export type ToastFn = (kind: 'success'|'error'|'info', text: string) => void;

export function isQoLEnabled(reg: any): boolean {
  return !!reg?.flags?.['builds.qol.v1'];
}

export async function duplicateBuild(build: any, deps: { toast?: ToastFn; setActiveBuild: (id: string)=>void; refresh: ()=>void }): Promise<{ ok: boolean; id?: string }>{
  const toast = deps.toast || (()=>{});
  try {
    const name = (build?.title || 'Untitled') + ' (Copy)';
    const body = { title: name, items: build?.items || [] };
    const created = await apiSend('/apps/proxy/api/builds', 'POST', body);
    if (created?.id) {
      deps.setActiveBuild(created.id);
      toast('success', 'Build duplicated');
      deps.refresh();
      return { ok: true, id: created.id };
    }
    toast('error', 'Duplicate failed');
    return { ok: false };
  } catch {
    (deps.toast||(()=>{}))('error', 'Duplicate failed');
    return { ok: false };
  }
}

export async function reorderItems(build: any, idx: number, dir: 'up'|'down', deps: { toast?: ToastFn; onLocalUpdate: (items:any[])=>void; onRollback: ()=>void; refresh: ()=>void }): Promise<{ ok: boolean; items?: any[] }>{
  const toast = deps.toast || (()=>{});
  const items = (build?.items || []).slice();
  const j = dir === 'up' ? idx - 1 : idx + 1;
  if (j < 0 || j >= items.length) return { ok: false };
  const before = (build?.items || []).slice();
  [items[idx], items[j]] = [items[j], items[idx]];
  deps.onLocalUpdate(items);
  try {
    await apiSend(`/apps/proxy/api/builds/${build.id}`, 'PATCH', { items });
    toast('success', 'Item moved');
    deps.refresh();
    return { ok: true, items };
  } catch {
    deps.onRollback();
    toast('error', 'Reorder failed');
    return { ok: false };
  }
}

export async function clearBuild(build: any, deps: { toast?: ToastFn; onLocalUpdate: (items:any[])=>void; onRollback: ()=>void; refresh: ()=>void; confirm: ()=>boolean }): Promise<{ ok: boolean }>{
  const toast = deps.toast || (()=>{});
  if (!deps.confirm()) return { ok: false };
  const before = (build?.items || []).slice();
  deps.onLocalUpdate([]);
  try {
    await apiSend(`/apps/proxy/api/builds/${build.id}`, 'PATCH', { items: [] });
    toast('success', 'Build cleared');
    deps.refresh();
    return { ok: true };
  } catch {
    deps.onRollback();
    toast('error', 'Clear failed');
    return { ok: false };
  }
}

export function exportBuildJson(build: any, deps: { toast?: ToastFn; download: (filename: string, data: string)=>void }){
  const toast = deps.toast || (()=>{});
  const data = JSON.stringify({ id: build?.id, name: build?.title, items: build?.items||[] }, null, 2);
  const filename = `${(build?.handle||build?.id||'build')}.json`;
  deps.download(filename, data);
  toast('success', 'Exported');
}

export async function importBuildFromJson(jsonText: string, deps: { toast?: ToastFn; setActiveBuild: (id:string)=>void; refresh: ()=>void }): Promise<{ ok: boolean; id?: string }>{
  const toast = deps.toast || (()=>{});
  try {
    const parsed = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.items)) {
      toast('error', 'Invalid schema');
      return { ok: false };
    }
    const created = await apiSend('/apps/proxy/api/builds', 'POST', { title: parsed.name || 'Imported Build', items: parsed.items });
    if (created?.id) {
      deps.setActiveBuild(created.id);
      toast('success', 'Build imported');
      deps.refresh();
      return { ok: true, id: created.id };
    }
    toast('error', 'Import failed');
    return { ok: false };
  } catch {
    toast('error', 'Invalid JSON');
    return { ok: false };
  }
}
// <!-- END RBP GENERATED: BuildsQoL -->
