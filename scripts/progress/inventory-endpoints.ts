// <!-- BEGIN RBP GENERATED: rbp-inventory-endpoints-v1 -->
import fs from "node:fs/promises";
import path from "node:path";

type Ep = { method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD" | "*" | string; path: string; source: string; note?: string };

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "docs/progress/inventory");
const OUT_FILE = path.join(OUT_DIR, "endpoints.json");

const SRC_DIR = path.join(ROOT, "src");
const GATEWAY_DIR = path.join(SRC_DIR, "apps/gateway");
const SHOPIFY_APP_DIR = path.join(SRC_DIR, "apps/rbp-shopify-app");
const TOPLEVEL_APP_ROUTES = path.join(SRC_DIR, "app/routes");

const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}
function toRel(p: string): string {
  return p.split(path.sep).join("/").replace(ROOT.split(path.sep).join("/") + "/", "");
}
function isCodeFile(file: string): boolean {
  const ext = path.extname(file);
  if (!EXTENSIONS.has(ext)) return false;
  const base = path.basename(file);
  if (base.endsWith(".d.ts")) return false;
  if (base.includes(".test.") || base.includes(".stories.")) return false;
  return true;
}
async function readFileSafe(f: string): Promise<string> {
  try {
    return await fs.readFile(f, "utf8");
  } catch {
    return "";
  }
}
async function walk(dir: string, out: string[] = []): Promise<string[]> {
  let entries: any[] = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".git" || ent.name === ".shopify" || ent.name === "dist" || ent.name === ".cache") continue;
      await walk(full, out);
    } else {
      if (isCodeFile(full)) out.push(full);
    }
  }
  return out;
}

function findFirstLineOf(pattern: RegExp, content: string): number {
  const m = content.match(pattern);
  if (!m) return 1;
  const idx = m.index ?? 0;
  const pre = content.slice(0, idx);
  const line = pre.split(/\r?\n/g).length;
  return line;
}

function normalizeRemixRouteToPath(routeRel: string): string | null {
  // Turn "apps.proxy.api.catalog.products.ts" to "/apps/proxy/api/catalog/products"
  const noExt = routeRel.replace(/\.(ts|tsx|js|jsx)$/i, "");
  const parts = noExt.split(/[\\/]/g);
  const name = parts.pop() || "";
  const dotPath = name.replace(/\./g, "/");
  let p = "/" + dotPath;
  p = p.replace(/\/index$/i, "");
  p = p
    .split("/")
    .map((seg) => (seg.startsWith("$") ? ":" + seg.slice(1) : seg))
    .join("/");
  if (p.startsWith("/apps/proxy/") || p === "/apps/proxy" || p.startsWith("/apps/rbp/") || p === "/apps/rbp") {
    return p;
  }
  return null;
}

function add(epSet: Map<string, Ep>, ep: Ep) {
  const key = `${ep.method} ${ep.path}`;
  if (!epSet.has(key)) epSet.set(key, ep);
}

async function collectRemixRoutesFromDir(routesRoot: string, epSet: Map<string, Ep>, noteBase: string) {
  const files = await walk(routesRoot);
  for (const f of files) {
    const relFromRoutes = path.relative(routesRoot, f);
    const p = normalizeRemixRouteToPath(relFromRoutes);
    if (!p) continue;
    const src = await readFileSafe(f);
    const rel = toRel(f);

    const hasLoader = /\bexport\s+(?:async\s+)?(?:function|const)\s+loader\b|\bexport\s*\{\s*loader\s*(?:as\s+\w+)?\s*[,}]/m.test(src);
    const hasAction = /\bexport\s+(?:async\s+)?(?:function|const)\s+action\b|\bexport\s*\{\s*action\s*(?:as\s+\w+)?\s*[,}]/m.test(src);

    if (hasLoader) {
      add(epSet, { method: "GET", path: p, source: `${rel}:${findFirstLineOf(/\bexport\s+(?:async\s+)?(?:function|const)\s+loader\b|\bexport\s*\{\s*loader\s*(?:as\s+\w+)?\s*[,}]/m, src)}`, note: `${noteBase} Remix route loader` });
    }
    if (hasAction) {
      add(epSet, { method: "POST", path: p, source: `${rel}:${findFirstLineOf(/\bexport\s+(?:async\s+)?(?:function|const)\s+action\b|\bexport\s*\{\s*action\s*(?:as\s+\w+)?\s*[,}]/m, src)}`, note: `${noteBase} Remix route action` });
    }
    if (!hasLoader && !hasAction) {
      add(epSet, { method: "*", path: p, source: `${rel}:1`, note: `${noteBase} Remix route` });
    }
  }
}

