// <!-- BEGIN RBP GENERATED: app-proxy-diagnostics-v1-1 -->
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const ping = join(ROOT, 'src/apps/gateway/api-gateway/app/routes/apps.proxy.ping.ts');
const ctx = join(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/app/routes/apps.proxy.api.access.ctx.ts');
const util = join(ROOT, 'src/apps/gateway/api-gateway/app/utils/getProxyDiag.ts');

const pingSrc = readFileSync(ping, 'utf8');
const ctxSrc = readFileSync(ctx, 'utf8');
const utilSrc = readFileSync(util, 'utf8');

let failed = false;
function assert(cond, msg) {
  if (!cond) { console.error('Preflight: ' + msg); failed = true; }
}

assert(/X-RBP-Proxy/.test(pingSrc), 'ping missing X-RBP-Proxy header');
assert(/X-RBP-Proxy-Diag/.test(pingSrc), 'ping missing X-RBP-Proxy-Diag header');
assert(/getProxyDiag/.test(pingSrc), 'ping not using getProxyDiag util');
assert(/X-RBP-Proxy/.test(ctxSrc), 'ctx missing X-RBP-Proxy header');
assert(/X-RBP-Proxy-Diag/.test(ctxSrc), 'ctx missing X-RBP-Proxy-Diag header');
assert(/export function getProxyDiag/.test(utilSrc), 'getProxyDiag util missing');

if (failed) process.exit(1);
console.log('Proxy preflight OK');
// <!-- END RBP GENERATED: app-proxy-diagnostics-v1-1 -->
