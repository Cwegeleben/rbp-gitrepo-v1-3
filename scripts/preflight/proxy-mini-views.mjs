// <!-- BEGIN RBP GENERATED: proxy-mini-views-v1-0 -->
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const route = resolve(ROOT, 'src/apps/gateway/api-gateway/app/routes/apps.proxy._index.ts');

function assert(c, m){ if(!c){ console.error('proxy-mini-views preflight FAIL:', m); process.exit(1);} }

try {
  const src = readFileSync(route, 'utf8');
  assert(/export\s+async\s+function\s+loader/.test(src), 'loader export missing');

  // Try signed; if unavailable, optionally use RBP_PROXY_BASE; else skip network probes
  let base = '';
  try {
    const signed = execSync('pnpm -s proxy:sign').toString().trim();
    base = signed.replace(/\/apps\/proxy\/.*/, '/apps/proxy');
  } catch {}
  if (!base && process.env.RBP_PROXY_BASE) {
    const root = String(process.env.RBP_PROXY_BASE).replace(/\/$/, '');
    base = root + '/apps/proxy';
  }

  function curl(url) {
    const out = execSync(`curl -sS -D - -o - ${url}`).toString();
    const [rawHeaders, body=''] = out.split(/\r?\n\r?\n/);
    const headers = Object.fromEntries(rawHeaders.split(/\r?\n/).filter(Boolean).slice(1).map(l=>{const i=l.indexOf(':');return [l.slice(0,i).trim().toLowerCase(),l.slice(i+1).trim()] }));
    return { headers, body };
  }

  if (base) {
    const b = curl(base + '?view=builder');
    assert(/text\/html/i.test(b.headers['content-type']||''), 'builder content-type');
    assert(/x-rbp-proxy/i.test(Object.keys(b.headers).join(',')), 'builder header');
    assert(/Rod Builder — Start a Build|Start a Build/.test(b.body), 'builder HTML');
    assert(/\/app\/builds/.test(b.body), 'builder link');

    const c = curl(base + '?view=catalog');
    assert(/text\/html/i.test(c.headers['content-type']||''), 'catalog content-type');
    assert(/x-rbp-proxy/i.test(Object.keys(c.headers).join(',')), 'catalog header');
    assert(/Parts Catalog/.test(c.body), 'catalog HTML');
    assert(/\/app\/catalog/.test(c.body), 'catalog link');
  }

  console.log('proxy-mini-views preflight OK');
} catch (e) {
  console.error('proxy-mini-views preflight FAIL:', e?.message || e);
  process.exit(1);
}
// <!-- END RBP GENERATED: proxy-mini-views-v1-0 -->
