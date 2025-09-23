/**
 * Preflight: no-admin-links
 * Fails if any first-party source file under ./src contains the string "admin.shopify.com".
 * Allowlist: gateway root redirect route (_index.ts) is permitted to reference admin.shopify.com.
 */
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "src");

const ALLOWLIST: Array<(file: string) => boolean> = [
  // Allow the gateway deep-link redirect at the root index route
  (f) => f.endsWith(path.normalize("src/apps/gateway/api-gateway/app/routes/_index.ts")),
  // Allow CSP header definitions that include admin.shopify.com
  (f) => f.endsWith(path.normalize("src/apps/gateway/api-gateway/app/utils/headers.server.ts")),
  (f) => f.endsWith(path.normalize("src/apps/gateway/api-gateway/app/routes/apps.proxy._index.ts")),
  // Allow new centralized embed headers util and its focused unit test which validate CSP string
  (f) => f.endsWith(path.normalize("src/apps/gateway/api-gateway/app/utils/embedHeaders.ts")),
  (f) => f.endsWith(path.normalize("src/apps/gateway/api-gateway/app/routes/__tests__/embedHeaders.test.ts")),
];

function isCodeFile(name: string) {
  return /\.(ts|tsx|js|jsx)$/i.test(name);
}

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      // No nested node_modules inside src, but guard anyway
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      yield* walk(p);
    } else if (isCodeFile(e.name)) {
      yield p;
    }
  }
}

(async () => {
  try {
    const offenders: string[] = [];
    for await (const file of walk(ROOT)) {
      const rel = path.relative(process.cwd(), file);
      const allow = ALLOWLIST.some((fn) => fn(rel));
      if (allow) continue;
      const s = await fs.readFile(file, "utf8");
      if (/admin\.shopify\.com/i.test(s)) offenders.push(rel);
    }
    if (offenders.length) {
      console.error(
        "preflight:no-admin-links failed — found admin.shopify.com in:\n" +
          offenders.join("\n")
      );
      process.exit(1);
    }
    console.log("preflight:no-admin-links ok");
  } catch (err) {
    console.error("preflight:no-admin-links error:", err);
    process.exit(1);
  }
})();
