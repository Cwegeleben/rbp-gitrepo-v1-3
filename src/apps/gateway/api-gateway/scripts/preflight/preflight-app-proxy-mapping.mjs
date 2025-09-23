// <!-- BEGIN RBP GENERATED: proxy-misroute-detect-v1 -->
import fs from 'node:fs';
import path from 'node:path';

const APP_DIR = process.cwd();
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
  return ignoreGlobs.some(g => {
    if (g.includes('__tests__') && fileRel.includes('__tests__/')) return true;
    if (g.includes('*.test') && /\.test\.[jt]sx?$/.test(fileRel)) return true;
    if (g.includes('*.spec') && /\.spec\.[jt]sx?$/.test(fileRel)) return true;
    return false;
  });
}

function main() {
  const pingPath = path.join(ROUTES_DIR, 'apps.proxy.ping.ts');
  const registryBracket = path.join(ROUTES_DIR, 'apps.proxy.registry[.]json.ts');
  const registryPlain = path.join(ROUTES_DIR, 'apps.proxy.registry.json.ts');

  if (!fs.existsSync(pingPath)) fail(`Missing route file: app/routes/apps.proxy.ping.ts`);
  if (!fs.existsSync(registryBracket)) fail(`Missing route file: app/routes/apps.proxy.registry[.]json.ts`);

  // If a plain-named registry exists, flag it
  if (fs.existsSync(registryPlain)) fail(`Found misnamed registry route without [.] literal: app/routes/apps.proxy.registry.json.ts`);

  // Check ignored
  const ignoreGlobs = readConfigIgnoreList();
  if (isIgnored('app/routes/apps.proxy.ping.ts', ignoreGlobs)) fail('app/routes/apps.proxy.ping.ts appears to be ignored by remix.config');
  if (isIgnored('app/routes/apps.proxy.registry[.]json.ts', ignoreGlobs)) fail('app/routes/apps.proxy.registry[.]json.ts appears to be ignored by remix.config');

  if (process.exitCode === 1) return;
  console.log('preflight:app-proxy-mapping PASS');
}

main();
// <!-- END RBP GENERATED: proxy-misroute-detect-v1 -->