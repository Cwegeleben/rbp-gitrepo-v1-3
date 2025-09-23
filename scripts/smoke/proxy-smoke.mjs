// <!-- BEGIN RBP GENERATED: ci-proxy-smoke-v1 -->
/**
 * CI proxy smoke against staging
 * Requirements:
 * - env: STORE_DOMAIN, SHOPIFY_API_SECRET
 * - endpoints: /apps/proxy/ping, /apps/proxy/registry.json
 * Behavior:
 * - unsigned -> expect 401
 * - signed   -> expect 200 JSON
 */

import crypto from 'node:crypto';

const BASE = process.env.RBP_STAGING_BASE || 'https://rbp-rod-builder-pro-staging.fly.dev';
const STORE_DOMAIN = process.env.STORE_DOMAIN || 'rbp-dev.myshopify.com';
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || '';

function hmac(url) {
  if (!SHOPIFY_API_SECRET) throw new Error('Missing SHOPIFY_API_SECRET');
  const u = new URL(url, BASE);
  // canonical message: path + sorted query (excluding signature/hmac)
  const params = new URLSearchParams(u.searchParams);
  params.delete('signature');
  params.delete('hmac');
  const sorted = [...params.entries()].sort(([a],[b]) => a.localeCompare(b));
  const qs = new URLSearchParams(sorted).toString();
  const message = u.pathname + (qs ? `?${qs}` : '');
  const expected = crypto.createHmac('sha256', SHOPIFY_API_SECRET).update(message).digest('hex');
  u.searchParams.set('signature', expected);
  return u.toString();
}

async function get(url, opts={}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), opts.timeoutMs ?? 10000);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: 'manual', headers: { 'User-Agent': 'RBP CI Smoke' } });
    const ct = res.headers.get('content-type') || '';
    let body = null;
    if (ct.includes('application/json')) {
      try { body = await res.json(); } catch {}
    } else {
      try { body = await res.text(); } catch {}
    }
    return { status: res.status, body, headers: res.headers };
  } finally { clearTimeout(t); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

function print(name, ok, info='') {
  const mark = ok ? 'PASS' : 'FAIL';
  console.log(`${mark} ${name}${info ? ` — ${info}` : ''}`);
}

async function checkUnsigned(path) {
  const url = new URL(path, BASE).toString();
  const r = await get(url);
  const ok = r.status === 401;
  print(`unsigned ${path}`, ok, `status=${r.status}`);
  assert(ok, `Expected 401 for unsigned ${path}, got ${r.status} (${typeof r.body === 'string' ? r.body.slice(0,120) : JSON.stringify(r.body)})`);
}

async function checkSigned(path) {
  const url = hmac(path);
  const r = await get(url);
  const ok = r.status >= 200 && r.status < 300 && r.body && typeof r.body === 'object';
  print(`signed ${path}`, ok, `status=${r.status}`);
  assert(ok, `Expected 2xx JSON for signed ${path}, got ${r.status} (${typeof r.body === 'string' ? r.body.slice(0,120) : JSON.stringify(r.body)})`);
}

async function main() {
  await checkUnsigned('/apps/proxy/ping');
  await checkUnsigned('/apps/proxy/registry.json');

  // Signed checks (no secret echoed)
  await checkSigned('/apps/proxy/ping');
  await checkSigned('/apps/proxy/registry.json');

  console.log('Proxy smoke PASSED');
}

main().catch((e) => {
  console.error('Proxy smoke FAILED:', e.message);
  process.exit(1);
});
// <!-- END RBP GENERATED: ci-proxy-smoke-v1 -->
