// <!-- BEGIN RBP GENERATED: proxy-registry-endpoint-v1-0 -->
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const route = resolve(ROOT, 'src/apps/gateway/api-gateway/app/routes/apps.proxy.registry.json.ts');

function assert(cond, msg) { if (!cond) { console.error('proxy-registry preflight FAIL:', msg); process.exit(1); } }

try {
  const src = readFileSync(route, 'utf8');
  assert(/export\s+async\s+function\s+loader/.test(src), 'loader export missing');
  assert(/X-RBP-Proxy-Diag/.test(src), 'diag header missing');
  assert(/X-RBP-Proxy/.test(src), 'proxy header missing');
  console.log('proxy-registry preflight OK');
} catch (e) {
  console.error('proxy-registry preflight FAIL:', e?.message || e);
  process.exit(1);
}
// <!-- END RBP GENERATED: proxy-registry-endpoint-v1-0 -->
