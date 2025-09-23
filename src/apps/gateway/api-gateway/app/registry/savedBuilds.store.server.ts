// <!-- BEGIN RBP GENERATED: storefront-builder-m3-v1-0 -->
import fs from 'node:fs';
import path from 'node:path';

export type SavedBuild = { id: string; name: string; slots: any; totals?: any; updatedAt: number };
export type Key = { tenantId: string; customerId: string };

const ROOT = process.env.RBP_VOLUME_PATH || '/data';
const DIR = path.join(ROOT, 'rbp-saves');

function ensureDir(){
  try {
    fs.mkdirSync(DIR, { recursive: true });
  } catch {}
}
function fileFor(k: Key){ const safeTenant = (k.tenantId||'tenant').replace(/[^a-z0-9-_]/gi,'_'); const safeCust = (k.customerId||'anon').replace(/[^a-z0-9-_]/gi,'_'); return path.join(DIR, `${safeTenant}__${safeCust}.json`); }
function readList(k: Key): SavedBuild[]{ ensureDir(); const f=fileFor(k); try{ const raw=fs.readFileSync(f,'utf8'); const arr=JSON.parse(raw); return Array.isArray(arr)? arr: []; }catch{ return []; } }
function atomicWrite(f: string, data: string){
  // Ensure the destination directory exists before writing
  try {
    const dir = path.dirname(f);
    fs.mkdirSync(dir, { recursive: true });
  } catch {}
  const tmp = f + `.tmp.${Date.now()}`;
  fs.writeFileSync(tmp, data);
  fs.renameSync(tmp, f);
}

export function list(k: Key): Array<Pick<SavedBuild,'id'|'name'|'updatedAt'>>{
  const arr = readList(k).sort((a,b)=> b.updatedAt - a.updatedAt).slice(0, 20);
  return arr.map(({id,name,updatedAt})=>({ id, name, updatedAt }));
}
export function get(k: Key, id: string): SavedBuild | null {
  const arr = readList(k); return arr.find(x=>x.id===id) || null;
}
export function save(k: Key, input: { id?: string; name: string; slots: any; totals?: any }): { id: string }{
  const name = String(input?.name||'').slice(0,80) || 'Untitled';
  const id = (input?.id && String(input.id)) || (Date.now().toString(36)+Math.random().toString(36).slice(2));
  const item: SavedBuild = { id, name, slots: input?.slots||{}, totals: input?.totals||{}, updatedAt: Date.now() };
  const f = fileFor(k); const arr = readList(k);
  const dedup = arr.filter(x=>x.id!==id); dedup.unshift(item);
  // LRU trim
  const trimmed = dedup.slice(0, 20);
  atomicWrite(f, JSON.stringify(trimmed));
  return { id };
}
export function rename(k: Key, id: string, name: string){
  const f=fileFor(k); const arr = readList(k); const hit = arr.find(x=>x.id===id); if (!hit) return false; hit.name = String(name||'').slice(0,80)||hit.name; hit.updatedAt = Date.now(); atomicWrite(f, JSON.stringify(arr)); return true;
}
export function remove(k: Key, id: string){
  const f=fileFor(k); const arr = readList(k).filter(x=>x.id!==id); atomicWrite(f, JSON.stringify(arr)); return true;
}
// <!-- END RBP GENERATED: storefront-builder-m3-v1-0 -->
