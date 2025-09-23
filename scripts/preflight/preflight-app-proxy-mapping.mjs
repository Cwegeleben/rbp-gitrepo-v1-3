// <!-- BEGIN RBP GENERATED: proxy-misroute-detect-v1 -->
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'src/apps/gateway/api-gateway');
const ROUTES_DIR = path.join(APP_DIR, 'app', 'routes');
const REMIX_CONFIG_TS = path.join(APP_DIR, 'remix.config.ts');
const REMIX_CONFIG_MJS = path.join(APP_DIR, 'remix.config.mjs');

function fail(msg) {
  console.error(`[preflight:app-proxy-mapping] FAIL: ${msg}`);
  process.exitCode = 1;
}

function readConfigIgnoreList() {
  const configPath = fs.existsSync(REMIX_CONFIG_TS) ? REMIX_CONFIG_TS : (fs.existsSync(REMIX_CONFIG_MJS) ? REMIX_CONFIG_MJS : null);
  if (!configPath) return [];
  const src = fs.readFileSync(configPath, 'utf8');
  const m = src.match(/ignoredRouteFiles\s*:\s*\[([\s\S]*?)\]/);
  if (!m) return [];
  const raw = m[1];
  // naive parse to extract string literals
  const re = /"([^"]+)"|'([^']+)'/g;
  const out = [];
  let mm;
  while ((mm = re.exec(raw)) !== null) {
    out.push(mm[1] ?? mm[2]);
  }
  return out;
}

function isIgnored(fileRel, ignoreGlobs) {
  // Very small matcher: we only need to catch obvious ignores present in repo (tests, __tests__).
  return ignoreGlobs.some(g => {
    if (g.includes('__tests__') && fileRel.includes('__tests__/')) return true;
    if (g.includes('*.test') && /\.test\.[jt]sx?$/.test(fileRel)) return true;
    if (g.includes('*.spec') && /\.spec\.[jt]sx?$/.test(fileRel)) return true;
    return false;
  });
}

function main() {
  const pingPath = path.join(ROUTES_DIR, 'apps.proxy.ping.ts');
  const registryPath = path.join(ROUTES_DIR, 'apps.proxy.registry.json.ts');

  // A) required files exist
  if (!fs.existsSync(pingPath)) fail(`Missing route file: app/routes/apps.proxy.ping.ts`);
  if (!fs.existsSync(registryPath)) fail(`Missing route file: app/routes/apps.proxy.registry[.]json.ts`);

  // B) ensure no wrong-named registry files exist without [.] literal
  const all = fs.readdirSync(ROUTES_DIR).filter(n => n.startsWith('apps.proxy.registry'));
  const wrong = all.filter(n => n.includes('registry.json.ts') && !n.includes('[.]'));
  for (const f of wrong) {
    fail(`Found misnamed registry route without [.] literal: app/routes/${f}`);
  }

  // C) ensure not ignored in remix.config
  const ignoreGlobs = readConfigIgnoreList();
  const relPing = 'app/routes/apps.proxy.ping.ts';
  const relReg = 'app/routes/apps.proxy.registry.json.ts';
  if (isIgnored(relPing, ignoreGlobs)) fail(`${relPing} appears to be ignored by remix.config`);
  if (isIgnored(relReg, ignoreGlobs)) fail(`${relReg} appears to be ignored by remix.config`);

  if (process.exitCode === 1) return;
  console.log('preflight:app-proxy-mapping PASS');
}

main();
// <!-- END RBP GENERATED: proxy-misroute-detect-v1 -->
