// <!-- BEGIN RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

function ok(m){ console.log(`[OK] ${m}`); }
function fail(m){ console.error(`[FAIL] ${m}`); process.exitCode = 1; }

try {
  // 1) Find literal >ok< patterns in gateway and embedded routes
  const grepCmd = `grep -RIn --line-number --include='*.tsx' --include='*.ts' -e '>ok<' -e 'app-embed-ok' src/apps/gateway/api-gateway/app/routes src/apps/rbp-shopify-app/rod-builder-pro/app/routes || true`;
  const out = execSync(grepCmd, {stdio:['ignore','pipe','pipe']}).toString().trim();
  if (out) fail('Found literal ok markup in routes:\n'+out);
  else ok('No literal ok markup found');

  // 2) Flag tiny SSR HTML responses in gateway routes (heuristic: HTML with <html> and length < 200)
  const filesCmd = "grep -RIl --include='*.ts' --include='*.tsx' '<html' src/apps/gateway/api-gateway/app/routes || true";
  const files = execSync(filesCmd, {stdio:['ignore','pipe','pipe']}).toString().trim().split('\n').filter(Boolean);
  for (const f of files) {
    const txt = readFileSync(f, 'utf8');
    const m = txt.match(/`([\s\S]{0,400})`/g) || [];
    for (const s of m) {
      const body = s.slice(1,-1);
      if (/<html/i.test(body) && body.length < 200) {
        fail(`Tiny HTML stub found in ${f} (len=${body.length})`);
      }
    }
  }
  if (!process.exitCode) ok('No tiny HTML stubs detected');

  if (process.exitCode) {
    console.error('no-stub-ok preflight FAIL');
    process.exit(1);
  } else {
    console.log('no-stub-ok preflight OK');
  }
} catch (e) {
  console.error('no-stub-ok preflight ERROR:', e?.message || String(e));
  process.exit(1);
}
// <!-- END RBP GENERATED: gateway-remove-ok-placeholder-v1-0 -->
