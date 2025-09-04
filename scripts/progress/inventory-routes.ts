// <!-- BEGIN RBP GENERATED: rbp-inventory-routes-v1 -->
import fs from "node:fs/promises";
import path from "node:path";

type RouteFact = {
  app: "admin.portal" | "shopify";
  file: string; // relative path from repo root
  routeId: string;
  pathGuess: string;
  hasLoader: boolean;
  hasAction: boolean;
  hasDefaultExport: boolean;
  componentName?: string;
  hasOutlet?: boolean;
};

const ROOT = process.cwd();
const ADMIN_ROUTES_DIR = path.join(ROOT, "src/apps/admin.portal/app/routes");
const SHOPIFY_BASE = path.join(ROOT, "src/apps/rbp-shopify-app"); // find all */app/routes under this

const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
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
      // Skip common junk
      if (
        ent.name === "node_modules" ||
        ent.name === ".git" ||
        ent.name === ".cache" ||
        ent.name === "dist"
      )
        continue;
      await walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

async function findShopifyRouteRoots(base: string): Promise<string[]> {
  const dirs: string[] = [];
  const stack: string[] = [base];
  while (stack.length) {
    const cur = stack.pop()!;
    let ents: any[] = [];
    try {
      ents = await fs.readdir(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const ent of ents) {
      if (!ent.isDirectory()) continue;
      const d = path.join(cur, ent.name);
      // Detect */app/routes
      const name = path.basename(d);
      if (name === "routes" && path.basename(path.dirname(d)) === "app") {
        dirs.push(d);
        // No need to descend into routes dir here; we will walk it later
        continue;
      }
      // Skip heavy dirs
      if (ent.name === "node_modules" || ent.name === ".git" || ent.name === ".shopify") continue;
      stack.push(d);
    }
  }
  return dirs;
}

function toRel(p: string): string {
  return p.split(path.sep).join("/").replace(ROOT.split(path.sep).join("/") + "/", "");
}

function detectHas(content: string, what: "loader" | "action"): boolean {
  const re = new RegExp(
    String.raw`export\s+(?:async\s+)?function\s+${what}\b|export\s+const\s+${what}\b|export\s*\{\s*${what}\s*(?:as\s+\w+)?\s*[,}]`,
    "m"
  );
  return re.test(content);
}

function detectDefaultExport(content: string): { has: boolean; name?: string } {
  // export default function Name() { }
  const fn = content.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);
  if (fn?.[1]) return { has: true, name: fn[1] };
  // export default Name
  const ref = content.match(/export\s+default\s+([A-Za-z0-9_]+)/);
  if (ref?.[1]) return { has: true, name: ref[1] };
  // export default ... (no name)
  if (/export\s+default\s+/.test(content)) return { has: true };
  return { has: false };
}

function toRouteId(routesRoot: string, absFile: string): string {
  const rel = path.relative(routesRoot, absFile);
  const relNoExt = rel.replace(path.extname(rel), "");
  // Convert path separators to dot, preserve existing dots
  return relNoExt.replace(/[\\/]+/g, ".");
}

function toPathGuess(routeId: string): string {
  // Convert dot-segments to path, drop trailing "index", $param -> :param
  const parts = routeId.split(".").filter(Boolean);
  if (parts.length && parts[parts.length - 1] === "index") parts.pop();
  const mapped = parts.map((seg) => {
    // splat not handled; only simple $param -> :param
    if (seg.startsWith("$")) return ":" + seg.slice(1);
    return seg;
  });
  return "/" + mapped.join("/");
}

function isRouteFile(file: string): boolean {
  const ext = path.extname(file);
  if (!EXTENSIONS.has(ext)) return false;
  const base = path.basename(file);
  if (base.endsWith(".d.ts")) return false;
  if (base.includes(".test.")) return false;
  return true;
}

async function collectFromRoot(appKey: "admin.portal" | "shopify", routesRoot: string): Promise<RouteFact[]> {
  const files = (await walk(routesRoot)).filter(isRouteFile);
  const facts: RouteFact[] = [];
  for (const f of files) {
    const src = await fs.readFile(f, "utf8").catch(() => "");
    const hasLoader = detectHas(src, "loader");
    const hasAction = detectHas(src, "action");
    const def = detectDefaultExport(src);
    const hasDefaultExport = def.has;
    const componentName = def.name && /^[A-Z]/.test(def.name) ? def.name : undefined;
    const hasOutlet = /<\s*Outlet\b/.test(src) ? true : undefined;

    const routeId = toRouteId(routesRoot, f);
    const pathGuess = toPathGuess(routeId);

    facts.push({
      app: appKey,
      file: toRel(f),
      routeId,
      pathGuess,
      hasLoader,
      hasAction,
      hasDefaultExport,
      ...(componentName ? { componentName } : {}),
      ...(hasOutlet ? { hasOutlet } : {}),
    });
  }
  return facts.sort((a, b) => (a.app === b.app ? a.file.localeCompare(b.file) : a.app.localeCompare(b.app)));
}

async function main() {
  const outDir = path.join(ROOT, "docs/progress/inventory");
  const outFile = path.join(outDir, "routes.json");
  await ensureDir(outDir);

  const allFacts: RouteFact[] = [];

  if (await exists(ADMIN_ROUTES_DIR)) {
    allFacts.push(...(await collectFromRoot("admin.portal", ADMIN_ROUTES_DIR)));
  }

  if (await exists(SHOPIFY_BASE)) {
    const shopifyRoots = await findShopifyRouteRoots(SHOPIFY_BASE);
    for (const rr of shopifyRoots) {
      allFacts.push(...(await collectFromRoot("shopify", rr)));
    }
  }

  await fs.writeFile(outFile, JSON.stringify(allFacts, null, 2) + "\n", "utf8");
  console.log(`[inventory-routes] wrote ${allFacts.length} entries to ${toRel(outFile)}`);
}

main().catch((e) => {
  console.error("[inventory-routes] error:", e?.stack || e?.message || String(e));
  process.exit(1);
});
// <!-- END RBP GENERATED: rbp-inventory-routes-v1 -->
