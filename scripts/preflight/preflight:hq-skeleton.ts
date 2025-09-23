// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function expect(cond: any, msg: string) {
  if (!cond) {
    console.error(`[HQ preflight] FAIL: ${msg}`);
    process.exit(1);
  }
}

// Resolve from repository root (assumes script run from repo root)
const root = process.cwd();
const apiDir = resolve(root, 'src/apps/hq.api');
const adminDir = resolve(root, 'src/apps/hq.admin');

// Folders exist
expect(existsSync(apiDir), 'src/apps/hq.api exists');
expect(existsSync(adminDir), 'src/apps/hq.admin exists');

// OpenAPI present (placeholder ok)
const serverTs = resolve(apiDir, 'server.ts');
expect(existsSync(serverTs), 'hq.api/server.ts exists');
const content = readFileSync(serverTs, 'utf8');
expect(/OPENAPI/.test(content), 'hq.api exposes OPENAPI');
const openapiFile = resolve(apiDir, 'openapi/openapi.json');
expect(existsSync(openapiFile), 'hq.api/openapi/openapi.json exists');
expect(/openapi\/types/.test(content), 'hq.api imports generated types');

// No absolute origins in hq.admin config
const adminToml = resolve(adminDir, 'shopify.app.toml');
expect(existsSync(adminToml), 'hq.admin/shopify.app.toml exists');
const toml = readFileSync(adminToml, 'utf8');
expect(/localhost:3002/.test(toml), 'hq.admin uses local 3002 for dev');

console.log('[HQ preflight] OK');
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
