/*
<!-- BEGIN RBP GENERATED: hosting-staging-fly-v1-1 -->
*/
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const TARGET = join(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/app');
const ALLOW_FILE = /(__tests__|\.test\.|\.spec\.|\.stories\.|jest\.|jest\-|\/build\/)/;
const PATTERN = /(trycloudflare|http:\/\/localhost|https:\/\/localhost|https?:\/\/\S+\.(?:ngrok|cloudflare|tunnel)\S*)/i;

const offenders: Array<{ file: string; line: number; text: string }> = [];

function walk(dir: string) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full);
      continue;
    }
    if (!/\.(ts|tsx|js|jsx)$/.test(name)) continue;
    if (ALLOW_FILE.test(full)) continue;
    const content = readFileSync(full, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((ln, i) => {
      if (PATTERN.test(ln) && !/^\s*\/\//.test(ln)) {
        offenders.push({ file: full, line: i + 1, text: ln.trim() });
      }
    });
  }
}

walk(TARGET);

if (offenders.length) {
  console.error('\nAbsolute origins detected in Admin app (disallowed):');
  for (const o of offenders) console.error(`- ${o.file}:${o.line} :: ${o.text}`);
  process.exit(1);
}
console.log('preflight:no-absolute-origins PASS');
/*
<!-- END RBP GENERATED: hosting-staging-fly-v1-1 -->
*/
