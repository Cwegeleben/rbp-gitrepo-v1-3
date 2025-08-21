// <!-- BEGIN RBP GENERATED: BuildsQoL -->
export async function apiGet<T=any>(path: string): Promise<T> {
  const r = await fetch(path, { cache: 'no-store' });
  if (!r.ok) throw new Error(`GET ${path} ${r.status}`);
  return r.json();
}
export async function apiSend<T=any>(path: string, method: string, body?: any): Promise<T> {
  const r = await fetch(path, { method, headers: { 'content-type': 'application/json' }, cache: 'no-store', body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(`${method} ${path} ${r.status}`);
  return r.status===204 ? (undefined as any) : r.json();
}
// <!-- BEGIN RBP GENERATED: BuildsQoL -->
export async function getRegistryFlag(flag: string): Promise<boolean> {
  try {
    const reg = await apiGet("/apps/proxy/modules/registry.json");
    return !!reg?.flags?.[flag];
  } catch { return false; }
}
export async function safeApiSend<T=any>(path: string, method: string, body?: any): Promise<{ ok: boolean; data?: T }> {
  try {
    const data = await apiSend<T>(path, method, body);
    return { ok: true, data };
  } catch {
    return { ok: false };
  }
}
// <!-- END RBP GENERATED: BuildsQoL -->
// <!-- END RBP GENERATED: BuildsQoL -->
