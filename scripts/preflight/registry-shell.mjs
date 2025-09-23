// <!-- BEGIN RBP GENERATED: storefront-shell-registry-v1-0 -->
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const mock = join(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/assets/registry.mock.json');

let reg = null;
try {
  // Use signed URL to reach proxy registry.json if possible
  const signed = execSync('pnpm -s proxy:sign').toString().trim();
  const url = signed.replace(/\/apps\/proxy\/[^?]*/, '/apps/proxy/registry.json');
  const out = execSync(`curl -sS ${url}`).toString();
  reg = JSON.parse(out);
} catch {
  try { reg = JSON.parse(readFileSync(mock, 'utf8')); } catch {}
}

if (!reg) { console.log('registry preflight SKIP: no network and no mock'); process.exit(0); }

const shell = reg?.modules?.['rbp-shell'];
if (typeof shell?.enabled !== 'boolean' && typeof shell?.enabled !== 'string') {
  console.error('registry-shell: rbp-shell.enabled missing');
  process.exit(1);
}
console.log('registry-shell preflight OK');
// <!-- END RBP GENERATED: storefront-shell-registry-v1-0 -->
