// <!-- BEGIN RBP GENERATED: accessv2-preflight-v1 -->
import { access, readFile } from "node:fs/promises";
import path from "node:path";

type Check = { ok: boolean; msg: string };

async function fileExists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

async function main(): Promise<number> {
  const root = process.cwd();
  const req = [
    "docs/adr/ACCESS-V2-MVP.md",
    "src/apps/gateway/api-gateway/app/proxy/access.server.ts",
    "src/apps/gateway/api-gateway/app/proxy/requireAccess.server.ts",
    "src/apps/gateway/api-gateway/app/routes/apps.rbp.api.access.ctx.ts",
    "src/apps/rbp-shopify-app/rod-builder-pro/app/routes/apps.proxy.api.access.ctx.ts",
  ];

  const routeFiles = [
    "src/apps/gateway/api-gateway/app/routes/apps.rbp.api.access.ctx.ts",
    "src/apps/rbp-shopify-app/rod-builder-pro/app/routes/apps.proxy.api.access.ctx.ts",
  ];

  const problems: string[] = [];

  // Existence checks
  for (const rel of req) {
    const ok = await fileExists(path.join(root, rel));
    if (!ok) problems.push(`MISSING ${rel}`);
  }

  // Route content checks
  for (const rel of routeFiles) {
    try {
      const content = await readFile(path.join(root, rel), "utf8");
      if (!/export\s+const\s+loader\b/.test(content)) problems.push(`NO_LOADER_EXPORT ${rel}`);
      const hasJsonHeader = /application\/json/.test(content) || /\bjson\s*\(/.test(content);
      if (!hasJsonHeader) problems.push(`NO_JSON_HEADER_OR_HELPER ${rel}`);
      if (/https?:\/\//i.test(content)) problems.push(`ABSOLUTE_URL_FORBIDDEN ${rel}`);
    } catch {
      problems.push(`READ_FAIL ${rel}`);
    }
  }

  if (problems.length === 0) {
    console.log("accessv2 preflight: OK");
    return 0;
  }
  for (const p of problems) console.error(p);
  return 1;
}

main().then((code) => { if (code !== 0) process.exit(code); }).catch((e) => { console.error("accessv2 ERROR", e?.message || e); process.exit(1); });
// <!-- END RBP GENERATED: accessv2-preflight-v1 -->
