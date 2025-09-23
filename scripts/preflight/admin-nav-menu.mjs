// <!-- BEGIN RBP GENERATED: admin-nav-menu-v1-0 -->
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const rootFile = resolve(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/app/root.tsx');
const navFile = resolve(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/app/components/AdminNavMenu.tsx');

function hasImportAdminNavMenu(src) {
  return /from\s+"\.\/components\/AdminNavMenu"/.test(src) && /<AdminNavMenu\s*\/>/.test(src);
}

function validateLinks(src) {
  const m = src.match(/const\s+links\s*=\s*\[(.*?)\];/s);
  if (!m) throw new Error('links array missing');
  const jsonish = '[' + m[1] + ']';
  const items = Array.from(jsonish.matchAll(/\{\s*label:\s*'([^']+)'\s*,\s*to:\s*'([^']+)'\s*\}/g)).map(x => ({ label: x[1], to: x[2] }));
  const required = [
    { label: 'Home', to: '/app' },
    { label: 'Catalog', to: '/app/catalog' },
    { label: 'Builds', to: '/app/builds' },
    { label: 'Settings', to: '/app/settings' },
    { label: 'Doctor', to: '/app/doctor' },
  ];
  for (const r of required) {
    const found = items.find(i => i.label === r.label && i.to === r.to);
    if (!found) throw new Error(`missing link: ${r.label} -> ${r.to}`);
  }
  // No absolute origins
  items.forEach(i => { if (/^https?:\/\//i.test(i.to)) throw new Error('absolute origin not allowed: ' + i.to); });
}

try {
  const rootSrc = readFileSync(rootFile, 'utf8');
  if (!hasImportAdminNavMenu(rootSrc)) {
    console.error('admin-nav-menu: root.tsx missing AdminNavMenu import or mount');
    process.exit(1);
  }
  const navSrc = readFileSync(navFile, 'utf8');
  validateLinks(navSrc);
  console.log('admin-nav-menu preflight OK');
} catch (e) {
  console.error('admin-nav-menu preflight FAIL:', e?.message || e);
  process.exit(1);
}
// <!-- END RBP GENERATED: admin-nav-menu-v1-0 -->
