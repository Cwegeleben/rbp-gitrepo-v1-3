// <!-- BEGIN RBP GENERATED: admin-host-nav-v1 -->
export function getHostFromSearch(search: string | URLSearchParams): string | undefined {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search;
  const host = params.get('host') || undefined;
  return host || undefined;
}

export function withHost(
  to: string | URL,
  opts?: { host?: string; search?: string | URLSearchParams; ensureEmbedded?: boolean }
): string {
  const ensureEmbedded = !!opts?.ensureEmbedded;
  const base = typeof to === 'string' ? to : to.toString();
  // Split base into path + query
  const urlLike = base.startsWith('http://') || base.startsWith('https://');
  const work = urlLike ? new URL(base) : new URL(base, 'http://localhost');
  const params = work.searchParams;

  // Determine host: explicit > from provided search
  const searchParams = opts?.search ? new URLSearchParams(opts.search) : undefined;
  const searchHost = searchParams ? searchParams.get('host') || undefined : undefined;
  const finalHost = opts?.host || searchHost;
  if (finalHost && !params.get('host')) params.set('host', finalHost);
  // Preserve embedded from provided search, or enforce when ensureEmbedded=true
  const embeddedFromSearch = searchParams ? searchParams.get('embedded') : null;
  if (embeddedFromSearch && !params.get('embedded')) params.set('embedded', embeddedFromSearch);
  if (ensureEmbedded && params.get('embedded') !== '1') params.set('embedded', '1');

  // Return without the fake origin for relative paths
  const pathWithQuery = work.pathname + (params.toString() ? `?${params.toString()}` : '');
  return urlLike ? work.toString() : pathWithQuery;
}
// <!-- END RBP GENERATED: admin-host-nav-v1 -->

// <!-- BEGIN RBP GENERATED: admin-host-nav-v2 -->
export function getParam(search: string | URLSearchParams, key: string) {
  const sp = typeof search === 'string' ? new URLSearchParams(search) : search;
  return sp.get(key) ?? undefined;
}

export function withShopHost(
  to: string | URL,
  opts: { search?: string | URLSearchParams; shop?: string; host?: string; ensureEmbedded?: boolean } = {}
): string {
  const base = typeof to === 'string' ? new URL(to, 'https://app.local') : to;
  const search = opts.search ?? base.search;
  const existing = typeof search === 'string' ? new URLSearchParams(search) : new URLSearchParams(search.toString());

  const shop = opts.shop ?? getParam(existing, 'shop');
  const host = opts.host ?? getParam(existing, 'host');
  const embedded = getParam(existing, 'embedded');

  if (shop && !base.searchParams.has('shop')) base.searchParams.set('shop', shop);
  if (host && !base.searchParams.has('host')) base.searchParams.set('host', host);

  if (opts.ensureEmbedded) base.searchParams.set('embedded', '1');
  else if (embedded) base.searchParams.set('embedded', embedded);

  const out = base.pathname + (base.searchParams.toString() ? `?${base.searchParams.toString()}` : '');
  return out;
}
// <!-- END RBP GENERATED: admin-host-nav-v2 -->
