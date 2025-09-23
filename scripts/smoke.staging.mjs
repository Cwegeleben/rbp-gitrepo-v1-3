// <!-- BEGIN RBP GENERATED: hosting-staging-fly-v1-1 -->
import assert from 'node:assert';
import crypto from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';

const BASE = process.env.STAGING_BASE || 'https://rbp-rod-builder-pro-staging.fly.dev';
const SHOP = process.env.SHOP || 'demo.myshopify.com';
const HOST_B64 = process.env.HOST_B64 || Buffer.from('demo.myshopify.com/admin').toString('base64');

async function get(path, tries = 3) {
  let lastErr;
  for (let i = 0; i < Math.max(1, tries); i++) {
    try {
      const res = await fetch(BASE + path, { headers: { accept: 'application/json' } });
      // Retry on transient gateway errors
      if (res.status >= 500 && res.status < 600 && i + 1 < tries) {
        await delay(250);
        continue;
      }
      return {
        status: res.status,
        json: await res.json().catch(() => ({})),
        text: await res.text().catch(() => ''),
      };
    } catch (e) {
      lastErr = e;
      if (i + 1 < tries) {
        await delay(250);
        continue;
      }
      throw e;
    }
  }
  throw lastErr || new Error('get() failed');
}

async function getText(path) {
  const res = await fetch(BASE + path, { headers: { 'accept': 'text/html' } });
  return { status: res.status, text: await res.text() };
}

function signProxyPath(path, params = {}) {
  const secret = process.env.SHOPIFY_API_SECRET || process.env.SHOPIFY_API_SECRET_KEY || '';
  if (!secret) return null;
  if (!path.startsWith('/apps/proxy')) throw new Error('signProxyPath requires /apps/proxy path');
  const qp = new URLSearchParams(params);
  const base = qp.toString() ? `${path}?${qp.toString()}` : path;
  const signature = crypto.createHmac('sha256', secret).update(base).digest('hex');
  qp.set('signature', signature);
  return `${path}?${qp.toString()}`;
}

async function main() {
  console.log('[smoke:staging] base =', BASE);
  // healthz
  let r = await get('/healthz');
  assert.equal(r.status, 200, 'healthz should 200');
  assert.equal(r.json.ok, true, 'healthz.ok true');

  // catalog
  {
    const path = signProxyPath('/apps/proxy/rbp/catalog', { shop: SHOP, ts: Math.floor(Date.now() / 1000) }) || '/apps/proxy/rbp/catalog';
    r = await get(path);
    if (path.includes('signature=')) {
      assert.equal(r.status, 200, 'catalog 200 (signed)');
    } else {
      assert.ok(r.status === 200 || r.status === 401, `catalog 200/401 (got ${r.status})`);
    }
  }
  if (r.status === 200) {
    assert.equal(r.json.ok, true, 'catalog.ok true');
    assert.ok(Array.isArray(r.json.parts), 'catalog.parts array');
  }

  // modules
  {
    const path = signProxyPath('/apps/proxy/rbp/modules', { shop: SHOP, ts: Math.floor(Date.now() / 1000) }) || '/apps/proxy/rbp/modules';
    r = await get(path);
    if (path.includes('signature=')) {
      assert.equal(r.status, 200, 'modules 200 (signed)');
    } else {
      assert.ok(r.status === 200 || r.status === 401, `modules 200/401 (got ${r.status})`);
    }
  }
  if (r.status === 200) {
    assert.equal(r.json.ok, true, 'modules.ok true');
    assert.ok(Array.isArray(r.json.modules), 'modules.modules array');
  }

  // <!-- BEGIN RBP GENERATED: admin-smoke-auth-aware-v1-0 -->
  // doctor page: pass if 200 with embed marker OR 3xx redirect to auth (no session)
  const docPath = `/app/doctor?shop=${encodeURIComponent(SHOP)}&host=${encodeURIComponent(HOST_B64)}&embedded=1`;
  const res = await fetch(BASE + docPath, {
    headers: { accept: 'text/html' },
    redirect: 'manual',
  });
  if (res.status >= 200 && res.status < 300) {
    const text = await res.text();
    assert.ok(text.includes('data-testid="doctor-embed-ok"'), 'doctor has embed marker');
  } else if (res.status >= 300 && res.status < 400) {
    const loc = res.headers.get('location') || '';
    const looksAuth = /\/auth\/(login|start)/.test(loc) || loc.includes('/auth/login');
    assert.ok(looksAuth, `doctor redirect should point to auth, got: ${loc || '(no location)'}`);
    console.log('[smoke:staging] doctor redirect:', loc);
  } else {
    const body = await res.text().catch(() => '');
    const head = body.slice(0, 400).replace(/\s+/g, ' ').trim();
    throw new Error(`doctor unexpected ${res.status} ${head}`);
  }
  // <!-- END RBP GENERATED: admin-smoke-auth-aware-v1-0 -->

  console.log('smoke:staging PASS');
}

main().catch((e) => {
  console.error('smoke:staging FAIL', e);
  process.exit(1);
});
// <!-- END RBP GENERATED: hosting-staging-fly-v1-1 -->