function collectExplicitRegistrations(file: string, content: string): Ep[] {
  const eps: Ep[] = [];
  const rel = toRel(file);
  const lines = content.split(/\r?\n/g);

  const callRe = /([A-Za-z_$][\w$]*)\.(get|post|put|patch|delete|options|head|all)\s*\(\s*(['"])((?:\/apps\/proxy|\/apps\/rbp)[^'"`]*)\3/g;

  lines.forEach((ln, i) => {
    let m: RegExpExecArray | null;
    callRe.lastIndex = 0;
    while ((m = callRe.exec(ln))) {
      const method = m[2].toUpperCase() === "ALL" ? "*" : (m[2].toUpperCase() as Ep["method"]);
      eps.push({ method, path: m[4], source: `${rel}:${i + 1}`, note: "router registration" });
    }
    // hono style
    const honoOnRe = /\.on\s*\(\s*(['"])\s*(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD|\*)\1\s*,\s*(['"])((?:\/apps\/proxy|\/apps\/rbp)[^'"`]*)\3/gi;
    let m2: RegExpExecArray | null;
    while ((m2 = honoOnRe.exec(ln))) {
      const method = m2[2].toUpperCase() as Ep["method"];
      eps.push({ method, path: m2[4], source: `${rel}:${i + 1}`, note: "router on()" });
    }
  });

  // Fastify route({ method, url })
  const routeObjRe = /route\s*\(\s*\{[\s\S]*?\}\s*\)/g;
  let rm: RegExpExecArray | null;
  while ((rm = routeObjRe.exec(content))) {
    const chunk = rm[0];
    const urlMatch = chunk.match(/url\s*:\s*(['"])((?:\/apps\/proxy|\/apps\/rbp)[^'"`]*)\1/);
    if (!urlMatch) continue;
    let method: string | null = null;
    const m1 = chunk.match(/method\s*:\s*(['"])\s*([A-Za-z*]+)\1/);
    const mArr = chunk.match(/method\s*:\s*\[([^\]]+)\]/);
    if (m1) method = m1[2].toUpperCase();
    else if (mArr) method = "*";
    else method = "*";
    const before = content.slice(0, rm.index ?? 0);
    const line = before.split(/\r?\n/g).length;
    eps.push({ method: method as Ep["method"], path: urlMatch[2], source: `${rel}:${line}`, note: "fastify route()" });
  }

  return eps;
}

function collectClientUsages(file: string, content: string): Ep[] {
  const eps: Ep[] = [];
  const rel = toRel(file);
  const isCreateApi = /export\s+(?:function|const)\s+create[A-Za-z0-9_]*Api\b/.test(content) || /function\s+create[A-Za-z0-9_]*Api\b/.test(content);
  const lines = content.split(/\r?\n/g);

  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    const strRe = /(['"])((?:\/apps\/proxy|\/apps\/rbp)[^'"`]*)\1/g;
    let m: RegExpExecArray | null;
    while ((m = strRe.exec(ln))) {
      const pathStr = m[2];
      let method: Ep["method"] = "*";
      const ctx = ln;
  const apiVerb = ctx.match(/\b(?:API|api|client)\.(get|post|put|patch|delete|options|head)\s*\(/i);
      if (apiVerb) method = apiVerb[2].toUpperCase() as Ep["method"];
      else {
        const methodProp = ctx.match(/method\s*:\s*(['"])\s*([A-Za-z]+)\1/);
        if (methodProp) method = methodProp[2].toUpperCase() as Ep["method"];
        const fnVerb = ctx.match(/\b(get|post|put|patch|delete|options|head)\s*\(\s*(['"])\//i);
        if (fnVerb) method = fnVerb[1].toUpperCase() as Ep["method"];
      }
      const note = isCreateApi ? "create*Api reference" : "client reference";
      eps.push({ method, path: pathStr, source: `${rel}:${i + 1}`, note });
    }
  }

  return eps;
}

async function main() {
  await ensureDir(OUT_DIR);
  const epSet = new Map<string, Ep>();

  // 1) Gateway: Remix route inference under any app/routes subdir
  let gwFiles: string[] = [];
  try {
    gwFiles = await walk(GATEWAY_DIR);
  } catch {}
  const gwRouteRoots = new Set<string>();
  for (const f of gwFiles) {
    const p = path.dirname(f);
    if (p.endsWith(path.join("app", "routes"))) gwRouteRoots.add(p);
  }
  for (const rr of gwRouteRoots) {
    await collectRemixRoutesFromDir(rr, epSet, "Gateway");
  }

  // 2) Shopify app Remix routes
  let shopFiles: string[] = [];
  try {
    shopFiles = await walk(SHOPIFY_APP_DIR);
  } catch {}
  const shopRouteRoots = new Set<string>();
  for (const f of shopFiles) {
    const p = path.dirname(f);
    if (p.endsWith(path.join("app", "routes"))) shopRouteRoots.add(p);
  }
  for (const rr of shopRouteRoots) {
    await collectRemixRoutesFromDir(rr, epSet, "Shopify app");
  }

  // 3) Top-level Remix routes if present
  try {
    await fs.access(TOPLEVEL_APP_ROUTES);
    await collectRemixRoutesFromDir(TOPLEVEL_APP_ROUTES, epSet, "Top-level app");
  } catch {}

  // 4) Explicit router registrations in gateway
  for (const f of gwFiles) {
    const src = await readFileSafe(f);
    const list = collectExplicitRegistrations(f, src);
    for (const ep of list) add(epSet, ep);
  }

  // 5) create*Api patterns and generic client references in packages and src/apps
  const scanRoots = [path.join(ROOT, "packages"), path.join(ROOT, "src/packages"), path.join(ROOT, "src/apps")];
  for (const root of scanRoots) {
    let files: string[] = [];
    try {
      files = await walk(root);
    } catch {}
    for (const f of files) {
      const src = await readFileSafe(f);
      const list = collectClientUsages(f, src);
      for (const ep of list) add(epSet, ep);
    }
  }

  const all = Array.from(epSet.values())
    .filter((e) => e.path.startsWith("/apps/proxy") || e.path.startsWith("/apps/rbp"))
    .sort((a, b) => (a.path === b.path ? a.method.localeCompare(b.method) : a.path.localeCompare(b.path)));

  await fs.writeFile(OUT_FILE, JSON.stringify(all, null, 2) + "\n", "utf8");
  console.log(`[inventory-endpoints] wrote ${all.length} entries to ${toRel(OUT_FILE)}`);
}

main().catch((e) => {
  console.error("[inventory-endpoints] error:", e?.stack || e?.message || String(e));
  process.exit(1);
});
// <!-- END RBP GENERATED: rbp-inventory-endpoints-v1 -->
