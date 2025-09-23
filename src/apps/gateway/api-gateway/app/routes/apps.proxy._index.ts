// <!-- BEGIN RBP GENERATED: proxy-mini-views-v1-0 -->
import type { LoaderFunctionArgs } from "@remix-run/node";
import { shouldEnforceProxySignature, verifyShopifyProxySignature } from "../utils/appProxy";

function pageHtml(title: string, body: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${title}</title>
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
  </style></head><body><div class="container">${body}<footer>Served via App Proxy</footer></div></body></html>`;
}

// <!-- BEGIN RBP GENERATED: admin-embed-relocation-v1 -->
function adminAppUrl(shop: string, slug = 'rod-builder-pro') {
  // admin.shopify.com canonical deep link to the embedded app
  return `https://admin.shopify.com/store/${encodeURIComponent(shop)}/apps/${encodeURIComponent(slug)}`;
}
// <!-- END RBP GENERATED: admin-embed-relocation-v1 -->

function viewBody(view: string, shop: string | null) {
  if (view === "builder") {
    return pageHtml(
      "Rod Builder — Start a Build",
      `<div class="card"><h1>Rod Builder — Start a Build</h1><p class="caption">Quick launch for the storefront.</p>
        <div class="grid">
          <div>
            <!-- BEGIN RBP GENERATED: admin-embed-relocation-v1 -->
            <div>Open the embedded admin builder.</div>
            <a class="cta primary" href="${shop ? adminAppUrl(shop) : '#'}" target="_blank" rel="noopener">Open in Shopify Admin</a>
            <!-- END RBP GENERATED: admin-embed-relocation-v1 -->
          </div>
          <div>
            <div>Prefer browsing parts?</div>
            <a class="cta" href="/apps/proxy?view=catalog">Browse Parts</a>
          </div>
        </div>
      </div>`
    );
  }
  if (view === "catalog") {
    return pageHtml(
      "Parts Catalog",
      `<div class="card"><h1>Parts Catalog</h1><p class="caption">Browse parts by category.</p>
        <div class="grid">
          <div>
            <div>Open the embedded admin catalog.</div>
            <a class="cta primary" href="/app/catalog">Open Embedded Admin Catalog</a>
          </div>
          <div>
            <div>Want to build instead?</div>
            <a class="cta" href="/apps/proxy?view=builder">Start a Build</a>
          </div>
        </div>
      </div>`
    );
  }
  return pageHtml(
    "Rod Builder Pro",
    `<div class="card"><h1>Rod Builder Pro</h1><p class="caption">Choose an action to continue.</p>
      <div class="grid">
        <div>
          <div>Explore parts by category.</div>
          <a class="cta" href="/apps/proxy?view=catalog">Browse Parts</a>
        </div>
        <div>
          <div>Jump into the builder.</div>
          <a class="cta primary" href="/apps/proxy?view=builder">Start a Build</a>
        </div>
      </div>
    </div>`
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const v = (url.searchParams.get("view") || "").toLowerCase();
  // <!-- BEGIN RBP GENERATED: admin-embed-relocation-v1 -->
  // shop param is present on app proxy requests; used only to render admin.shopify.com deep links
  const shop = url.searchParams.get('shop');
  // <!-- END RBP GENERATED: admin-embed-relocation-v1 -->

  if (shouldEnforceProxySignature()) {
    if (!verifyShopifyProxySignature(url)) {
      const body = pageHtml("Unauthorized", `<div class=\"card\"><h1>Unauthorized</h1><p class=\"caption\">Invalid proxy signature.</p></div>`);
      return new Response(body, {
        status: 401,
        headers: {
          "cache-control": "no-store",
          "content-type": "text/html; charset=utf-8",
          "X-RBP-Proxy": "fail",
          "X-RBP-Proxy-Diag": `p=${url.pathname};v=${encodeURIComponent(v)}`,
        },
      });
    }
  }

  const html = viewBody(v, shop);
  return new Response(html, {
    headers: {
      "cache-control": "no-store",
      "content-type": "text/html; charset=utf-8",
      "X-RBP-Proxy": "ok",
      "X-RBP-Proxy-Diag": `p=${url.pathname};v=${encodeURIComponent(v)}`,
    },
  });
}
// <!-- END RBP GENERATED: proxy-mini-views-v1-0 -->
