// <!-- BEGIN RBP GENERATED: admin-nav-dev-pages-v1-1 -->
/**
 * No-Stub Route Preflight
 * Heuristic: flags /app/* route files whose JSX likely renders trivial placeholders
 * (short files with only plain text or <pre>/<p> with JSON).
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../../src/apps/rbp-shopify-app/rod-builder-pro/app/routes');

const ROUTE_GLOB = /^app(\.|\/).+\.(t|j)sx$/;

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (ROUTE_GLOB.test(e.name)) yield p;
  }
}

function looksStubby(source: string): boolean {
  const s = source.replace(/\s+/g, ' ');
  const hasLandmark = /(role=\"main\"|role=\"table\"|data-testid=|Polaris-Page|<table|<main|<section|<div)/.test(s);
  const onlyPreOrPlain = /<pre[\s\S]*?>[\s\S]*?<\/pre>/.test(s) || !hasLandmark;
  const shortish = s.length < 1200; // source heuristic (not SSR)
  return shortish && onlyPreOrPlain && !/AbNavMenu|TitleBar|ShopHostLink/.test(s);
}

(async () => {
  const offenders: string[] = [];
  const allowList = new Set<string>([
    'src/apps/rbp-shopify-app/rod-builder-pro/app/routes/app.doctor.tsx',
  ]);
  for await (const file of walk(ROOT)) {
    const src = await fs.readFile(file, 'utf8');
    const pretty = file.replace(process.cwd()+"/", "");
    if (allowList.has(pretty)) continue;
    if (looksStubby(src)) offenders.push(pretty);
  }
  if (offenders.length) {
    console.error('No-Stub preflight failed for routes:\n' + offenders.join('\n'));
    process.exit(1);
  }
  console.log('no-stub routes preflight ok');
})();
// <!-- END RBP GENERATED: admin-nav-dev-pages-v1-1 -->
