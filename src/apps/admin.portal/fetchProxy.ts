/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
export type ProxyError = Error & { status?: number };

export async function fetchProxy(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Accept': 'application/json',
      ...(init?.headers || {}),
    },
    // APIs are no-store on server; client can cache per browser defaults
  });
  if (!res.ok) {
    const err: ProxyError = new Error(`Proxy error ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res;
}
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
