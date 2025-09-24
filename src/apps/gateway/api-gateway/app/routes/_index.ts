// <!-- BEGIN RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader(args: LoaderFunctionArgs | any) {
  // Some tests may call loader with an empty object; handle gracefully
  if (!args || !args.request) {
    return new Response(null, { status: 302, headers: { Location: "/app", 'cache-control': 'no-store' } });
  }
  const { request } = args as LoaderFunctionArgs;
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop') || '';
  const hostB64 = url.searchParams.get('host') || '';
  // <!-- BEGIN RBP GENERATED: admin-embed-fix-v1 -->
  const embedded = url.searchParams.get('embedded') || '';
  const secFetchDest = request.headers.get('sec-fetch-dest') || '';
  const isEmbedded = embedded === '1' || secFetchDest === 'iframe';
  // <!-- END RBP GENERATED: admin-embed-fix-v1 -->

  // If we can infer the store slug, deep-link to the embedded app inside Shopify Admin.
  let store = '';
  if (shop) {
    store = shop.endsWith('.myshopify.com') ? shop.replace('.myshopify.com', '') : shop;
  } else if (hostB64) {
    try {
      const decoded = Buffer.from(hostB64, 'base64').toString('utf8');
      const m = decoded.match(/\/store\/([^/]+)/);
      if (m) store = m[1];
    } catch {}
  }

  if (store) {
    const target = `https://admin.shopify.com/store/${store}/apps/rod-builder-pro-2`;
    // <!-- BEGIN RBP GENERATED: admin-embed-fix-v1 -->
    // Do NOT redirect inside an iframe/embedded context; Shopify Admin cannot be framed (XFO: DENY)
    if (!isEmbedded) {
      return new Response(null, { status: 302, headers: { Location: target, 'cache-control': 'no-store' } });
    }
    // Otherwise, render a minimal embedded dashboard with relative /app links
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Rod Builder Pro — Dashboard</title>
    <style>
      :root{--fg:#111;--muted:#6b7280;--border:#e5e7eb;--bg:#fff;--btn:#111;--btnfg:#fff}
      body{margin:0;padding:24px;font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--fg);background:#f8fafc}
      .container{max-width:880px;margin:0 auto}
      .card{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:18px}
      h1{margin:0 0 8px 0;font-size:22px}
      p.caption{margin:0 0 16px 0;font-size:13px;color:var(--muted)}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
      .cta{display:inline-block;margin-top:8px;padding:10px 12px;border-radius:10px;border:1px solid var(--btn);color:var(--btn);text-decoration:none}
      .cta.primary{background:var(--btn);color:var(--btnfg)}
      footer{margin-top:20px;color:var(--muted);font-size:12px}
    </style></head><body><div class="container">
      <div class="card"><h1>Rod Builder Pro</h1><p class="caption">Embedded Dashboard</p>
        <div class="grid">
          <div>
            <div>Open the admin catalog.</div>
            <a class="cta primary" href="/app/catalog">Open Catalog</a>
          </div>
          <div>
            <div>Diagnostics</div>
            <a class="cta" href="/app/doctor">Open Doctor</a>
          </div>
        </div>
      </div>
      <footer data-testid="root-embedded">Embedded mode for ${store}</footer>
    </div></body></html>`;
    return new Response(html, { status: 200, headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'content-security-policy': "frame-ancestors https://admin.shopify.com https://*.myshopify.com",
      'X-RBP-Root-Redirect': 'skipped-embedded'
    } });
    // <!-- END RBP GENERATED: admin-embed-fix-v1 -->
  }

  // Otherwise, show a clear message (no document rendering at root)
  const msg = 'Admin UI is embedded in Shopify. Open Apps → RBP.';
  return new Response(msg, { status: 404, headers: {
    'content-type': 'text/plain; charset=utf-8',
    'cache-control': 'no-store',
    'content-security-policy': "frame-ancestors https://admin.shopify.com https://*.myshopify.com",
    // <!-- BEGIN RBP GENERATED: admin-embed-fix-v1 -->
    'X-RBP-Root-Redirect': store ? 'skipped-embedded' : 'no-store',
    // <!-- END RBP GENERATED: admin-embed-fix-v1 -->
  } });
}
// <!-- END RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
