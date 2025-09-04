// <!-- BEGIN RBP GENERATED: admin-nav-dev-pages-v1 -->
/**
 * Fails if any raw <Link> / <NavLink> or navigate() are used in the Shopify admin app tree
 * without going through ShopHostLink/useShopHostNavigate, which preserve shop/host/embedded.
 */
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(__dirname, "../../src/apps/rbp-shopify-app/rod-builder-pro/app");

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(t|j)sx?$/.test(e.name)) yield p;
  }
}

(async () => {
  const offenders: string[] = [];
  for await (const file of walk(ROOT)) {
    const s = await fs.readFile(file, "utf8");
    const usesRaw = /(\b<NavLink\b|\b<Link\b|\bnavigate\s*\()/.test(s);
    const isOk = /ShopHostLink|useShopHostNavigate/.test(s);
    if (usesRaw && !isOk) offenders.push(file.replace(process.cwd()+"/", ""));
  }
  if (offenders.length) {
    console.error("Found raw links/navigate without host helpers:\n" + offenders.join("\n"));
    process.exit(1);
  }
  console.log("preflight ok: no offenders");
})();
// <!-- END RBP GENERATED: admin-nav-dev-pages-v1 -->
