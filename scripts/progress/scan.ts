/* <!-- BEGIN RBP GENERATED: rbp-progress-ledger-v1 --> */
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import type { ScanRecord } from "./types";

const IGNORES = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".next",
]);

const SENTINEL_RE = /<!--\s*BEGIN RBP GENERATED:\s*(?<slug>[a-z0-9\-\._]+)\s*-->([\s\S]*?)<!--\s*END RBP GENERATED:\s*\1\s*-->/gi;

interface Args {
  out?: string;
  cwd: string;
}

function parseArgs(argv: string[]): Args {
  const outIdx = argv.indexOf("--out");
  const cwdIdx = argv.indexOf("--cwd");
  const out = outIdx !== -1 ? argv[outIdx + 1] : undefined;
  const cwd = cwdIdx !== -1 ? argv[cwdIdx + 1] : process.cwd();
  return { out, cwd };
}

async function* walk(dir: string): AsyncGenerator<string> {
  const ents = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of ents) {
    if (IGNORES.has(ent.name)) continue;
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      yield* walk(abs);
    } else if (ent.isFile()) {
      yield abs;
    }
  }
}

async function readText(file: string): Promise<string> {
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return "";
  }
}

async function main() {
  const { out, cwd } = parseArgs(process.argv.slice(2));
  const started = Date.now();
  const seen: Map<string, ScanRecord> = new Map();

  for await (const abs of walk(cwd)) {
    const rel = path.relative(cwd, abs);
    const text = await readText(abs);
    if (!text) continue;
    let m: RegExpExecArray | null;
    while ((m = SENTINEL_RE.exec(text))) {
      const slug = (m.groups?.slug || "").trim();
      if (!slug) continue;
      const r = seen.get(slug) || {
        sentinel: slug,
        files: [],
        firstSeenIso: new Date().toISOString(),
        lastSeenIso: new Date().toISOString(),
      };
      if (!r.files.includes(rel)) r.files.push(rel);
      r.lastSeenIso = new Date().toISOString();
      seen.set(slug, r);
    }
  }

  const scanRecords = [...seen.values()].sort((a, b) => a.sentinel.localeCompare(b.sentinel));
  const payload = {
    generatedAt: new Date().toISOString(),
    cwd,
    count: scanRecords.length,
    sentinels: scanRecords,
  };

  const json = JSON.stringify(payload, null, 2);

  if (out) {
    const outAbs = path.isAbsolute(out) ? out : path.join(cwd, out);
    await fs.mkdir(path.dirname(outAbs), { recursive: true });
    await fs.writeFile(outAbs, json, "utf8");
    // Also refresh REPORT.md summary
    const reportPath = path.join(cwd, "docs/progress/REPORT.md");
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    // Read progress ledger if present
    let ledger: any[] = [];
    try {
      ledger = JSON.parse(await fs.readFile(path.join(cwd, "docs/progress/progress.json"), "utf8"));
    } catch {}
    const totalEntries = Array.isArray(ledger) ? ledger.length : 0;
    const lastUpdateIso = totalEntries
      ? ledger.map((e: any) => e.date).sort().slice(-1)[0]
      : "N/A";
    const byApp = new Map<string, number>();
    if (Array.isArray(ledger)) {
      for (const e of ledger) {
        if (Array.isArray(e.apps)) {
          for (const app of e.apps) {
            byApp.set(app, (byApp.get(app) || 0) + 1);
          }
        }
      }
    }
    const byAppLines = [...byApp.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([app, n]) => `- ${app}: ${n}`)
      .join("\\n");

    const md = `<!-- BEGIN RBP GENERATED: rbp-progress-ledger-v1 -->\n# Progress Report\n\n- Generated: ${payload.generatedAt}\n- Total sentinels: ${payload.count}\n- Ledger entries: ${totalEntries}\n- Last update: ${lastUpdateIso}\n\nSentinels:\n${scanRecords
      .map((s) => `- ${s.sentinel} (${s.files.length} file${s.files.length === 1 ? "" : "s"})`)
      .join("\n")}\n\n${byAppLines ? `Apps summary:\n${byAppLines}\n\n` : ""}<!-- END RBP GENERATED: rbp-progress-ledger-v1 -->\n`;
    await fs.writeFile(reportPath, md, "utf8");
    console.log(`progress:scan wrote ${path.relative(cwd, outAbs)} and updated docs/progress/REPORT.md`);
  } else {
    process.stdout.write(json);
  }

  // Terse output for CI timing
  console.error(`progress:scan OK in ${Date.now() - started}ms (${payload.count} sentinels)`);
}

main().catch((err) => {
  console.error("progress:scan FAILED", err?.message || err);
  process.exit(1);
});
/* <!-- END RBP GENERATED: rbp-progress-ledger-v1 --> */
