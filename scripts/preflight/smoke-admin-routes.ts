// <!-- BEGIN RBP GENERATED: admin-nav-dev-pages-v1-1 -->
/**
 * Route Landmark Smoke
 * Static scan for landmarks in /app/* route source (cheap proxy for SSR smoke).
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../../src/apps/rbp-shopify-app/rod-builder-pro/app/routes');

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/^app(\.|\/).+\.(t|j)sx$/.test(e.name)) yield p;
  }
}

function hasLandmark(source: string): boolean {
  const s = source.replace(/\s+/g, ' ');
  // Accept typical Admin embed markers too (TitleBar usage)
  return /(role=\"main\"|role=\"table\"|data-testid=|Polaris-Page|<table|<main|<section|<div|TitleBar)/.test(s);
}

(async () => {
  const missing: string[] = [];
  for await (const file of walk(ROOT)) {
    const src = await fs.readFile(file, 'utf8');
    if (!hasLandmark(src)) missing.push(file.replace(process.cwd()+"/", ""));
  }
  if (missing.length) {
    console.error('Route landmark smoke failed (no landmarks found):\n' + missing.join('\n'));
    process.exit(1);
  }
  console.log('route landmark smoke ok');
})();
// <!-- END RBP GENERATED: admin-nav-dev-pages-v1-1 -->
