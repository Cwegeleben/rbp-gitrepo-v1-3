/*
<!-- BEGIN RBP GENERATED: admin-ssr-storage-guard-v1-0 -->
*/
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const TARGET_DIR = join(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/app');
const ALLOWLIST = new Set([
  join(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/app/lib/ssrStorage.ts'),
]);

const VIOLATIONS: Array<{ file: string; line: number; text: string }> = [];

function walk(dir: string) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry)) {
      if (ALLOWLIST.has(full)) continue;
      if (full.includes('__tests__')) continue;
      if (full.includes('/build/')) continue;
      // Allow server Shopify prisma session storage wiring
      if (full.endsWith('shopify.server.ts')) continue;
      const content = readFileSync(full, 'utf8');
      const lines = content.split(/\r?\n/);
      lines.forEach((ln, i) => {
        if (/\blocalStorage\b|\bsessionStorage\b/.test(ln)) {
          VIOLATIONS.push({ file: full, line: i + 1, text: ln.trim() });
        }
      });
    }
  }
}

walk(TARGET_DIR);

if (VIOLATIONS.length) {
  console.error('\nRaw browser storage usage found (use ssrStorage instead):');
  for (const v of VIOLATIONS) {
    console.error(`- ${v.file}:${v.line} :: ${v.text}`);
  }
  process.exit(1);
}
console.log('preflight:no-raw-browser-storage PASS');
/*
<!-- END RBP GENERATED: admin-ssr-storage-guard-v1-0 -->
*/
