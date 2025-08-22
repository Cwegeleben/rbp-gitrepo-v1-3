/* <!-- BEGIN RBP GENERATED: tenant-admin-smoke --> */
/**
 * Tenant Admin Smoke Script
 * - GET /apps/proxy/api/access/ctx
 * - GET /apps/proxy/api/catalog/products
 * - PATCH (dry-run) /apps/proxy/api/catalog/product/:id
 * Exit codes:
 * 0 success, 1 failure, 2 configuration/env missing
 */

import { fetchProxy } from '../src/apps/admin.portal/fetchProxy.server';

function log(section: string, msg: string) {
  console.log(`[${section}] ${msg}`);
}

function getBase(): string | null {
  const base = process.env.RBP_ADMIN_BASE_URL || process.env.SHOPIFY_APP_URL || process.env.APP_URL || process.env.BASE_URL || '';
  return base || null;
}

function abs(path: string, base: string): string {
  try { return new URL(path, base).toString(); } catch { return path; }
}

async function getJson<T>(url: string, init?: RequestInit): Promise<{ res: Response; json: T }> {
  const res = await fetchProxy(url, init);
  let body: any = null;
  try { body = await res.json(); } catch {}
  return { res, json: body as T };
}

function excerpt(text: string, n = 400) {
  return text.length > n ? text.slice(0, n) + '…' : text;
}

async function main() {
  try {
    const base = getBase();
    if (!base) {
      console.error('[config] Missing base URL. Set one of: RBP_ADMIN_BASE_URL, SHOPIFY_APP_URL, APP_URL, BASE_URL');
      console.error('[hint] Example: RBP_ADMIN_BASE_URL=http://localhost:51544 pnpm smoke:admin');
      return process.exit(2);
    }
    // Access ctx
  log('access', 'GET /apps/proxy/api/access/ctx');
  const accessUrl = abs('/apps/proxy/api/access/ctx', base);
  const { res: accessRes, json: access } = await getJson<any>(accessUrl);
    if (!access?.tenant || !access?.plan) {
      console.error(`[access] Missing keys. Got: ${JSON.stringify(access).slice(0, 200)}`);
      return process.exit(1);
    }
    log('access', `OK tenant=${access.tenant?.id || '?'}, plan=${access.plan?.name || access.plan}`);

    // Catalog list
  log('catalog', 'GET /apps/proxy/api/catalog/products?q=&cursor=');
  const listUrl = abs('/apps/proxy/api/catalog/products?q=&cursor=', base);
  const { res: catRes, json: cat } = await getJson<any>(listUrl);
    if (!cat?.items || !Array.isArray(cat.items)) {
      console.error(`[catalog] Invalid payload. Got keys: ${Object.keys(cat || {}).join(',')}`);
      return process.exit(1);
    }
    const first = cat.items[0]?.id as string | undefined;
    log('catalog', `OK items=${cat.items.length}${first ? `, first=${first}` : ''}`);

    if (!first) {
      log('dry-run', 'No items found; skipping PATCH test.');
      return process.exit(0);
    }

    // Dry-run PATCH
  const path = `/apps/proxy/api/catalog/product/${encodeURIComponent(first)}`;
  const patchUrl = abs(path, base);
  log('dry-run', `PATCH ${path} (X-RBP-Dry-Run: 1)`);
  const patchRes = await fetchProxy(patchUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-RBP-Dry-Run': '1' },
      body: JSON.stringify({ enabled: true })
    });
    if (![200, 204].includes(patchRes.status)) {
      const text = await patchRes.text();
      console.error(`[dry-run] Unexpected status ${patchRes.status}\n${excerpt(text)}`);
      return process.exit(1);
    }
    log('dry-run', `OK status=${patchRes.status}`);

    return process.exit(0);
  } catch (e: any) {
    const status = e?.status;
    // Node fetch URL parse / DNS / connection issues → treat as config/env
    if (/Failed to parse URL|ENOTFOUND|ECONNREFUSED|fetch failed/i.test(String(e?.message))) {
      console.error(`[config] ${String(e?.message)}`);
      return process.exit(2);
    }
    if (status) {
      const url = e?.url ? ` url=${e.url}` : '';
      const body = e?.body ? `\n${e.body}` : '';
      console.error(`[error] HTTP ${status}${url} ${String(e?.message || '')}${body}`);
    } else {
      console.error(`[error] ${String(e?.message || e)}`);
    }
    return process.exit(1);
  }
}

if (!process.env) {
  console.error('[config] process.env unavailable');
  process.exit(2);
}

main();
/* <!-- END RBP GENERATED: tenant-admin-smoke --> */
