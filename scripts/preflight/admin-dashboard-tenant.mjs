#!/usr/bin/env -S node --enable-source-maps
/**
 * Preflight: admin-dashboard-tenant-v1-2
 * - Confirms the route uses a Polaris Page titled "Dashboard"
 * - Confirms three cards (Catalog, Builds, Settings) exist
 * - Confirms a proxy health chip is present in secondaryActions
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const file = path.join(
  root,
  'src/apps/rbp-shopify-app/rod-builder-pro/app/routes/app._index.tsx',
);

const src = fs.readFileSync(file, 'utf8');

function fail(msg) {
  console.error(`PREFAIL: ${msg}`);
  process.exit(1);
}

// Basic checks
if (!src.includes('title="Dashboard"') && !src.includes("title='Dashboard'")) {
  fail('Polaris Page with title "Dashboard" not found');
}

const cardLabels = ['Catalog', 'Builds', 'Settings'];
for (const label of cardLabels) {
  if (!src.includes(`>${label}<`) && !src.includes(`>${label}\n`)) {
    fail(`Card heading ${label} not found`);
  }
}

// Proxy chip presence in secondaryActions
if (!/secondaryActions\s*=\s*\{?\[/.test(src)) {
  fail('secondaryActions array not found');
}
if (!src.includes('Proxy')) {
  fail('Proxy health chip label not present');
}

console.log('PREFLIGHT OK: admin-dashboard-tenant-v1-2');
