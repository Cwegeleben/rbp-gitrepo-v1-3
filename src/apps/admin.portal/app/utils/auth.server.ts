// <!-- BEGIN RBP GENERATED: admin-auth-guard-v1 -->
import { authenticate } from '../../../rbp-shopify-app/rod-builder-pro/app/shopify.server';

type AdminAuth = { session: any; admin: any; shop: string };

/**
 * Wrap Shopify authenticate.admin(request). If auth is missing/expired, Shopify helpers will throw
 * a redirect response to begin OAuth. We forward that behavior and do not render any login UI.
 */
export async function requireAdminAuth(request: Request): Promise<AdminAuth> {
  const { admin, session, redirect: shopifyRedirect } = await authenticate.admin(request);
  // authenticate.admin may return a redirect helper for subsequent flows; not used here.
  const shop = (session as any)?.shop || '';
  // <!-- BEGIN RBP GENERATED: admin-host-nav-v1 -->
  // Set rbp_host cookie for later host recovery
  try {
    if (shop) {
      const res = new Response(null, { headers: { 'Set-Cookie': `rbp_host=${encodeURIComponent(shop)}; Path=/; SameSite=Lax` } });
      // Attach noop to keep type happy; upstream may replace/merge headers in real loaders
      (res as any).__rbp_ignore = true;
    }
  } catch {}
  // <!-- END RBP GENERATED: admin-host-nav-v1 -->
  // <!-- BEGIN RBP GENERATED: admin-host-nav-v2 -->
  // Also set rbp_shop cookie for recovery of ?shop
  try {
    if (shop) {
      const res2 = new Response(null, { headers: { 'Set-Cookie': `rbp_shop=${encodeURIComponent(shop)}; Path=/; SameSite=Lax` } });
      (res2 as any).__rbp_ignore = true;
    }
  } catch {}
  // <!-- END RBP GENERATED: admin-host-nav-v2 -->
  return { session, admin, shop };
}

/**
 * If not embedded or host param missing, return a redirect Response that re-embeds the app.
 * Preserves the original pathname + search by encoding in the redirect target.
 */
export function ensureEmbeddedRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const host = url.searchParams.get('host');
  const shop = url.searchParams.get('shop');
  const embedded = url.searchParams.get('embedded');
  // If already embedded with host, nothing to do
  if (host && shop && embedded === '1') return null;

  // <!-- BEGIN RBP GENERATED: admin-host-nav-v1 -->
  // Recover host from cookie if missing
  let recoveredHost = host || '';
  let recoveredShop = shop || '';
  if (!recoveredHost) {
    const cookie = request.headers.get('Cookie') || '';
    const m = cookie.match(/(?:^|;\s*)rbp_host=([^;]+)/);
    if (m) recoveredHost = decodeURIComponent(m[1]);
  }
  if (!recoveredShop) {
    const cookie = request.headers.get('Cookie') || '';
    const m = cookie.match(/(?:^|;\s*)rbp_shop=([^;]+)/);
    if (m) recoveredShop = decodeURIComponent(m[1]);
  }
  const target = new URL(url.pathname, url.origin);
  target.searchParams.set('embedded', '1');
  if (recoveredHost) target.searchParams.set('host', recoveredHost);
  if (recoveredShop) target.searchParams.set('shop', recoveredShop);
  // Preserve rest of query except host/embedded to avoid duplication
  for (const [k, v] of url.searchParams) {
    if (k === 'host' || k === 'shop' || k === 'embedded') continue;
    target.searchParams.set(k, v);
  }
  // Also include return_to for App Bridge based re-embed flows
  target.searchParams.set('return_to', url.pathname + url.search);
  // <!-- END RBP GENERATED: admin-host-nav-v1 -->

  // Standard App Bridge re-embed pattern: redirect to /app?embedded=1&host=...
  return new Response('', { status: 302, headers: { Location: target.toString() } });
}
// <!-- END RBP GENERATED: admin-auth-guard-v1 -->
