/* <!-- BEGIN RBP GENERATED: admin-embed-nav-hardening-v1-1 --> */

function abs(path, base) {
  try { return new URL(path, base).toString(); } catch { return path; }
}

async function main() {
  const base = process.env.RBP_ADMIN_BASE_URL || process.env.SHOPIFY_APP_URL || process.env.APP_URL || process.env.BASE_URL;
  if (!base) {
    console.error('[config] Missing base URL. Set RBP_ADMIN_BASE_URL.');
    process.exit(2);
  }
  const url = abs('/app/doctor?shop=dummy.myshopify.com&host=abc&embedded=1', base);
  const res = await fetch(url, { headers: { 'accept': 'text/html' }});
  const html = await res.text();
  if (!/data-testid=\"doctor-embed-ok\"/.test(html)) {
    console.error('[smoke] doctor page missing embed-ok marker');
    console.error(html.slice(0, 400));
    process.exit(1);
  }
  console.log('[smoke] /app/doctor OK');

  // Catalog page should render and expose readiness marker
  const catUrl = abs('/app/catalog?shop=dummy.myshopify.com&host=abc&embedded=1', base);
  const catRes = await fetch(catUrl, { headers: { 'accept': 'text/html' } });
  const catHtml = await catRes.text();
  if (!/data-testid=\"admin-catalog-ready\"/.test(catHtml)) {
    console.error('[smoke] catalog page missing readiness marker');
    console.error(catHtml.slice(0, 400));
    process.exit(1);
  }
  console.log('[smoke] /app/catalog OK');
}

main().catch(e => { console.error(String(e)); process.exit(1); });
/* <!-- END RBP GENERATED: admin-embed-nav-hardening-v1-1 --> */
