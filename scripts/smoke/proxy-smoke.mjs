// <!-- BEGIN RBP GENERATED: app-proxy-diagnostics-v1-1 -->
import { execSync } from 'node:child_process';

function curl(url) {
  const out = execSync(`curl -sS -D - -o /dev/null -w "status:%{http_code}\n" ${url}`).toString();
  const lines = out.trim().split(/\r?\n/);
  const statusLine = lines.find(l => l.startsWith('status:')) || 'status:000';
  const status = parseInt(statusLine.split(':')[1], 10);
  const headers = Object.fromEntries(lines
    .filter(l => /:/g.test(l) && !/^status:/.test(l))
    .map(l => { const idx = l.indexOf(':'); return [l.slice(0, idx).trim().toLowerCase(), l.slice(idx+1).trim()]; }));
  return { status, headers };
}

let signed = '';
try {
  signed = execSync('pnpm -s proxy:sign').toString().trim();
} catch (e) {
  console.log('Proxy smoke SKIP: cannot sign without SHOPIFY_API_SECRET');
  process.exit(0);
}

const pingUrl = signed.replace(/\/apps\/proxy\/[^?]*/, '/apps/proxy/ping');
const ctxUrl = signed.replace(/\/apps\/proxy\/[^?]*/, '/apps/proxy/api/access/ctx');
// <!-- BEGIN RBP GENERATED: proxy-registry-endpoint-v1-0 -->
const regUrl = signed.replace(/\/apps\/proxy\/[^?]*/, '/apps/proxy/registry.json');
// <!-- END RBP GENERATED: proxy-registry-endpoint-v1-0 -->

const ping = curl(pingUrl);
if (ping.status !== 200) throw new Error('ping not 200: ' + ping.status);
if (!ping.headers['x-rbp-proxy'] || !/ok|fail/.test(ping.headers['x-rbp-proxy'])) throw new Error('ping missing x-rbp-proxy');
if (!ping.headers['x-rbp-proxy-diag']) throw new Error('ping missing x-rbp-proxy-diag');

const ctx = curl(ctxUrl);
if (ctx.status !== 200) throw new Error('ctx not 200: ' + ctx.status);
if (!ctx.headers['x-rbp-proxy']) throw new Error('ctx missing x-rbp-proxy');
if (!ctx.headers['x-rbp-proxy-diag']) throw new Error('ctx missing x-rbp-proxy-diag');

// <!-- BEGIN RBP GENERATED: proxy-registry-endpoint-v1-0 -->
const reg = curl(regUrl);
if (reg.status !== 200) throw new Error('registry not 200: ' + reg.status);
if (!reg.headers['x-rbp-proxy']) throw new Error('registry missing x-rbp-proxy');
if (!reg.headers['x-rbp-proxy-diag']) throw new Error('registry missing x-rbp-proxy-diag');
console.log('Registry smoke OK');
// <!-- END RBP GENERATED: proxy-registry-endpoint-v1-0 -->

// <!-- BEGIN RBP GENERATED: proxy-registry-shell-v1-1 -->
// Fetch registry JSON to locate rbp-shell module
const regBody = JSON.parse(execSync(`curl -sS ${regUrl}`).toString());
const shell = regBody?.modules?.['rbp-shell'];
if (!shell || !shell.versions || !shell.default) throw new Error('rbp-shell missing in registry');
const shellPath = shell.versions[shell.default]?.path;
if (!shellPath) throw new Error('rbp-shell default path missing');
const modUrl = signed.replace(/\/apps\/proxy\/[^?]*/, shellPath);
const mod = curl(modUrl);
if (mod.status !== 200) throw new Error('shell module not 200: ' + mod.status);
if (!/text\/javascript/i.test(mod.headers['content-type'] || '')) throw new Error('shell module content-type incorrect');
if (!mod.headers['x-rbp-proxy']) throw new Error('module missing x-rbp-proxy');
if (!mod.headers['x-rbp-proxy-diag']) throw new Error('module missing x-rbp-proxy-diag');
console.log('Shell module smoke OK');
// <!-- END RBP GENERATED: proxy-registry-shell-v1-1 -->

// <!-- BEGIN RBP GENERATED: proxy-mini-views-v1-0 -->
// Exercise mini views via signed URLs
const base = signed.replace(/\/(apps\/proxy)\/.*/, '/$1');
function curlText(url) {
  const out = execSync(`curl -sS -D - -o /dev/null -w "status:%{http_code}\ncontent-type:%{content_type}\n" ${url}`).toString();
  const lines = out.trim().split(/\r?\n/);
  const status = Number((lines.find(l=>l.startsWith('status:'))||'status:0').split(':')[1]);
  const ctype = (lines.find(l=>l.startsWith('content-type:'))||'content-type:').split(':')[1] || '';
  return { status, ctype };
}

const mv1 = curlText(base + '?view=builder');
if (mv1.status !== 200) throw new Error('mini-view builder not 200');
if (!/text\/html/i.test(mv1.ctype)) throw new Error('mini-view builder content-type');
const mv2 = curlText(base + '?view=catalog');
if (mv2.status !== 200) throw new Error('mini-view catalog not 200');
if (!/text\/html/i.test(mv2.ctype)) throw new Error('mini-view catalog content-type');
console.log('Proxy mini views smoke OK');
// <!-- END RBP GENERATED: proxy-mini-views-v1-0 -->

console.log('Proxy smoke OK');
// <!-- END RBP GENERATED: app-proxy-diagnostics-v1-1 -->
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
