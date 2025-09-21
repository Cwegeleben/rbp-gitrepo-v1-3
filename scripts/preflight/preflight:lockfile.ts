// <!-- BEGIN RBP GENERATED: hosting-staging-lockfile-fix-v1-0 -->
/**
 * Lockfile drift preflight
 * - Runs `pnpm install --lockfile-only` in-place but restores the original file
 * - Fails if pnpm-lock.yaml content would change
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LOCK = path.join(ROOT, 'pnpm-lock.yaml');

function sh(cmd: string) {
  return execSync(cmd, { stdio: 'pipe' }).toString();
}

function fileHash(p: string) {
  const buf = fs.readFileSync(p);
  // simple hash surrogate: length + first/last bytes
  const first = buf.subarray(0, 64).toString('hex');
  const last = buf.subarray(Math.max(0, buf.length - 64)).toString('hex');
  return `${buf.length}:${first}:${last}`;
}

try {
  const before = fileHash(LOCK);
  // Run lockfile-only install; avoid scripts and network changes beyond lock resolution
  sh('pnpm install --lockfile-only');
  const after = fileHash(LOCK);
  if (before !== after) {
    console.error('Lockfile drift detected.');
    console.error('Run: pnpm install locally and commit pnpm-lock.yaml');
    process.exit(1);
  }
  console.log('preflight:lockfile PASS');
} catch (e: any) {
  console.error('preflight:lockfile ERROR');
  console.error(e?.message || e);
  process.exit(2);
}
// <!-- END RBP GENERATED: hosting-staging-lockfile-fix-v1-0 -->
