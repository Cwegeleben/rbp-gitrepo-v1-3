// <!-- BEGIN RBP GENERATED: storefront-builder-m3-v1-0 -->
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const must = [
  'src/apps/gateway/api-gateway/app/routes/apps.proxy.builds.save.ts',
  'src/apps/gateway/api-gateway/app/routes/apps.proxy.builds.list.ts',
  'src/apps/gateway/api-gateway/app/routes/apps.proxy.builds.get.ts',
  'src/apps/gateway/api-gateway/app/routes/apps.proxy.builds.rename.ts',
  'src/apps/gateway/api-gateway/app/routes/apps.proxy.builds.delete.ts',
  'src/apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/assets/rbp-builder-tips.json',
  'src/apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/assets/rbp-compare-presets.json',
  'src/apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/assets/rbp-builder.js',
  'src/apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/blocks/rbp-builder.liquid',
];
for (const f of must){ const p=path.join(ROOT,f); if(!fs.existsSync(p)) throw new Error('Missing '+f); }

const js = fs.readFileSync(path.join(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/assets/rbp-builder.js'),'utf8');
if (/https?:\/\//.test(js)) throw new Error('Absolute origins not allowed');
if (!js.includes('data-customer-id') && !fs.readFileSync(path.join(ROOT,'src/apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/blocks/rbp-builder.liquid'),'utf8').includes('data-customer-id')) throw new Error('customer data attribute missing');
if (!js.includes('/builds/save') || !js.includes('/builds/list') || !js.includes('/builds/get')) throw new Error('API paths missing');

// best-effort write test
try{
  const dir = process.env.RBP_VOLUME_PATH || '/data';
  const p = path.join(dir, '.rbp-write-test');
  fs.writeFileSync(p, String(Date.now())); fs.unlinkSync(p);
}catch{}

console.log('storefront-builder-m3 preflight: PASS');
// <!-- END RBP GENERATED: storefront-builder-m3-v1-0 -->
