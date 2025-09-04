/* <!-- BEGIN RBP GENERATED: rbp-snapshot-exporter-v1 --> */
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

type ProgressEntry = {
  date: string;
  feature: string;
  change: string;
  sentinel: string;
  apps: string[];
  files?: string[];
  tests: string;
  preflight: string;
  notes: string;
};

type ScanJson = {
  generatedAt?: string;
  cwd?: string;
  count?: number;
  sentinels?: Array<{
    sentinel: string;
    files: string[];
    firstSeenIso?: string;
    lastSeenIso?: string;
  }>;
};

type GapItem = {
  sentinel: string;
  kind: string; // e.g., TESTS | STORIES | PREFLIGHT | ADR
  reason: string;
  next: string; // recommended action
};

type RouteInventoryItem = {
  app: string; // "admin.portal" | "shopify" | etc.
  file: string;
  routeId: string;
  pathGuess?: string;
  hasLoader?: boolean;
  hasAction?: boolean;
  hasDefaultExport?: boolean;
};

type ExportInventoryItem = {
  app?: string;
  file: string;
  name: string;
  kind: string; // e.g., component|function|type|loader|action
};

type EndpointInventoryItem = {
  method: string; // GET | POST | *
  path: string;
  source: string;
  note?: string;
};

type AppCoverage = {
  routes: number;
  loaders: number;
  actions: number;
  components: number;
};

type Snapshot = {
  generatedAt: string;
  missingFiles: string[];
  totals: { sentinels: number; gaps: number; ledgerEntries: number };
  lastUpdateIso: string | null;
  byApp: Record<string, number>;
  byChangeType: Record<string, number>;
  byKind: Record<string, number>;
  topGaps: Array<{ sentinel: string; kind: string; reason: string; next: string }>;
  recommendedPrompts: Array<{ title: string; sentinel: string; reason: string; kind: string }>;
  // New fields
  appCoverage?: Record<string, AppCoverage>;
  topSentinels?: Array<{ sentinel: string; files: number }>;
  endpoints?: { total: number; sample: EndpointInventoryItem[] };
};

