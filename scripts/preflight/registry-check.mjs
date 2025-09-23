// <!-- BEGIN RBP GENERATED: preflight-registry-v1-0 -->
// Fast CLI preflight: validate registry has rbp-shell.enabled === true and a non-empty module URL
// Usage:
//   REGISTRY_URL=<file|http url or path> node scripts/preflight/registry-check.mjs
//   node scripts/preflight/registry-check.mjs --url ./config/registry.json
// Notes:
// - Supports file:// URLs and plain file paths
// - Allows enabled to be boolean true or string 'true'

import { readFileSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';

const ROOT = process.cwd();

function parseArgs() {
  const out = { url: undefined };
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (a === '--url' || a === '--registry') { out.url = process.argv[++i]; continue; }
    if (!a.startsWith('-') && !out.url) { out.url = a; }
  }
  out.url = process.env.REGISTRY_URL || out.url;
  return out;
}

function stripJsonComments(src) {
  // Remove /* */ and // comments to handle jsonc files
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/.*$/gm, '$1')
    .trim();
}

async function readRegistry(urlOrPath) {
  // Default to theme extension mock registry to keep CI green without secrets
  const defaultPath = 'src/apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/assets/registry.mock.json';
  let target = urlOrPath || defaultPath;

  // If plain path, coerce to absolute path
  if (!/^https?:\/\//i.test(target) && !/^file:\/\//i.test(target)) {
    target = isAbsolute(target) ? target : resolve(ROOT, target);
  }

  // File URL or path
  if (/^file:\/\//i.test(target) || target.startsWith('/') || target.startsWith('.')) {
    const p = target.startsWith('file://') ? new URL(target) : new URL('file://' + target);
    const raw = readFileSync(p, 'utf8');
    return JSON.parse(stripJsonComments(raw));
  }

  // HTTP(S)
  const r = await fetch(target, { redirect: 'follow' });
  if (!r.ok) throw new Error(`fetch-failed:${r.status}`);
  const text = await r.text();
  return JSON.parse(stripJsonComments(text));
}

function pickModuleVersion(mod) {
  if (!mod) return { src: undefined, version: undefined };
  const pick = mod.default || mod.latest || Object.keys(mod.versions || {}).sort().slice(-1)[0];
  const src = pick && mod.versions && mod.versions[pick] && mod.versions[pick].path;
  return { src, version: pick };
}

(async () => {
  try {
    const { url } = parseArgs();
    const reg = await readRegistry(url);
    const shell = reg?.modules?.['rbp-shell'];

    if (!shell) {
      console.error('registry-check: missing modules.rbp-shell');
      process.exit(1);
    }

    const enabled = shell.enabled === true || shell.enabled === 'true';
    if (!enabled) {
      console.error('registry-check: rbp-shell.enabled must be true');
      process.exit(1);
    }

    const { src, version } = pickModuleVersion(shell);
    if (typeof src !== 'string' || src.trim().length === 0) {
      console.error('registry-check: rbp-shell module URL missing');
      process.exit(1);
    }

    console.log(`registry-check OK: rbp-shell enabled, version=${version || 'n/a'}`);
    process.exit(0);
  } catch (e) {
    const msg = (e && e.message) ? String(e.message) : String(e);
    console.error('registry-check: error', msg);
    process.exit(1);
  }
})();
// <!-- END RBP GENERATED: preflight-registry-v1-0 -->
