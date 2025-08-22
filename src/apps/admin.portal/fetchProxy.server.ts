/*
<!-- BEGIN RBP GENERATED: tenant-admin-harden -->
*/
export type ProxyError = Error & { status?: number };

export async function fetchProxy(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(path, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers || {}),
    },
    // Ensure proxy responses aren't cached unintentionally in clients
    cache: 'no-store',
    credentials: 'same-origin',
  });
  if (!res.ok) {
  /* <!-- BEGIN RBP GENERATED: tenant-admin-smoke --> */
  // Attach helpful diagnostics for smoke scripts and local tooling
  let body = '';
  try { body = await res.text(); } catch {}
  const err: ProxyError & { url?: string; body?: string } = new Error(`Proxy error ${res.status}`);
  (err as any).status = res.status;
  (err as any).url = typeof path === 'string' ? path : '';
  (err as any).body = body?.slice(0, 400);
  /* <!-- END RBP GENERATED: tenant-admin-smoke --> */
    throw err;
  }
  return res;
}
/*
<!-- END RBP GENERATED: tenant-admin-harden -->
*/