async function readJsonIf<T>(abs: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(abs, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function fileExists(abs: string): Promise<boolean> {
  try {
    await fs.access(abs);
    return true;
  } catch {
    return false;
  }
}

async function parseGaps(cwd: string): Promise<{ items: GapItem[]; byKind: Record<string, number> } | null> {
  const gapsJsonPath = path.join(cwd, "docs/progress/gaps.json");
  if (await fileExists(gapsJsonPath)) {
    try {
      const data = JSON.parse(await fs.readFile(gapsJsonPath, "utf8"));
      // Expect { generatedAt, gaps: [{ sentinel, kind, message, hint, breaking }] }
      const items: GapItem[] = Array.isArray(data?.gaps)
        ? data.gaps.map((g: any) => ({
            sentinel: String(g.sentinel || ""),
            kind: String(g.kind || "").toUpperCase(),
            reason: String(g.message || ""),
            next: String(g.hint || ""),
          }))
        : [];
      const byKind: Record<string, number> = {};
      for (const it of items) byKind[it.kind] = (byKind[it.kind] || 0) + 1;
      return { items, byKind };
    } catch {
      // fall through to md parsing
    }
  }

  const gapsMdPath = path.join(cwd, "docs/progress/GAPS.md");
  if (!(await fileExists(gapsMdPath))) return null;
  const md = await fs.readFile(gapsMdPath, "utf8");
  const lines = md.split(/\r?\n/);
  const items: GapItem[] = [];
  const byKind: Record<string, number> = {};
  const headerRe = /^##\s+(.+?)\s+—\s+([A-Z]+)(?:\s+\(BREAKING\))?\s*$/;
  let cur: GapItem | null = null;
  for (const line of lines) {
    const m = line.match(headerRe);
    if (m) {
      if (cur) items.push(cur);
      cur = { sentinel: m[1].trim(), kind: m[2].trim().toUpperCase(), reason: "", next: "" };
      byKind[cur.kind] = (byKind[cur.kind] || 0) + 1;
      continue;
    }
    if (cur) {
      const reasonM = line.match(/^\-\s*Reason:\s*(.*)$/);
      if (reasonM) { cur.reason = reasonM[1].trim(); continue; }
      const nextM = line.match(/^\-\s*Next:\s*(.*)$/);
      if (nextM) { cur.next = nextM[1].trim(); continue; }
    }
  }
  if (cur) items.push(cur);
  return { items, byKind };
}

function cap<T>(arr: T[], n: number): T[] { return Array.isArray(arr) ? arr.slice(0, n) : []; }

function groupBy<T>(arr: T[], key: (t: T) => string): Record<string, T[]> {
  return arr.reduce((acc, it) => {
    const k = key(it) || "";
    (acc[k] ||= []).push(it);
    return acc;
  }, {} as Record<string, T[]>);
}

async function main() {
  const cwd = process.cwd();
  const nowIso = new Date().toISOString();
  const missingFiles: string[] = [];

  const progressPath = path.join(cwd, "docs/progress/progress.json");
  const scanPath = path.join(cwd, "docs/progress/scan.json");
  const gapsJsonPath = path.join(cwd, "docs/progress/gaps.json");

  const routesPath = path.join(cwd, "docs/progress/inventory/routes.json");
  const exportsPath = path.join(cwd, "docs/progress/inventory/exports.json");
  const endpointsPath = path.join(cwd, "docs/progress/inventory/endpoints.json");

  const progress = (await readJsonIf<ProgressEntry[]>(progressPath)) || [];
  if (progress.length === 0) missingFiles.push("docs/progress/progress.json");
  const scan = (await readJsonIf<ScanJson>(scanPath)) || { count: 0, sentinels: [] };
  if (!scan?.sentinels || typeof scan.count !== "number") missingFiles.push("docs/progress/scan.json");
  const gapsParsed = await parseGaps(cwd);
  if (!gapsParsed) missingFiles.push((await fileExists(gapsJsonPath)) ? "docs/progress/gaps.json" : "docs/progress/GAPS.md");

  // Optional inventories
  const routes = (await readJsonIf<RouteInventoryItem[]>(routesPath)) || [];
  if (routes.length === 0) missingFiles.push("docs/progress/inventory/routes.json");
  const exps = (await readJsonIf<ExportInventoryItem[]>(exportsPath)) || [];
  if (exps.length === 0) missingFiles.push("docs/progress/inventory/exports.json");
  const endpoints = (await readJsonIf<EndpointInventoryItem[]>(endpointsPath)) || [];
  if (endpoints.length === 0) missingFiles.push("docs/progress/inventory/endpoints.json");

  // Ledger stats
  const ledgerEntries = Array.isArray(progress) ? progress.length : 0;
  const lastUpdateIso = ledgerEntries ? progress.map(e => e.date).filter(Boolean).sort().slice(-1)[0] : null;
  const byApp: Record<string, number> = {};
  const byChangeType: Record<string, number> = {};
  for (const e of progress) {
    for (const app of e.apps || []) byApp[app] = (byApp[app] || 0) + 1;
    const ch = e.change || "";
    if (ch) byChangeType[ch] = (byChangeType[ch] || 0) + 1;
  }

  // Gaps
  const gapsItems = gapsParsed?.items || [];
  const byKind = gapsParsed?.byKind || {};

  // appCoverage from inventories
  const groupedRoutes = groupBy(routes, r => r.app || "");
  const groupedExports = groupBy(exps, e => e.app || "");
  const appCoverage: Record<string, AppCoverage> = {};
  for (const [app, items] of Object.entries(groupedRoutes)) {
    const loaders = items.filter(i => !!i.hasLoader).length;
    const actions = items.filter(i => !!i.hasAction).length;
    const components = (groupedExports[app] || []).filter(e => e.kind?.toLowerCase() === "component").length;
    appCoverage[app] = { routes: items.length, loaders, actions, components };
  }
  // If there are exports for an app with no routes, still include a coverage row
  for (const [app, items] of Object.entries(groupedExports)) {
    if (!appCoverage[app]) {
      const components = items.filter(e => e.kind?.toLowerCase() === "component").length;
      appCoverage[app] = { routes: 0, loaders: 0, actions: 0, components };
    }
  }

  // topSentinels from scan
  const topSentinels = cap(
    [...(scan.sentinels || [])]
      .map(s => ({ sentinel: s.sentinel, files: Array.isArray(s.files) ? s.files.length : 0 }))
      .sort((a, b) => b.files - a.files),
    10
  );

  // endpoints summary
  const endpointsSummary = { total: endpoints.length, sample: cap(endpoints, 10) };

  // Build snapshot
  const snapshot: Snapshot = {
    generatedAt: nowIso,
    missingFiles,
    totals: {
      sentinels: Number.isFinite(scan.count as number) ? (scan.count as number) : (scan.sentinels?.length || 0),
      gaps: gapsItems.length,
      ledgerEntries,
    },
    lastUpdateIso,
    byApp,
    byChangeType,
    byKind,
    topGaps: cap(gapsItems, 10).map(g => ({ sentinel: g.sentinel, kind: g.kind, reason: g.reason, next: g.next })),
    recommendedPrompts: cap(gapsItems, 5).slice(0, Math.max(3, Math.min(5, gapsItems.length))).map(g => ({
      title: g.next || `${g.kind}: ${g.sentinel}`,
      sentinel: g.sentinel,
      reason: g.reason,
      kind: g.kind,
    })),
    appCoverage,
    topSentinels,
    endpoints: endpointsSummary,
  };

  // Write
  const outDir = path.join(cwd, "docs/progress");
  await fs.mkdir(outDir, { recursive: true });
  const chatgptOut = path.join(outDir, "chatgpt-snapshot.json");
  const snapshotOut = path.join(outDir, "SNAPSHOT.json");
  await fs.writeFile(chatgptOut, JSON.stringify(snapshot, null, 2) + "\n", "utf8");
  await fs.writeFile(snapshotOut, JSON.stringify(snapshot, null, 2) + "\n", "utf8");
  console.log(`wrote ${path.relative(cwd, chatgptOut)}`);
  console.log(`wrote ${path.relative(cwd, snapshotOut)}`);
}

main().catch((err) => {
  console.error("progress:snapshot FAILED", err?.message || err);
  process.exit(1);
});
/* <!-- END RBP GENERATED: rbp-snapshot-exporter-v1 --> */
