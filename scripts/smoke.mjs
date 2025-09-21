/**
 * RBP smoke test for App Proxy endpoints.
 * - Local (assumes dev server at http://localhost:3000)
 * - Storefront (uses storefront password to set cookie)
 */

const SHOP_DOMAIN = process.env.SHOP_DOMAIN || process.env.RBP_STORE_DOMAIN || 'rbp-dev.myshopify.com';
const STOREFRONT_PASSWORD = process.env.STOREFRONT_PASSWORD || process.env.RBP_STOREFRONT_PASSWORD || '';

const localBase = process.env.RBP_LOCAL_BASE || 'http://localhost:3000';
const storeBase = `https://${SHOP_DOMAIN}`;

/** Minimal cookie jar for a single domain */
const cookieJar = {
  cookies: new Map(),
  setFrom(setCookieHeaders = []) {
    for (const header of setCookieHeaders) {
      const [pair] = header.split(';');
      const [k, v] = pair.split('=');
      if (k && typeof v !== 'undefined') this.cookies.set(k.trim(), v.trim());
    }
  },
  header() {
    if (this.cookies.size === 0) return undefined;
    return Array.from(this.cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  },
};

function getSetCookieHeaders(res) {
  if (typeof res.headers.getSetCookie === 'function') return res.headers.getSetCookie();
  const raw = res.headers.raw?.();
  return (raw && raw['set-cookie']) || [];
}

async function fetchWithCookies(url, opts = {}, maxRedirects = 5) {
  let currentUrl = url;
  let method = (opts.method || 'GET').toUpperCase();
  let body = opts.body;
  let redirects = 0;
  let lastRes = null;

  while (redirects <= maxRedirects) {
    const headers = new Headers(opts.headers || {});
    headers.set('User-Agent', headers.get('User-Agent') || 'Mozilla/5.0 (RBP Smoke)');
    const cookieHeader = cookieJar.header();
    if (cookieHeader) headers.set('cookie', cookieHeader);

    const res = await fetch(currentUrl, { ...opts, method, body, headers, redirect: 'manual' });
    const setCookies = getSetCookieHeaders(res);
    if (setCookies && setCookies.length) cookieJar.setFrom(setCookies);

    // Not a redirect
    if (![301, 302, 303, 307, 308].includes(res.status)) {
      lastRes = res;
      break;
    }

    // Follow redirects manually
    const location = res.headers.get('location');
    if (!location) { lastRes = res; break; }
    const nextUrl = new URL(location, currentUrl).toString();
    // Per fetch spec, 303 should change method to GET
    if (res.status === 303) { method = 'GET'; body = undefined; }
    currentUrl = nextUrl;
    redirects += 1;
  }
  return lastRes;
}

async function tryJson(res) {
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json') || ct.includes('text/json')) {
    try { return await res.json(); } catch {}
  }
  try { return await res.text(); } catch { return null; }
}

async function check(name, url, predicate) {
  const out = { name, url, ok: false, status: 0, body: null, note: '' };
  try {
    const res = await fetchWithCookies(url, name.includes('HEAD') ? { method: 'HEAD' } : {});
    out.status = res.status;
    out.body = name.includes('HEAD') ? null : await tryJson(res);
    // Storefront password gate detection
    const loc = res.headers.get('location') || '';
    if (res.status === 302 && /\/password$/.test(loc)) {
      out.ok = true;
      out.note = 'SKIP: Storefront password gate';
      return out;
    }
    out.ok = typeof predicate === 'function' ? !!predicate(out) : res.ok;
    if (!out.ok) {
      // Include first ~200 chars of response body for debugging
      const bodyStr = typeof out.body === 'string' ? out.body : JSON.stringify(out.body);
      if (bodyStr && bodyStr.length > 0) {
        out.note = bodyStr.substring(0, 200);
      }
    }
  } catch (e) {
    out.note = e?.message || String(e);
  }
  return out;
}

function print(results) {
  const rows = results.map(r => ({
    check: r.name,
    status: r.status || '-',
    ok: r.ok ? 'PASS' : 'FAIL',
    note: r.note || '',
  }));
  console.table(rows);
}

