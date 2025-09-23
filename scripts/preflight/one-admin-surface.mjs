// <!-- BEGIN RBP GENERATED: admin-consolidation-embedded-only-v1-0 -->
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

function ok(msg){ console.log(`[OK] ${msg}`); }
function fail(msg){ console.error(`[FAIL] ${msg}`); process.exitCode = 1; }

try {
  // 1) Assert embedded app root mounts AdminNavMenu + Polaris AppProvider with linkComponent
  const rootPath = 'src/apps/rbp-shopify-app/rod-builder-pro/app/root.tsx';
  const root = readFileSync(rootPath, 'utf8');
  if (!/PolarisAppProvider/i.test(root) || !/linkComponent=\{ShopHostLink/i.test(root) || !/AdminNavMenu/i.test(root)) {
    fail('Embedded root.tsx missing AdminNavMenu or Polaris AppProvider linkComponent');
  } else ok('Embedded root.tsx has AdminNavMenu + linkComponent');

  // 2) Assert /app._index.tsx has a Polaris Page with title Dashboard
  const idx = readFileSync('src/apps/rbp-shopify-app/rod-builder-pro/app/routes/app._index.tsx','utf8');
  if (!/Page[\s\S]*title=\"Dashboard\"/.test(idx)) fail('Dashboard page missing Polaris Page title=\"Dashboard\"');
  else ok('Dashboard page has Polaris Page \'Dashboard\'');

  // 3) Ensure gateway server no longer serves an '/app' placeholder
  const server = readFileSync('src/apps/gateway/api-gateway/server.ts','utf8');
  if (/data-testid=\"app-embed-ok\"/.test(server)) fail('Gateway server still contains /app placeholder');
  else ok('Gateway /app placeholder removed');

  // 4) Ensure admin.portal exists but is not built in deploy/build commands (best-effort check)
  const pkg = JSON.parse(readFileSync('package.json','utf8'));
  const scriptsObj = pkg.scripts || {};
  const deployKeys = Object.keys(scriptsObj).filter(k => /^deploy[:\-]|^fly[:\-]|^build/.test(k));
  const deployStr = deployKeys.map(k => `${k}:${scriptsObj[k]}`).join('\n');
  if (/admin\.portal/.test(deployStr)) fail('Deploy/build scripts reference admin.portal (should be excluded)');
  else ok('Deploy/build scripts do not reference admin.portal');

  // 5) Quick grep to detect bare 'ok' markup in embedded admin routes
  try {
    const out = execSync("grep -RIn --line-number --include='*.tsx' -- '>'"+'ok<'+"' src/apps/rbp-shopify-app/rod-builder-pro/app/routes || true", {stdio:['ignore','pipe','pipe']}).toString();
    if (out.trim()) fail('Found literal ok markup in embedded routes:\n'+out.trim());
    else ok('No bare ok markup in embedded routes');
  } catch {}

  if (process.exitCode) {
    console.error('one-admin-surface preflight FAIL');
    process.exit(1);
  } else {
    console.log('one-admin-surface preflight OK');
  }
} catch (e) {
  console.error('one-admin-surface preflight ERROR:', e?.message || String(e));
  process.exit(1);
}
// <!-- END RBP GENERATED: admin-consolidation-embedded-only-v1-0 -->
