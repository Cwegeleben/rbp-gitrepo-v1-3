// <!-- BEGIN RBP GENERATED: staging-app-entry-preflight-v1 -->
import { setTimeout as delay } from 'node:timers/promises';

function env(name: string): string | undefined {
  return process.env[name];
}

function needAll(keys: string[]) {
  const missing = keys.filter((k) => !env(k));
  if (missing.length) {
    console.error('[preflight:staging] missing env:', missing.join(', '));
    process.exit(1);
  }
}

async function ping(url: string) {
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text: text.slice(0, 300) };
  } catch (e) {
    return { ok: false, status: 0, text: String(e) };
  }
}

(async () => {
  const must = ['SHOPIFY_API_KEY', 'SHOPIFY_API_SECRET', 'SESSION_SECRET'];
  needAll(must);

  const origin = env('APP_URL') || 'http://localhost:8080';
  console.log('[preflight:staging] Base:', origin);

  const health = await ping(`${origin}/healthz`);
  console.log(health.ok ? 'PASS /healthz' : `FAIL /healthz (${health.status})`);

  // Brief wait helps on cold boots
  await delay(100);

  const doctor = await ping(`${origin}/app/doctor`);
  console.log(doctor.ok ? 'PASS /app/doctor' : `WARN /app/doctor (${doctor.status})`);

  const app = await ping(`${origin}/app`);
  console.log(app.ok ? 'PASS /app' : `FAIL /app (${app.status})`);

  // Partner URLs to paste
  console.log('Partner URLs to paste:');
  console.log('  App URL:     ' + `${origin}/app`);
  console.log('  Redirect:    ' + `${origin}/auth/callback`);
  console.log('  Proxy:       ' + `${origin}/apps/proxy`);

  const ok = health.ok && app.ok;
  if (!ok) process.exit(1);
  console.log('✅ preflight:staging PASS');
})();
// <!-- END RBP GENERATED: staging-app-entry-preflight-v1 -->