async function main() {
  const results = [];

  // Local proxy checks
  const localEndpoints = [
    { name: 'local: ping', url: `${localBase}/apps/proxy/ping`, pred: r => r.status === 200 && r.body?.ok === true },
    { name: 'local: boot.js', url: `${localBase}/apps/proxy/boot.js`, pred: r => r.status === 200 && (r.body === null || typeof r.body === 'string') && (r.status === 200) },
    { name: 'local: registry.json', url: `${localBase}/apps/proxy/modules/registry.json`, pred: r => r.status === 200 && r.body && typeof r.body === 'object' },
    { name: 'local: module HEAD', url: `${localBase}/apps/proxy/modules/rbp-shell/0.1.0/index.js`, pred: r => r.status === 200 },
    { name: 'local: ctx', url: `${localBase}/apps/proxy/api/access/ctx?domain=${SHOP_DOMAIN}`, pred: r => r.status === 200 && r.body?.tenant?.domain === SHOP_DOMAIN },
    // Catalog endpoints
    { name: 'local: catalog.collections', url: `${localBase}/apps/proxy/api/catalog/collections`, pred: r => r.status === 200 && Array.isArray(r.body) && r.body.length > 0 },
    { name: 'local: catalog.products', url: `${localBase}/apps/proxy/api/catalog/products?limit=5`, pred: r => r.status === 200 && Array.isArray(r.body) },
    // Catalog search endpoint
    { name: 'local: catalog.search (q=test, limit=5)', url: `${localBase}/apps/proxy/api/catalog/search?q=test&limit=5`, pred: r => r.status === 200 && Array.isArray(r.body) && r.body.length <= 5 },
  { name: 'local: catalog.search (q empty)', url: `${localBase}/apps/proxy/api/catalog/search?q=`, pred: r => r.status === 200 && Array.isArray(r.body) && r.body.length === 0 },
  // <!-- BEGIN RBP GENERATED: storefront-proxy-e2e-v1-0 -->
  // RBP Storefront sample endpoints
  { name: 'local: rbp.catalog', url: `${localBase}/apps/proxy/rbp/catalog`, pred: r => r.status === 200 && r.body?.ok === true && Array.isArray(r.body.parts) },
  // <!-- END RBP GENERATED: storefront-proxy-e2e-v1-0 -->
  // <!-- BEGIN RBP GENERATED: storefront-cart-e2e-v1-1 -->
  { name: 'local: rbp.modules', url: `${localBase}/apps/proxy/rbp/modules`, pred: r => r.status === 200 && r.body?.ok === true && Array.isArray(r.body.modules) },
  { name: 'local: rbp.variantsBySku', url: `${localBase}/apps/proxy/rbp/variantsBySku`, pred: r => r.status === 200 && r.body?.ok === true && r.body.map && typeof r.body.map === 'object' },
  // <!-- END RBP GENERATED: storefront-cart-e2e-v1-1 -->
  ];
  for (const ep of localEndpoints) {
    const r = await check(ep.name, ep.url, ep.pred);
    results.push(r);
  }

  // Storefront proxy checks (enabled with RBP_SMOKE_STORE=1)
  const runStore = process.env.RBP_SMOKE_STORE === '1';
  if (runStore) {
    const storeEndpoints = [
      { name: 'store: ping', url: `${storeBase}/apps/proxy/ping`, pred: r => r.status === 200 && r.body?.ok === true },
      { name: 'store: boot.js', url: `${storeBase}/apps/proxy/boot.js`, pred: r => r.status === 200 && (r.body === null || typeof r.body === 'string') && (r.status === 200) },
      { name: 'store: registry.json', url: `${storeBase}/apps/proxy/modules/registry.json`, pred: r => r.status === 200 && r.body && typeof r.body === 'object' },
      { name: 'store: module HEAD', url: `${storeBase}/apps/proxy/modules/rbp-shell/0.1.0/index.js`, pred: r => r.status === 200 },
  { name: 'store: ctx', url: `${storeBase}/apps/proxy/api/access/ctx?domain=${SHOP_DOMAIN}`, pred: r => r.status === 200 && r.body?.tenant?.domain === SHOP_DOMAIN },
    ];
    for (const ep of storeEndpoints) results.push(await check(ep.name, ep.url, ep.pred));
  } else {
    results.push({ name: 'store: checks skipped', url: storeBase, ok: true, status: '-', body: null, note: 'Set RBP_SMOKE_STORE=1 to attempt.' });
  }

  print(results);

  const critical = results.filter(r => r.name.startsWith('local:'));
  const failed = critical.filter(r => !r.ok);
  if (failed.length > 0) {
    console.error(`\nSmoke FAILED: ${failed.length}/${critical.length} store checks failed.`);
    process.exit(1);
  }
  console.log('\nSmoke PASSED');
}

main();
