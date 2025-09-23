// <!-- BEGIN RBP GENERATED: root-redirect-preflight-v1 -->
// Fails if trycloudflare.com appears in Shopify config/manifests, or if embedded admin code uses
// disallowed absolute href/to or unsafe navigation (must use ShopHostLink/useShopHostNavigate).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const TARGETS = [
  join(ROOT, "src/apps/rbp-shopify-app/rod-builder-pro"),
  join(ROOT, "src/apps/admin.portal"),
];

// Allowed external origins in client hrefs (rare; prefer relative). Synthetic app.local is OK as a neutral base in util fns.
const HREF_ALLOWLIST = [
  /https?:\/\/cdn\.shopify\.com\//i,
  /https?:\/\/admin\.shopify\.com\//i,
  /https?:\/\/shopifycloud\.com\//i,
  /https?:\/\/fonts\.shopifycdn\.com\//i,
  /https?:\/\/app\.local\//i,
];

const IGNORE_DIRS = new Set([
  "node_modules",
  "build",
  ".git",
  // Generated/packaging; scanned separately for trycloudflare
  ".shopify",
  // Test and story assets are exempt from href scanning
  "__tests__",
  "__mocks__",
  "stories",
  ".storybook",
]);

function walk(dir: string, acc: string[], filterExt?: Set<string>) {
  for (const entry of readdirSync(dir)) {
    if (IGNORE_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc, filterExt);
    else if (!filterExt || filterExt.has(extname(full))) acc.push(full);
  }
}

// 1) Config scan: only fail on trycloudflare in Shopify config/manifests.
function scanConfig() {
  const offenders: { file: string; line: number; text: string }[] = [];
  const files: string[] = [];
  const shopifyAppDir = TARGETS[0];
  const CONFIG_EXTS = new Set([".toml", ".json"]);
  try { walk(shopifyAppDir, files, CONFIG_EXTS); } catch {}
  for (const f of files) {
    const txt = readFileSync(f, "utf8");
    const lines = txt.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (/trycloudflare\.com/i.test(line)) offenders.push({ file: f, line: i + 1, text: line.trim() });
    });
  }
  if (offenders.length) {
    console.error("[preflight:shopify-admin] Forbidden trycloudflare URLs in Shopify config:\n" + offenders.map(o => `${o.file}:${o.line} ${o.text}`).join("\n"));
    process.exit(1);
  }
  console.log("[preflight:shopify-admin] Shopify config: OK (no trycloudflare)");
}

// 2) Embedded admin href/nav hardening scan (code only)
const APP_DIR = 'src/apps/rbp-shopify-app/rod-builder-pro/app';
type Finding = { file: string; line: number; text: string };

function walkTs(dir: string, acc: string[] = []) {
  for (const name of readdirSync(dir)) {
    if (IGNORE_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkTs(p, acc);
    else if (/\.(tsx?|jsx?)$/.test(name)) acc.push(p);
  }
  return acc;
}

function isAllowedHref(url: string): boolean {
  return HREF_ALLOWLIST.some((re) => re.test(url));
}

function scanEmbedFile(path: string): Finding[] {
  const relPath = path.replace(ROOT + '/', '');
  const txt = readFileSync(path, 'utf8');
  const lines = txt.split(/\r?\n/);
  const findings: Finding[] = [];

  // Only flag absolute href/to in client markup unless explicitly marked external.
  // Examples allowed: cdn.shopify.com assets, admin.shopify.com deep-links, fonts, shopifycloud, synthetic app.local.
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const near = [lines[i - 1] || '', line, lines[i + 1] || ''].join('\n');
    const hrefMatch = line.match(/\b(href|to)\s*=\s*["']([^"']+)["']/i);
    if (hrefMatch) {
      const val = hrefMatch[2];
      if (/^https?:\/\//i.test(val) && !/data-external=\"true\"/i.test(near) && !isAllowedHref(val)) {
        findings.push({ file: relPath, line: i + 1, text: `absolute ${hrefMatch[1]} not allowed: ${val}` });
      }
    }
  }

  const linkImport = /import\s*\{[^}]*\b(Link|NavLink)\b[^}]*\}\s*from\s*['"]@remix-run\/react['"]/;
  const navigateImport = /import\s*\{[^}]*\buseNavigate\b[^}]*\}\s*from\s*['"]@remix-run\/react['"]/;
  const linkTag = /<\s*(Link|NavLink)(\s|>)/;
  const navigateCall = /\bnavigate\s*\(/;

  const isWrapperFile = /lib\/shopHost\.tsx$/.test(relPath) || /components\/ShopHostLink\.tsx$/.test(relPath);
  const hasLinkImport = linkImport.test(txt);
  if (!isWrapperFile && hasLinkImport && linkTag.test(txt)) {
    findings.push({ file: relPath, line: 1, text: 'Link/NavLink used without ShopHostLink' });
  }
  const hasNavImport = navigateImport.test(txt);
  if (hasNavImport && navigateCall.test(txt) && !/useShopHostNavigate/.test(txt)) {
    findings.push({ file: relPath, line: 1, text: 'navigate() used without useShopHostNavigate wrapper' });
  }
  return findings;
}

async function runAll() {
  scanConfig();
  const base = join(ROOT, APP_DIR);
  let files: string[] = [];
  try { files = walkTs(base); } catch {}
  // Filter out test/story files defensively
  files = files.filter((f) => !/(__tests__|\.stories\.|\.story\.|\.test\.)/.test(f));
  const all: Finding[] = files.flatMap(scanEmbedFile);
  if (all.length) {
    console.error('[preflight:shopify-admin] Embed/nav hardening violations:');
    for (const f of all) console.error(`- ${f.file}:${f.line} ${f.text}`);
    process.exit(1);
  }
  console.log('[preflight:shopify-admin] Embed/nav hardening: OK');
}

runAll().catch((e) => {
  console.error(String(e?.stack || e));
  process.exit(1);
});
// <!-- END RBP GENERATED: root-redirect-preflight-v1 -->
