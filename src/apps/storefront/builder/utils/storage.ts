/* <!-- BEGIN RBP GENERATED: storefront-builder-m1-v1-0 --> */
type Entry = { id: string; name: string; slots: Record<string, any>; ts: number };

function key(tenantId: string | null) {
  return `RBP_BUILDS::${tenantId || 'anon'}`;
}

function read(tenantId: string | null): Entry[] {
  try {
    const raw = localStorage.getItem(key(tenantId));
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function write(tenantId: string | null, list: Entry[]) {
  try { localStorage.setItem(key(tenantId), JSON.stringify(list)); } catch {}
}

export function list(tenantId: string | null): Entry[] {
  return read(tenantId).sort((a,b)=> b.ts - a.ts).slice(0, 12);
}

export function save(tenantId: string | null, name: string, slots: Record<string, any>): Entry {
  const id = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(1);
  const e: Entry = { id, name: name || 'Untitled', slots, ts: Date.now() };
  const arr = read(tenantId);
  arr.unshift(e);
  const trimmed = arr
    .reduce((acc: Entry[], cur) => {
      if (!acc.find(x => x.id === cur.id)) acc.push(cur);
      return acc;
    }, [])
    .sort((a,b)=> b.ts - a.ts)
    .slice(0, 12);
  write(tenantId, trimmed);
  return e;
}

export function load(tenantId: string | null, id: string): Entry | null {
  return read(tenantId).find(e => e.id === id) || null;
}

export function remove(tenantId: string | null, id: string): void {
  const arr = read(tenantId).filter(e => e.id !== id);
  write(tenantId, arr);
}

export function rename(tenantId: string | null, id: string, name: string): void {
  const arr = read(tenantId);
  const e = arr.find(x => x.id === id);
  if (e) { e.name = name || e.name; e.ts = Date.now(); }
  write(tenantId, arr);
}
/* <!-- END RBP GENERATED: storefront-builder-m1-v1-0 --> */
