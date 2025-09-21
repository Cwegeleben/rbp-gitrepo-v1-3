// <!-- BEGIN RBP GENERATED: remix-server-only-fix-v1-0 -->
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/app');

function* walk(dir: string): Generator<string> {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', '.git', 'build', 'dist'].includes(ent.name)) continue;
      yield* walk(p);
    } else if (ent.isFile() && (ent.name.endsWith('.ts') || ent.name.endsWith('.tsx'))) {
      yield p;
    }
  }
}

const offenders: string[] = [];
for (const file of walk(APP_DIR)) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split(/\r?\n/);
  lines.forEach((line, idx) => {
    // Match absolute or relative imports that reference admin.portal
    if (/from\s+['"][^'"\n]*admin\.portal\//.test(line)) {
      offenders.push(`${file}:${idx + 1}: ${line.trim()}`);
    }
  });
}

if (offenders.length) {
  console.error('Found cross-app imports from admin.portal in Shopify app:');
  console.error(offenders.join('\n'));
  process.exit(1);
}
console.log('preflight:cross-app-imports PASS');
// <!-- END RBP GENERATED: remix-server-only-fix-v1-0 -->
