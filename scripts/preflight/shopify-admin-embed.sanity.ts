// <!-- BEGIN RBP GENERATED: shopify-admin-host-nav-v1 -->
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';

const ROOT = 'src/apps/rbp-shopify-app/rod-builder-pro/app';
let issues = 0;
function read(p: string) { return readFileSync(p, 'utf8'); }
function walk(dir: string, out: string[] = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(f)) out.push(p);
  }
  return out;
}
function grep(re: RegExp, t: string) { return !!t.match(re); }

const files = walk(ROOT);
for (const f of files) {
  const t = read(f);
  const importsRemixLink = /from\s+['"]@remix-run\/react['"];?/.test(t);
  const importsRRDLink = /from\s+['"]react-router-dom['"];?/.test(t);
  const importsPolarisLink = /from\s+['"]@shopify\/polaris['"];?/.test(t);
  // Raw Link/NavLink/navigate (not our wrapper)
  const hasRawRouterLinks = (importsRemixLink || importsRRDLink) && grep(/<\s*(Link|NavLink)\b(?![^>]*ShopHostLink)/, t);
  const hasNavigate = /\bnavigate\(/.test(t);
  if (!f.endsWith('components/ShopHostLink.tsx') && !importsPolarisLink && (hasRawRouterLinks || hasNavigate)) {
    console.log(`⚠️  ${f}: replace raw Link/NavLink/navigate with ShopHostLink/useShopHostNavigate`);
    issues++;
  }
  // Absolute URLs in href/to that will break embedding
  const hasAbsAnchor = grep(/<\s*a\b[^>]*href\s*=\s*["']https?:\/\//, t) && !/target\s*=\s*['"]_blank['"]/i.test(t);
  const hasAbsLinkTo = grep(/<\s*(Link|NavLink)\b[^>]*to\s*=\s*["']https?:\/\//, t);
  if (!f.endsWith('/root.tsx') && (hasAbsAnchor || hasAbsLinkTo)) {
    console.log(`⚠️  ${f}: found absolute href/to that will break embedded context`);
    issues++;
  }
}
if (issues) { process.exitCode = 1; } else { console.log('✅ Shopify Admin embed sanity passed'); }
// <!-- END RBP GENERATED: shopify-admin-host-nav-v1 -->
