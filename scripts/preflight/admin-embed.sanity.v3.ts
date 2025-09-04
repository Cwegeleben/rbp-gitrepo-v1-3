// <!-- BEGIN RBP GENERATED: admin-embed-fix-v3 -->
import { readFileSync, existsSync } from 'node:fs';

function read(p: string) { return readFileSync(p, 'utf8'); }

let issues = 0;

// 1) Polaris AppProvider linkComponent wired to ShopHostLink in root.tsx
try {
  const root = read('src/apps/rbp-shopify-app/rod-builder-pro/app/root.tsx');
  if (!/PolarisAppProvider/.test(root) || !/linkComponent\s*=\s*\{\s*ShopHostLink/.test(root)) {
    console.error('root.tsx: expected <PolarisAppProvider linkComponent={ShopHostLink} ...>');
    issues++;
  }
} catch (e) {
  console.error('Failed reading root.tsx:', (e as Error).message);
  issues++;
}

// 2) Ensure wrapper routes exist
const needed = [
  'src/apps/rbp-shopify-app/rod-builder-pro/app/routes/app._index.tsx',
  'src/apps/rbp-shopify-app/rod-builder-pro/app/routes/app.catalog._index.tsx',
  'src/apps/rbp-shopify-app/rod-builder-pro/app/routes/app.builds._index.tsx',
  'src/apps/rbp-shopify-app/rod-builder-pro/app/routes/app.settings._index.tsx',
];
for (const f of needed) {
  if (!existsSync(f)) { console.error('missing route:', f); issues++; }
}

if (issues) process.exit(1);
console.log('admin embed sanity ok');
// <!-- END RBP GENERATED: admin-embed-fix-v3 -->
