// <!-- BEGIN RBP GENERATED: gateway-healthz-fix-v1-0 -->
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function fail(msg: string): never {
  console.error(`preflight:gateway-healthz FAIL — ${msg}`);
  process.exit(1);
}

function ok(msg: string) {
  console.log(msg);
}

const gatewayRoot = join(process.cwd(), 'src', 'apps', 'gateway', 'api-gateway');
const pkgPath = join(gatewayRoot, 'package.json');
const healthRoute = join(gatewayRoot, 'app', 'routes', 'healthz.ts');
const rootEntry = join(gatewayRoot, 'app', 'root.tsx');

if (!existsSync(healthRoute)) {
  fail('missing app/routes/healthz.ts');
}

if (!existsSync(rootEntry)) {
  fail('missing app/root.tsx');
}

if (!existsSync(pkgPath)) {
  fail('missing src/apps/gateway/api-gateway/package.json with start script');
}

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const scripts = pkg.scripts || {};
const start = scripts.start || '';
const build = scripts.build || '';

// Accept either remix-serve build or a custom server present in repo
const hasCustomServer = ['server.ts', 'index.ts', 'server.js', 'index.js']
  .some((f) => existsSync(join(gatewayRoot, f)));

if (!hasCustomServer) {
  const okStart = /remix-serve\s+build(\/index\.js)?/.test(start);
  if (!okStart) {
    fail('start script must be "remix-serve build" or "remix-serve build/index.js" (or add a custom server file)');
  }
  if (!/remix\s+build/.test(build)) {
    fail('build script must be "remix build"');
  }
}

ok('preflight:gateway-healthz PASS');
// <!-- END RBP GENERATED: gateway-healthz-fix-v1-0 -->

/*
# Inspect logs if 502 persists:
fly logs -a rbp-rod-builder-pro-staging --since 5m | tail -n +1

# Verify machine listening:
fly m list -a rbp-rod-builder-pro-staging
# If an old machine is stuck, recreate it:
# fly m destroy <MACHINE_ID> -a rbp-rod-builder-pro-staging && fly deploy -c src/apps/gateway/api-gateway/fly.toml -a rbp-rod-builder-pro-staging
*/
