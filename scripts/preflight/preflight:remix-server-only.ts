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
  if (/\.server\.(ts|tsx)$/.test(file)) continue; // server files themselves are fine
  if (/\/__tests__\//.test(file) || /\/tests\//.test(file) || /\.(spec|test)\.(ts|tsx)$/.test(file)) continue; // ignore tests
  // Resource routes and utility modules (.ts without JSX/default export) are server-only at runtime
  if (file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
  const src = fs.readFileSync(file, 'utf8');
  // Only consider files that export a default (client-bundled route components)
  if (!/export\s+default\b/.test(src)) continue;
  const lines = src.split(/\r?\n/);
  lines.forEach((line, idx) => {
    // static import from *.server
    if (/\bfrom\s+['"][^'"]*\.server(\.[a-zA-Z0-9]+)?['"]/.test(line)) {
      offenders.push(`${path.relative(ROOT, file)}:${idx + 1}: ${line.trim()}`);
    }
  });
}

if (offenders.length) {
  console.error('Found static imports of *.server in client-bundled files:');
  console.error(offenders.join('\n'));
  process.exit(1);
}
console.log('preflight:remix-server-only PASS');
// <!-- END RBP GENERATED: remix-server-only-fix-v1-0 -->
