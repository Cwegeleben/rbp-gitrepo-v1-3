// <!-- BEGIN RBP GENERATED: admin-embed-hardening-v3-1 -->
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const APP_DIR = join(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/app');

const BAD_PATTERNS = [
  /\bNavLink\b/,
  /\buseNavigate\b/,
  /\snavigate\(/,
  /from\s+['"]@remix-run\/react['"];?\s*[^\n]*\{[^}]*\bLink\b[^}]*\}/,
];

let failures = [];

function isTestPath(p) {
  return /\b__tests__\b|\btests\b|\.stories\./.test(p);
}

function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // block comments
    .replace(/^\s*\/\/.*$/gm, ''); // line comments
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(name)) {
      if (isTestPath(full)) continue;
      const src = readFileSync(full, 'utf8');
      const code = stripComments(src);
      // allow wrapper and core URL util files and NavMenu placeholder
      if (/ShopHostLink|withShopHost|shopHostNav|useShopHostNavigate\.ts|lib\/shopHost\.tsx|components\/ShopHostLink\.tsx|utils\/url\.ts|components\/NavMenu\.tsx/.test(full)) continue;
      for (const rx of BAD_PATTERNS) {
        if (rx.test(code)) {
          failures.push({ file: full.replace(ROOT + '/', ''), pattern: rx.toString() });
        }
      }
      // Absolute origins heuristic: flag only if not used in allowed contexts
      const hasHttp = /https?:\/\//i.test(code);
      if (hasHttp) {
        const allowed = /ShopHostLink[\s\S]{0,200}url=\"https?:\/\//.test(src) || /data-external=\"true\"[\s\S]{0,200}https?:\/\//.test(src);
        if (!allowed) failures.push({ file: full.replace(ROOT + '/', ''), pattern: 'absolute-origin' });
      }
    }
  }
}

walk(APP_DIR);

if (failures.length) {
  console.error('Preflight failed: forbidden patterns found');
  for (const f of failures) console.error('-', f.file, '→', f.pattern);
  process.exit(1);
}

console.log('Preflight passed: no raw Link/NavLink/navigate or absolute origins found.');
// <!-- END RBP GENERATED: admin-embed-hardening-v3-1 -->
