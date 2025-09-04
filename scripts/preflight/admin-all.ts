/* <!-- BEGIN RBP GENERATED: admin-preflight-runner-v1 --> */
import process from 'node:process';
import { spawn } from 'node:child_process';
import { sleep } from './utils/sleep';

type Step = {
  name: string;
  script: string; // package.json script name to run via pnpm -s <script>
  optional?: boolean; // only for embedded smoke
  enabled?: () => boolean; // gate via env
};

type Result = { name: string; ok: boolean; code: number; ms: number };

function parseArgs(argv: string[]) {
  const out: { bail: boolean; delayMs: number } = { bail: false, delayMs: 150 };
  for (const a of argv) {
    if (a === '--bail') out.bail = true;
    else if (a.startsWith('--delay-ms=')) {
      const n = Number(a.split('=')[1]);
      if (!Number.isNaN(n)) out.delayMs = Math.max(0, n);
    }
  }
  return out;
}

function runScript(script: string): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn('pnpm', ['-s', script], { stdio: 'inherit' });
    child.on('close', (code) => resolve(typeof code === 'number' ? code : 1));
    child.on('error', () => resolve(1));
  });
}

async function runStep(step: Step): Promise<Result> {
  const started = Date.now();
  const label = `\n=== ${step.name} ===`;
  console.log(label);
  try {
    const code = await runScript(step.script);
    if (code !== 0) throw Object.assign(new Error('step failed'), { exitCode: code });
    const ms = Date.now() - started;
    console.log(`[${step.name}] PASS in ${ms}ms`);
    return { name: step.name, ok: true, code: 0, ms };
  } catch (e: any) {
    const ms = Date.now() - started;
    const code = typeof e?.exitCode === 'number' ? e.exitCode : 1;
    console.log(`[${step.name}] FAIL (code ${code}) in ${ms}ms`);
    return { name: step.name, ok: false, code, ms };
  }
}

async function main() {
  const { bail, delayMs } = parseArgs(process.argv.slice(2));
  const hasEmbed = !!process.env.DEV_EMBED_BASE_URL;

  const steps: Step[] = [
    { name: 'preflight:admin-links', script: 'preflight:admin-links' },
    { name: 'preflight:no-stub-routes', script: 'preflight:no-stub-routes' },
    { name: 'preflight:admin-embed', script: 'preflight:admin-embed' },
    { name: 'smoke:admin-routes', script: 'smoke:admin-routes' },
    {
      name: 'smoke:admin-embedded',
      script: 'smoke:admin-embedded',
      optional: true,
      enabled: () => hasEmbed,
    },
  ];

  console.log('Admin Preflight Runner — sequential mode');
  console.log(`Options: bail=${bail ? 'on' : 'off'}, delayMs=${delayMs}`);
  if (!hasEmbed) console.log('Note: DEV_EMBED_BASE_URL not set — skipping embedded HTTP smoke');

  const results: Result[] = [];
  for (const step of steps) {
    if (step.optional && step.enabled && !step.enabled()) {
      console.log(`\n=== ${step.name} (skipped) ===`);
      results.push({ name: step.name, ok: true, code: 0, ms: 0 });
      continue;
    }
    const r = await runStep(step);
    results.push(r);
    if (bail && !r.ok) {
      console.log('\nBail enabled — stopping on first failure.');
      printSummary(results);
      process.exit(r.code || 1);
    }
    if (delayMs > 0) await sleep(delayMs);
  }

  const failed = results.filter((r) => !r.ok);
  printSummary(results);
  process.exit(failed.length ? failed[0].code || 1 : 0);
}

function printSummary(results: Result[]) {
  console.log('\n=== Summary ===');
  for (const r of results) {
    const status = r.ms === 0 ? 'SKIP' : r.ok ? 'PASS' : 'FAIL';
    const timing = r.ms ? `${r.ms}ms` : '-';
    console.log(`${pad(r.name, 26)}  ${pad(status, 5)}  ${timing}`);
  }
}

function pad(s: string, n: number) {
  return (s + ' '.repeat(n)).slice(0, n);
}

main().catch((e) => {
  console.error('admin-all runner failed:', e?.message || e);
  process.exit(1);
});
/* <!-- END RBP GENERATED: admin-preflight-runner-v1 --> */
