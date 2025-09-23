#!/usr/bin/env node
/*
<!-- BEGIN RBP GENERATED: admin-embed-500-harden-v1-0 -->
Preflight: admin-embed-ssr-safe
- Fails if /app index imports Node-only modules or references process.env in component render.
- Fails if any route under app/routes contains a literal '>ok<' or tiny constant SSR HTML (<200 chars).
- Passes if index contains title "Dashboard" and headings Catalog/Builds/Settings.
<!-- END RBP GENERATED: admin-embed-500-harden-v1-0 -->
*/
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ROUTES_DIR = path.join(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/app/routes');
const INDEX = path.join(ROUTES_DIR, 'app._index.tsx');

function fail(msg){
  console.error('admin-embed-ssr-safe FAIL');
  console.error('-', msg);
  process.exit(1);
}

function read(p){ try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }

const idx = read(INDEX);
if (!idx) fail('index route not found');

// Basic SSR-safety checks
if (/from\s+['"]node:fs['"]|from\s+['"]fs['"]/.test(idx)) fail('index imports fs');
if (/from\s+['"]node:path['"]|from\s+['"]path['"]/.test(idx)) fail('index imports path');
if (/process\.env/.test(idx)) fail('index references process.env in component scope');

// Title + headings
if (!/title\s*=\s*["']Dashboard["']/.test(idx)) fail('Dashboard title missing');
for (const h of ['Catalog','Builds','Settings']) {
  if (!new RegExp(`>${h}<`).test(idx)) fail(`Heading missing: ${h}`);
}

// Heuristic anti-stub
const entries = fs.readdirSync(ROUTES_DIR).filter(f=>/\.tsx?$/.test(f));
for (const f of entries) {
  const t = read(path.join(ROUTES_DIR,f)) || '';
  if (/>ok</.test(t)) fail(`stub marker (>ok<) present in ${f}`);
  // Ignore tiny proxy alias shims like apps.proxy.* that re-export loaders
  if (/^apps\.proxy\./.test(f)) continue;
  const min = t.replace(/\s+/g,' ').trim();
  if (min.length < 200) {
    // allow tiny files if they contain Remix exports or JSX
    if (!/export\s+(const|function)\s+loader|return\s*\(/.test(min)) {
      fail(`suspiciously tiny SSR output in ${f}`);
    }
  }
}

console.log('admin-embed-ssr-safe OK');
