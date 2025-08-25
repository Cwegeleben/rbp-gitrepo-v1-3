// <!-- BEGIN RBP GENERATED: package-tests-stable-v1 -->
type Responder = (url: string, init?: RequestInit) => Response | Promise<Response> | undefined;
type Matcher = RegExp | string | ((url: string, init?: RequestInit) => boolean);

export function mockFetch() {
  const responders: Array<Responder> = [];
  const original = globalThis.fetch;
  async function f(url: any, init?: RequestInit): Promise<Response> {
    const u = String(url);
    for (const r of responders) {
      const res = await r(u, init);
      if (res) return res;
    }
    return new Response('{}', { headers: { 'content-type': 'application/json' } });
  }
  (globalThis as any).fetch = f as any;
  const api = {
    when(match: Matcher, method?: string) {
      const isFn = typeof match === 'function';
      const m = !isFn && typeof match === 'string' ? new RegExp(match) : match;
      return {
        respondWith(status: number, json?: any, headers: Record<string, string> = { 'content-type': 'application/json' }) {
          responders.push((u, init) => {
            const methodOk = !method || (init?.method || 'GET').toUpperCase() === method.toUpperCase();
            const matchOk = isFn ? (match as Function)(u, init) : (m as RegExp).test(u);
            const ok = matchOk && methodOk;
            if (!ok) return undefined;
            if (json === undefined) return new Response(null, { status });
            return new Response(JSON.stringify(json), { status, headers });
          });
          return api;
        },
        respondOnce(status: number, json?: any, headers: Record<string, string> = { 'content-type': 'application/json' }) {
          let used = false;
          responders.push((u, init) => {
            if (used) return undefined;
            const methodOk = !method || (init?.method || 'GET').toUpperCase() === method.toUpperCase();
            const matchOk = isFn ? (match as Function)(u, init) : (m as RegExp).test(u);
            const ok = matchOk && methodOk;
            if (!ok) return undefined;
            used = true;
            if (json === undefined) return new Response(null, { status });
            return new Response(JSON.stringify(json), { status, headers });
          });
          return api;
        }
      };
    },
    restore() { (globalThis as any).fetch = original; }
  };
  return api;
}

export async function flush(n = 3) { for (let i = 0; i < n; i++) await Promise.resolve(); }
// <!-- END RBP GENERATED: package-tests-stable-v1 -->
