/* <!-- BEGIN RBP GENERATED: admin-links-hardening-v1 --> */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../../src/apps/rbp-shopify-app/rod-builder-pro/app');
const SHOP_HOST_LINK = path.join(ROOT, 'components/ShopHostLink');
const HOST_NAV_HOOK = path.join(ROOT, 'hooks/useShopHostNavigate');

type Edit = { file: string; changes: string[] };

function parseArgs(argv: string[]) {
  return { dry: argv.includes('--dry') } as const;
}

async function* walk(dir: string): AsyncGenerator<string> {
  let entries: any[] = [];
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(t|j)sx?$/.test(e.name)) yield p;
  }
}

function relImport(fromFile: string, targetNoExtAbs: string) {
  const fromDir = path.dirname(fromFile);
  let rel = path.relative(fromDir, targetNoExtAbs).split(path.sep).join('/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

function replaceTagsToHostLink(src: string): { text: string; count: number } {
  let count = 0;
  const openRe = /<\s*(Link|NavLink)\b/g;
  const closeRe = /<\/\s*(Link|NavLink)\s*>/g;
  let text = src.replace(openRe, () => { count++; return '<ShopHostLink'; });
  text = text.replace(closeRe, '</ShopHostLink>');
  return { text, count };
}

function ensureImport(text: string, file: string, symbol: 'ShopHostLink' | 'useShopHostNavigate'): { text: string; added: boolean } {
  const has = new RegExp(`\b${symbol}\b`).test(text) && /from\s+['"]/.test(text);
  if (has) return { text, added: false };
  const target = symbol === 'ShopHostLink' ? SHOP_HOST_LINK : HOST_NAV_HOOK;
  const rel = relImport(file, target);
  const imp = symbol === 'ShopHostLink'
    ? `import ShopHostLink from '${rel}';\n`
    : `import { useShopHostNavigate } from '${rel}';\n`;
  return { text: imp + text, added: true };
}

function rewriteUseNavigate(text: string): { text: string; count: number } {
  let count = 0;
  // replace import useNavigate (keep others)
  text = text.replace(/import\s+\{([^}]*?)\}\s+from\s+['"]react-router-dom['"];?/g, (m, inside) => {
    if (!/useNavigate/.test(inside)) return m;
    const cleaned = inside.replace(/\buseNavigate\s*,?\s*/g, (seg) => { count++; return ''; }).replace(/,\s*}/, '}');
    return `import { ${cleaned.trim()} } from 'react-router-dom';`;
  });
  // calls
  text = text.replace(/\buseNavigate\s*\(/g, () => { count++; return 'useShopHostNavigate('; });
  return { text, count };
}

function markExternalLinks(text: string, log: string[]): { text: string; marked: number; schemeRel: number; badInternal: number } {
  let marked = 0, schemeRel = 0, badInternal = 0;
  // absolute http(s)
  const tagRe = /<([A-Za-z][^\s/>]*)([^>]*?)>/g;
  text = text.replace(tagRe, (full, name, attrs) => {
    const hasAbs = /\b(?:href|to)\s*=\s*(["'])https?:\/\//.test(attrs);
    if (!hasAbs) return full;
    const already = /\bdata-external\s*=\s*(["'])true\1/i.test(attrs);
    if (already) return full; // explicit, leave
    marked++;
    return `<${name}${attrs} data-external="true">`;
  });
  // scheme-relative //
  const tagRe2 = /<([A-Za-z][^\s/>]*)([^>]*?)>/g;
  text = text.replace(tagRe2, (full, name, attrs) => {
    const hasAbs = /\b(?:href|to)\s*=\s*(["'])\/\//.test(attrs);
    if (!hasAbs) return full;
    const already = /\bdata-external\s*=\s*(["'])true\1/i.test(attrs);
    if (already) return full;
    schemeRel++;
    return `<${name}${attrs} data-external="true">`;
  });
  // warn on internal paths not under /app
  const internalTagRe = /<([A-Za-z][^\s/>]*)([^>]*?)>/g;
  text.replace(internalTagRe, (full, _n, attrs) => {
    const m = attrs.match(/\b(?:href|to)\s*=\s*(["'])\/(?!app\b)([^"']*)\1/);
    if (m) badInternal++;
    return full;
  });
  if (schemeRel > 0) log.push(`  marked scheme-relative externals: ${schemeRel}`);
  if (badInternal > 0) log.push(`  WARN: found ${badInternal} internal links not under /app`);
  return { text, marked, schemeRel, badInternal };
}

async function main() {
  const { dry } = parseArgs(process.argv.slice(2));
  const edits: Edit[] = [];
  const inventory: string[] = [];
  for await (const file of walk(ROOT)) {
    const s = await fs.readFile(file, 'utf8');
    const importsRRD = /from\s+['"]react-router-dom['"]/.test(s);
    const usesLink = /\bLink\b|\bNavLink\b/.test(s);
    const usesNavigate = /\buseNavigate\b/.test(s);
    if (!importsRRD && !usesLink && !usesNavigate) continue;
    // inventory
    if (usesLink || usesNavigate) inventory.push(file.replace(process.cwd()+"/", ""));

    let text = s;
    const changes: string[] = [];

    // convert Link/NavLink to ShopHostLink
    const rTags = replaceTagsToHostLink(text);
    if (rTags.count > 0) { text = rTags.text; changes.push(`replaced ${rTags.count} <Link|NavLink>`); }
    // ensure import for ShopHostLink if used
    if (rTags.count > 0) {
      const rImp = ensureImport(text, file, 'ShopHostLink');
      if (rImp.added) { text = rImp.text; changes.push('added import ShopHostLink'); }
    }
    // rewrite useNavigate → useShopHostNavigate
    if (usesNavigate) {
      const rNav = rewriteUseNavigate(text);
      if (rNav.count > 0) { text = rNav.text; changes.push(`rewrote useNavigate (${rNav.count})`); }
      if (rNav.count > 0) {
        const rImp2 = ensureImport(text, file, 'useShopHostNavigate');
        if (rImp2.added) { text = rImp2.text; changes.push('added import useShopHostNavigate'); }
      }
    }
    // mark externals and warn on non-/app internals
    const logs: string[] = [];
    const rExt = markExternalLinks(text, logs);
    if (rExt.marked > 0) { text = rExt.text; changes.push(`marked ${rExt.marked} external link(s)`); }
    if (rExt.badInternal > 0) changes.push(`WARN: ${rExt.badInternal} internal not under /app`);

    if (changes.length) {
      edits.push({ file, changes });
      if (!dry) await fs.writeFile(file, text, 'utf8');
    }
  }

  // summary
  console.log('admin-links migration inventory:');
  for (const f of inventory) console.log(' -', f);
  if (edits.length === 0) {
    console.log('No changes needed.');
    return;
  }
  console.log(`\nFiles updated (${edits.length}):`);
  for (const e of edits) {
    console.log(' -', e.file.replace(process.cwd()+"/", ""));
    for (const c of e.changes) console.log('    *', c);
  }
  if (dry) console.log('\nDRY RUN — no files written. Re-run without --dry to apply.');
}

main().catch((e) => { console.error('admin-links migration failed:', e?.message || e); process.exit(1); });
/* <!-- END RBP GENERATED: admin-links-hardening-v1 --> */
