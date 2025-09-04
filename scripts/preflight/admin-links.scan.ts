// <!-- BEGIN RBP GENERATED: admin-embed-fix-v3 -->
/**
 * Scan the Shopify app tree for raw <Link>/<NavLink>/navigate and absolute URLs.
 * Only allow when wrapped by ShopHostLink/useShopHostNavigate and relative paths.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../../src/apps/rbp-shopify-app/rod-builder-pro/app');

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(t|j)sx?$/.test(e.name)) yield p;
  }
}

/* <!-- BEGIN RBP GENERATED: admin-links-hardening-v1 --> */
(async () => {
  const offenders: string[] = [];
  let externalMarked = 0;
  let externalUnmarked = 0;
  for await (const file of walk(ROOT)) {
    // Skip the wrapper file itself
    if (/\/components\/ShopHostLink\.tsx$/.test(file)) continue;
    const s = await fs.readFile(file, 'utf8');
    // Raw Link/NavLink without our wrappers present
    const rawLink = /<\s*(Link|NavLink)\b(?![^>]*(ShopHostLink))/m.test(s);
    const rawNavigate = /\bnavigate\s*\(/m.test(s) && !/useShopHostNavigate\s*\(/m.test(s);

    // Absolute href/to detection with allowlist when data-external="true" is present
    const tagRe = /<[^>]*?>/g;
    let m: RegExpExecArray | null;
    let localMarked = 0, localUnmarked = 0;
    while ((m = tagRe.exec(s))) {
      const tag = m[0];
      const hasAbs = /\b(?:href|to)\s*=\s*["']https?:\/\//i.test(tag);
      if (!hasAbs) continue;
      const marked = /\bdata-external\s*=\s*["']true["']/i.test(tag);
      if (marked) localMarked++; else localUnmarked++;
    }
    externalMarked += localMarked;
    externalUnmarked += localUnmarked;

    if (rawLink || rawNavigate || localUnmarked > 0) offenders.push(file.replace(process.cwd()+"/", ""));
  }
  const summary = `INTERNAL OK, EXTERNAL(marked)=${externalMarked}, EXTERNAL(unmarked)=${externalUnmarked}`;
  if (offenders.length) {
    console.error('Preflight failed: admin links issues in Shopify app tree:\n' + offenders.join('\n'));
    console.error(summary);
    process.exit(1);
  }
  console.log('preflight ok: admin links safe — ' + summary);
})();
/* <!-- END RBP GENERATED: admin-links-hardening-v1 --> */
// <!-- END RBP GENERATED: admin-embed-fix-v3 -->
