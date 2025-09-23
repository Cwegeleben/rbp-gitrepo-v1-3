// <!-- BEGIN RBP GENERATED: storefront-builder-m2-v1-0 -->
import fs from 'node:fs';
import path from 'node:path';

function assertFile(p){ if(!fs.existsSync(p)) throw new Error('Missing file: '+p); }
function read(p){ return fs.readFileSync(p,'utf8'); }
function fail(m){ throw new Error(m); }

const ROOT = process.cwd();
const files = [
  'src/apps/storefront/builder/recent/RecentlyViewed.ts',
  'src/apps/storefront/builder/price/PriceLadder.ts',
  'src/apps/storefront/builder/weight/WeightEstimator.ts',
  'src/apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/sections/rbp-builder-seo.liquid',
  'src/apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/assets/rbp-builder.js',
  'src/apps/gateway/api-gateway/app/routes/apps.proxy.recs.upsell.json.ts',
];

for (const f of files) assertFile(path.join(ROOT, f));

const js = read(path.join(ROOT, 'src/apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/assets/rbp-builder.js'));
if (/https?:\/\//.test(js)) fail('Absolute origins are not allowed in rbp-builder.js');

console.log('storefront-builder-m2 preflight: PASS');
// <!-- END RBP GENERATED: storefront-builder-m2-v1-0 -->
