#!/usr/bin/env node
// <!-- BEGIN RBP GENERATED: tenant-dashboard-wiring-v1-0 -->
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const must = (cond, msg) => { if (!cond) { console.error(`[FAIL] ${msg}`); process.exit(1); } };
const ok = (msg) => console.log(`[OK] ${msg}`);

// 1) Inventory exists and has minimum keys
const invPath = path.join(root, 'docs/progress/inventory/tenant-app.json');
must(fs.existsSync(invPath), 'Missing docs/progress/inventory/tenant-app.json');
const inv = JSON.parse(fs.readFileSync(invPath, 'utf8'));
must(Array.isArray(inv.routes) && inv.routes.length >= 1, 'Inventory routes missing');
must(inv.proxyEndpoints && typeof inv.proxyEndpoints === 'object', 'Inventory proxyEndpoints missing');
ok('Inventory present');

// 2) Dashboard route contains Polaris Page titled "Dashboard"
const dashPath = path.join(root, 'src/apps/rbp-shopify-app/rod-builder-pro/app/routes/app._index.tsx');
must(fs.existsSync(dashPath), 'Dashboard route missing');
const dash = fs.readFileSync(dashPath, 'utf8');
must(/<Page\s+[\s\S]*title="Dashboard"/.test(dash), 'Dashboard Page title not found');

// 3) Verify it renders cards/links to required routes
for (const p of ['/app/catalog','/app/builds','/app/settings','/app/doctor']) {
  must(dash.includes(`to="${p}"`) || dash.includes(`href=\"${p}\"`), `Missing link to ${p}`);
}
ok('Dashboard links present');

// 4) Verify network calls target relative /apps/proxy paths only
const badAbs = /https?:\/\//i.test(dash);
must(!badAbs, 'Found absolute origin in Dashboard');
const hasProxyFetch = dash.includes('/apps/proxy/ping');
must(hasProxyFetch, 'Missing proxy ping fetch');

console.log('Preflight: tenant-dashboard-wiring PASS');
// <!-- END RBP GENERATED: tenant-dashboard-wiring-v1-0 -->
