// <!-- BEGIN RBP GENERATED: admin-dashboard-v1-0 -->
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const route = resolve(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/app/routes/app._index.tsx');

function assert(cond, msg) { if (!cond) { console.error('admin-dashboard preflight FAIL:', msg); process.exit(1); } }

try {
  const src = readFileSync(route, 'utf8');
  assert(/Page\s*[\s\S]*title\s*=\s*["']Dashboard["']/.test(src), 'Polaris Page with title "Dashboard" missing');
  // three ShopHostLink destinations
  assert(/ShopHostLink[^>]*to\s*=\s*["']\/app\/catalog["']/.test(src), 'Catalog link missing');
  assert(/ShopHostLink[^>]*to\s*=\s*["']\/app\/builds["']/.test(src), 'Builds link missing');
  assert(/ShopHostLink[^>]*to\s*=\s*["']\/app\/settings["']/.test(src), 'Settings link missing');
  console.log('admin-dashboard preflight OK');
} catch (e) {
  console.error('admin-dashboard preflight FAIL:', e?.message || e);
  process.exit(1);
}
// <!-- END RBP GENERATED: admin-dashboard-v1-0 -->
