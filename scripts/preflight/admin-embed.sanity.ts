// <!-- BEGIN RBP GENERATED: admin-host-nav-v3 -->
import { readFileSync, existsSync } from 'node:fs';

function grep(pattern: RegExp, text: string) {
  return [...text.matchAll(pattern)].map((m) => m[0]);
}

function read(path: string) {
  return readFileSync(path, 'utf8');
}

let issues = 0;

// Candidate files to scan (keep small and fast; extend as needed)
const files = [
  'src/apps/admin.portal/app/routes/app._index.tsx',
  // 'src/apps/admin.portal/app/components/ShopHostLink.tsx', // wrapper: skip
  'src/apps/admin.portal/app/hooks/useShopHostNavigate.ts',
  'src/apps/admin.portal/app/hooks/useShopHostSubmit.ts',
  'src/apps/admin.portal/BuildsPage.tsx',
  'src/apps/admin.portal/Nav.tsx',
  'src/apps/admin.portal/NavItem.tsx',
  'src/apps/admin.portal/Dashboard.tsx',
];

for (const f of files) {
  if (!existsSync(f)) continue;
  const t = read(f);
  // 1) Raw Link/NavLink/navigate
  const rawLinks = grep(/<\s*(Link|NavLink)\b(?![^>]*(ShopHostLink|HostLink))/g, t);
  let rawNav = grep(/\bnavigate\(/g, t);
  // If file opts into useShopHostNavigate, allow navigate()
  if (/useShopHostNavigate\s*\(/.test(t) || /from\s+['"]\.\.\/hooks\/useShopHostNavigate['"]/.test(t)) {
    rawNav = [];
  }
  if (rawLinks.length || rawNav.length) {
    console.log(`⚠️  ${f}: replace raw Link/NavLink/navigate with ShopHostLink/useShopHostNavigate`);
    issues++;
  }

  // 2) Absolute Admin URLs
  const absoluteInProps = grep(/\b(href|to)\s*=\s*["']https?:\/\//g, t);
  if (absoluteInProps.length) {
    console.log(`⚠️  ${f}: found absolute href/to that may break embedding`);
    issues++;
  }
}

// 3) shopify.app.toml proxy shape (quick heuristic)
const tomlPath = 'src/apps/rbp-shopify-app/rod-builder-pro/shopify.app.toml';
try {
  if (existsSync(tomlPath)) {
    const toml = read(tomlPath);
    if (!/\[app_proxy\]/m.test(toml)) {
      console.log('⚠️  shopify.app.toml: missing [app_proxy] section');
      issues++;
    }
    const hasPrefix = /prefix\s*=\s*"apps"/m.test(toml);
    const hasSubpath = /subpath\s*=\s*"proxy"/m.test(toml);
    if (!hasPrefix || !hasSubpath) {
      console.log('⚠️  shopify.app.toml: expected prefix="apps" and subpath="proxy"');
      issues++;
    }
  } else {
    console.log('ℹ️  shopify.app.toml not found at expected path; skipping proxy checks');
  }
} catch (e) {
  console.log('⚠️  error reading shopify.app.toml:', (e as Error).message);
  issues++;
}

if (issues) {
  process.exitCode = 1;
} else {
  console.log('✅ Admin embed sanity passed');
}
// Extra: basic env sanity
try {
  const envPath = 'src/apps/rbp-shopify-app/rod-builder-pro/.env';
  if (existsSync(envPath)) {
    const env = read(envPath);
    const need = ['SHOPIFY_API_KEY', 'SHOPIFY_API_SECRET'];
    const missing = need.filter((k) => !new RegExp(`^${k}=`, 'm').test(env));
    if (missing.length) console.log('ℹ️  .env missing keys:', missing.join(', '));
  } else {
    console.log('ℹ️  .env not found for Shopify app; ensure environment variables are configured');
  }
} catch {}
// <!-- END RBP GENERATED: admin-host-nav-v3 -->
