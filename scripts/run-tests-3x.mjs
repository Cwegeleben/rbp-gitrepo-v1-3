// <!-- BEGIN RBP GENERATED: qa-validate-v1 -->
import { spawn } from 'node:child_process';

function runOnce(args) {
  return new Promise((resolve) => {
    const p = spawn('pnpm', ['test', '--', ...args], { stdio: 'inherit' });
    p.on('close', (code) => resolve(code === 0));
  });
}

async function main() {
  const passthrough = process.argv.slice(2);
  const results = [];
  for (let i = 1; i <= 3; i++) {
    console.log(`\n▶ run ${i}/3 ${passthrough.length ? `(args: ${passthrough.join(' ')})` : ''}`);
    const ok = await runOnce(passthrough);
    results.push(ok);
    console.log(ok ? `✔ run ${i} passed` : `✖ run ${i} failed`);
    if (!ok) break; // fail fast
  }
  const passed = results.filter(Boolean).length;
  console.log(`\nSummary: ${passed}/3 runs passed`);
  process.exit(passed === 3 ? 0 : 1);
}

main().catch((err) => { console.error(err); process.exit(1); });
// <!-- END RBP GENERATED: qa-validate-v1 -->
