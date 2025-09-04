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
  // <!-- BEGIN RBP GENERATED: admin-host-nav-v3 -->
  // Set cookies for recovery of host/shop on subsequent requests
  try {
    if (shop) {
      const h = new Headers();
      h.append('Set-Cookie', `rbp_shop=${encodeURIComponent(shop)}; Path=/; SameSite=Lax`);
      h.append('Set-Cookie', `rbp_host=${encodeURIComponent(shop)}; Path=/; SameSite=Lax`);
      // attach to a throwaway response to satisfy types; router/loaders may merge headers
      new Response(null, { headers: h });
    }
  } catch {}
  // <!-- END RBP GENERATED: admin-host-nav-v3 -->
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

  // <!-- BEGIN RBP GENERATED: admin-host-nav-v3 -->
  // Recover host/shop from cookies if missing
  let recoveredHost = host || '';
  let recoveredShop = shop || '';
  const cookie = request.headers.get('Cookie') || '';
  if (!recoveredHost) {
    const m = cookie.match(/(?:^|;\s*)rbp_host=([^;]+)/);
    if (m) recoveredHost = decodeURIComponent(m[1]);
  }
  if (!recoveredShop) {
    const m = cookie.match(/(?:^|;\s*)rbp_shop=([^;]+)/);
    if (m) recoveredShop = decodeURIComponent(m[1]);
  }
  const target = new URL(url.pathname, url.origin);
  // Always ensure embedded=1
  target.searchParams.set('embedded', '1');
  if (recoveredHost) target.searchParams.set('host', recoveredHost);
  if (recoveredShop) target.searchParams.set('shop', recoveredShop);
  // Preserve any other params
  for (const [k, v] of url.searchParams) {
    if (k === 'host' || k === 'shop' || k === 'embedded') continue;
    target.searchParams.set(k, v);
  }
  // Provide return_to to allow client re-embed flows to bounce back
  target.searchParams.set('return_to', url.pathname + url.search);
  // <!-- END RBP GENERATED: admin-host-nav-v3 -->

  // Standard App Bridge re-embed pattern: redirect to /app?embedded=1&host=...
  return new Response('', { status: 302, headers: { Location: target.toString() } });
}
// <!-- END RBP GENERATED: admin-auth-guard-v1 -->
