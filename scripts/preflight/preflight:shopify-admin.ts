/* <!-- BEGIN RBP GENERATED: admin-embed-nav-hardening-v1-1 --> */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const APP_DIR = 'src/apps/rbp-shopify-app/rod-builder-pro/app';

type Finding = { file: string; line: number; text: string };

function walk(dir: string, acc: string[] = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (/\.(tsx?|jsx?)$/.test(name)) acc.push(p);
  }
  return acc;
}

function scanFile(path: string): Finding[] {
  const rel = relative(ROOT, path);
  const txt = readFileSync(path, 'utf8');
  const lines = txt.split(/\r?\n/);
  const findings: Finding[] = [];

  const riskyHref = /(href|to)\s*=\s*["']https?:/i;
  const linkImport = /import\s*\{[^}]*\b(Link|NavLink)\b[^}]*\}\s*from\s*['"]@remix-run\/react['"]/;
  const navigateImport = /import\s*\{[^}]*\buseNavigate\b[^}]*\}\s*from\s*['"]@remix-run\/react['"]/;
  const linkTag = /<\s*(Link|NavLink)(\s|>)/;
  const navigateCall = /\bnavigate\s*\(/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
  // allow external links in head tagged as data-external="true"
  // Allow data-external on same or adjacent lines
  const near = [lines[i - 1] || '', line, lines[i + 1] || ''].join('\n');
  if (riskyHref.test(line) && !/data-external=\"true\"/.test(near)) findings.push({ file: rel, line: i + 1, text: 'absolute href/to detected' });
  // Ignore our wrappers themselves
  const isWrapperFile = /lib\/shopHost\.tsx$/.test(rel) || /components\/ShopHostLink\.tsx$/.test(rel);
  const hasLinkImport = linkImport.test(txt);
  if (!isWrapperFile && hasLinkImport && linkTag.test(line)) {
      findings.push({ file: rel, line: i + 1, text: 'Link/NavLink used without ShopHostLink' });
    }
  const hasNavImport = navigateImport.test(txt);
  if (hasNavImport && navigateCall.test(line) && !/useShopHostNavigate/.test(txt)) {
      findings.push({ file: rel, line: i + 1, text: 'navigate() used without useShopHostNavigate wrapper' });
    }
  }
  return findings;
}

async function main() {
  const base = join(ROOT, APP_DIR);
  const files = walk(base);
  const all: Finding[] = files.flatMap(scanFile);
  if (all.length) {
    console.error('[preflight] Found risky patterns:');
    for (const f of all) console.error(`- ${f.file}:${f.line} ${f.text}`);
    process.exit(1);
  }
  console.log('[preflight] Shopify Admin embed/nav hardening: OK');
}

main().catch((e) => {
  console.error(String(e?.stack || e));
  process.exit(1);
});
/* <!-- END RBP GENERATED: admin-embed-nav-hardening-v1-1 --> */
