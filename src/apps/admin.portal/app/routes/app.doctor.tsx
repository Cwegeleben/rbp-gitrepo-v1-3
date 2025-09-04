// <!-- BEGIN RBP GENERATED: admin-host-nav-v3 -->
import { useLocation, useSearchParams } from 'react-router-dom';
import { requireAdminAuth, ensureEmbeddedRedirect } from '../utils/auth.server';

export async function loader({ request }: { request: Request }) {
  const reembed = ensureEmbeddedRedirect(request);
  if (reembed) return reembed;
  const { shop } = await requireAdminAuth(request);
  const url = new URL(request.url);
  const body = JSON.stringify({
    shop,
    host: url.searchParams.get('host'),
    embedded: url.searchParams.get('embedded'),
    pathname: url.pathname,
  });
  return new Response(body, { headers: { 'Content-Type': 'application/json' } });
}

export default function Doctor() {
  const [sp] = useSearchParams();
  const { search } = useLocation();
  const url = new URLSearchParams(search);
  const shop = url.get('shop');
  const host = url.get('host');
  const embedded = url.get('embedded');
  const hasAppBridge = typeof (globalThis as any).shopify !== 'undefined';
  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1>Admin Embed Doctor</h1>
      <ul>
        <li>shop: {shop || '(missing)'}</li>
        <li>host: {host || '(missing)'}</li>
        <li>embedded: {embedded || '(missing)'}</li>
        <li>App Bridge: {hasAppBridge ? 'OK' : 'Missing'}</li>
      </ul>
      <details>
        <summary>Raw query</summary>
        <pre>{sp.toString()}</pre>
      </details>
    </div>
  );
}
// <!-- END RBP GENERATED: admin-host-nav-v3 -->
