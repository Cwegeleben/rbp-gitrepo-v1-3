#!/usr/bin/env node
// <!-- BEGIN RBP GENERATED: storefront-builder-m1-v1-0 -->
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ok = (m)=>console.log(`✔ ${m}`);
const fail = (m)=>{ console.error(`✖ ${m}`); process.exitCode = 1; };
const read = (p)=>{ try { return fs.readFileSync(p,'utf8'); } catch { return ''; } };

// Files
const codec = 'src/apps/storefront/builder/utils/codec.ts';
const storage = 'src/apps/storefront/builder/utils/storage.ts';
const rail = 'src/apps/storefront/builder/SavedBuildsRail.ts';
const live = 'src/apps/storefront/builder/CompatLiveRegion.ts';
const themeJs = 'src/apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/assets/rbp-builder.js';
const guidesSets = 'src/apps/gateway/api-gateway/app/routes/apps.proxy.catalog.guides-sets.json.ts';

for (const f of [codec, storage, rail, live, themeJs]){
  const p = path.join(root, f);
  if (fs.existsSync(p)) ok(`file ${f}`); else fail(`missing ${f}`);
}

const codecSrc = read(path.join(root, codec));
if (/encodeBuild\(/.test(codecSrc) && /decodeBuild\(/.test(codecSrc)) ok('codec exports encodeBuild/decodeBuild'); else fail('codec missing encodeBuild/decodeBuild');

const js = read(path.join(root, themeJs));
if (/\?b=/.test(js) && /navigator\.clipboard/.test(js)) ok('rbp-builder.js references share (?b=) flow'); else fail('rbp-builder.js missing share flow');
if (!/https?:\/\//i.test(js)) ok('no absolute origins in rbp-builder.js'); else fail('absolute origins found in rbp-builder.js');

// Optional: guides-sets wrapper exists and returns JSON shape
if (fs.existsSync(path.join(root, guidesSets))) ok('guides-sets route present');

if (process.exitCode) console.log('Preflight: FAIL'); else console.log('Preflight: PASS');
// <!-- END RBP GENERATED: storefront-builder-m1-v1-0 -->
