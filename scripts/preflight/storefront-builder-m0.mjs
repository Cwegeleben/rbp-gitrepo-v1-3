#!/usr/bin/env node
// <!-- BEGIN RBP GENERATED: storefront-builder-m0-v1-0 -->
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
function ok(x){ console.log(`✔ ${x}`); }
function fail(x){ console.error(`✖ ${x}`); process.exitCode = 1; }
function read(p){ try { return fs.readFileSync(p,'utf8'); } catch { return null; } }

// Assert assets exist
const assetsDir = path.join(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/assets');
const blockDir = path.join(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/blocks');
const mustAssets = ['rbp-builder.css','rbp-builder.js','rbp-bootstrap.js','registry.mock.json'];
for (const f of mustAssets){ const p = path.join(assetsDir, f); if (fs.existsSync(p)) ok(`asset ${f}`); else fail(`missing asset ${f}`); }
const blockFile = path.join(blockDir, 'rbp-builder.liquid');
if (fs.existsSync(blockFile)) ok('block rbp-builder.liquid'); else fail('missing block rbp-builder.liquid');

// Starter export check (string search acceptable for M0)
const builderJs = read(path.join(assetsDir, 'rbp-builder.js')) || '';
if (/startBuilder\s*=/.test(builderJs) || /window\.RBP\.startBuilder/.test(builderJs)) ok('rbp-builder.js exposes startBuilder'); else fail('rbp-builder.js missing starter');

// Route existence checks
const routesDir = path.join(ROOT, 'src/apps/gateway/api-gateway/app/routes');
const mustRoutes = [
  'apps.proxy.catalog.$type.json.ts',
  'apps.proxy.builds.validate.ts',
  'apps.proxy.builds.price.ts',
  'apps.proxy.checkout.bundle.ts'
];
for (const r of mustRoutes){ const p = path.join(routesDir, r); if (fs.existsSync(p)) ok(`route ${r}`); else fail(`missing route ${r}`); }

// Verify loaders/actions exports by simple text grep
for (const r of mustRoutes){ const p = path.join(routesDir, r); const s = read(p) || ''; if (/export\s+(async\s+)?function\s+loader|export\s+const\s+loader/.test(s) || /export\s+(async\s+)?function\s+action|export\s+const\s+action/.test(s)) ok(`route exports ok: ${r}`); else fail(`route missing loader/action: ${r}`); }

// No absolute origins in builder assets
const css = read(path.join(assetsDir, 'rbp-builder.css')) || '';
if (/https?:\/\//i.test(builderJs) || /https?:\/\//i.test(css)) fail('absolute origins found in builder assets'); else ok('no absolute origins in builder assets');

if (process.exitCode) {
  console.log('Preflight: FAIL');
} else {
  console.log('Preflight: PASS');
}
// <!-- END RBP GENERATED: storefront-builder-m0-v1-0 -->
