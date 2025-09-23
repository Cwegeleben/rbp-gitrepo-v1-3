// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import fs from 'node:fs';
import path from 'node:path';

function fail(msg: string): never { console.error(`[HQ preflight] FAIL: ${msg}`); process.exit(1); }
function ok(msg: string) { console.info(`[HQ preflight] OK: ${msg}`); }

const root = process.cwd();

// Assert routes exist
const routes = [
  'src/apps/hq.api/routes/hq.api.modules.ts',
  'src/apps/hq.api/routes/hq.api.tenants.$id.modules.ts',
  'src/apps/hq.api/routes/hq.api.catalog.master.ts',
  'src/apps/hq.api/routes/hq.api.pricing.books.$id.ts',
  'src/apps/hq.api/routes/hq.api.usage.$tenantId.ts',
];
for (const rel of routes) {
  if (!fs.existsSync(path.join(root, rel))) fail(`${rel} missing`);
}
ok('routes present');

// Assert OpenAPI file present
const openapiYml = path.join(root, 'docs/openapi/hq.v0.yml');
if (!fs.existsSync(openapiYml)) fail('docs/openapi/hq.v0.yml missing');
ok('openapi present');

// Assert generated types exist and are imported by at least one handler and one UI shell
const typesFile = path.join(root, 'src/apps/hq.api/types/hq.ts');
if (!fs.existsSync(typesFile)) fail('src/apps/hq.api/types/hq.ts missing');
const handler = fs.readFileSync(path.join(root, 'src/apps/hq.api/routes/hq.api.modules.ts'), 'utf8');
if (!/from '\.\.\/types\/hq'/.test(handler)) fail('handlers must import generated types');
const uiShell = fs.readFileSync(path.join(root, 'src/apps/hq.admin/app/components/hq/ModulesTable.tsx'), 'utf8');
// Accept any relative depth (../)+ and optional 'apps/' segment before hq.api/types/hq
if (!/from ['"](?:\.\.\/)+(?:apps\/)?hq\.api\/types\/hq['"]/.test(uiShell)) fail('UI shells must import generated types');
ok('types imported');

// Assert no absolute origins in hq.admin links
const adminDir = path.join(root, 'src/apps/hq.admin');
const scanFiles: string[] = [];
function walk(dir: string) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full); else if (/\.(ts|tsx)$/.test(name)) scanFiles.push(full);
  }
}
walk(adminDir);
for (const f of scanFiles) {
  const src = fs.readFileSync(f, 'utf8');
  if (/https?:\/\//i.test(src)) fail(`absolute origin found in ${path.relative(root, f)}`);
}
ok('no absolute origins in hq.admin');

console.info('[HQ preflight] OK');
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
