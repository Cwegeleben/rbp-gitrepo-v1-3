// <!-- BEGIN RBP GENERATED: proxy-registry-shell-v1-1 -->
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

function assert(cond, msg) { if (!cond) { console.error('proxy-registry-shell preflight FAIL:', msg); process.exit(1); } }

const ROOT = process.cwd();
const regRoute = resolve(ROOT, 'src/apps/gateway/api-gateway/app/routes/apps.proxy.registry.json.ts');
const dotRoute = resolve(ROOT, 'src/apps/gateway/api-gateway/app/routes/apps.proxy.registry[.]json.ts');
const modRoute = resolve(ROOT, 'src/apps/gateway/api-gateway/app/routes/apps.proxy.modules.rbp-shell.$version.index[.]js.ts');

try {
  const a = readFileSync(regRoute, 'utf8');
  const b = readFileSync(dotRoute, 'utf8');
  const c = readFileSync(modRoute, 'utf8');
  assert(/export\s+async\s+function\s+loader/.test(a), 'registry.json.ts loader missing');
  assert(/export\s*\{\s*loader\s*\}/.test(b), 'registry[.]json.ts re-export missing');
  assert(/content-type\": \"text\/javascript/.test(c) || /text\/javascript/.test(c), 'module route must return JS content-type');

  // Network validation if signing available
  let signed = '';
  try { signed = execSync('pnpm -s proxy:sign').toString().trim(); } catch {}
  if (signed) {
    const regUrl = signed.replace(/\/apps\/proxy\/[^?]*/, '/apps/proxy/registry.json');
    const out = execSync(`curl -sS -D - -o /dev/null -w "status:%{http_code}\n" ${regUrl}`).toString();
    assert(/status:200/.test(out), 'registry route not 200');
    assert(/x-rbp-proxy/i.test(out), 'registry missing X-RBP-Proxy header');
    assert(/x-rbp-proxy-diag/i.test(out), 'registry missing X-RBP-Proxy-Diag header');
    const body = execSync(`curl -sS ${regUrl}`).toString();
    const reg = JSON.parse(body);
    const shell = reg?.modules?.['rbp-shell'];
    assert(shell && (shell.enabled === true || shell.enabled === 'true' || shell.enabled === '1'), 'rbp-shell.enabled must be true');
    const v = shell.default || '0.1.0';
    const p = shell.versions?.[v]?.path;
    assert(p && typeof p === 'string', 'rbp-shell version path missing');
    const modUrl = signed.replace(/\/apps\/proxy\/[^?]*/, p);
    const modHead = execSync(`curl -sS -D - -o /dev/null -w "status:%{http_code}\n" ${modUrl}`).toString();
    assert(/status:200/.test(modHead), 'module route not 200');
    assert(/content-type:.*text\/javascript/i.test(modHead), 'module content-type not JS');
  }

  console.log('proxy-registry-shell preflight OK');
} catch (e) {
  console.error('proxy-registry-shell preflight FAIL:', e?.message || e);
  process.exit(1);
}
// <!-- END RBP GENERATED: proxy-registry-shell-v1-1 -->
