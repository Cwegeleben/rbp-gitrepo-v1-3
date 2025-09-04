/* <!-- BEGIN RBP GENERATED: rbp-chat-importer-v1 --> */
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

import type { ProgressEntry } from "./types";

interface Args {
  cwd: string;
  out?: string; // file to write RBP_PROGRESS lines; "-" means stdout
  files: string[]; // one or more exported chat JSON files
}

function parseArgs(argv: string[]): Args {
  const cwdIdx = argv.indexOf("--cwd");
  const outIdx = argv.indexOf("--out");
  const cwd = cwdIdx !== -1 ? argv[cwdIdx + 1] : process.cwd();
  const out = outIdx !== -1 ? argv[outIdx + 1] : "tmp/progress-lines.txt";
  const files = argv.filter((a) => !a.startsWith("--") && !a.endsWith("--"));
  return { cwd, out, files };
}

const RBP_LINE_RE = /RBP_PROGRESS:\s*(\{[\s\S]*?\})/g;

async function readJsonSafe(file: string): Promise<any> {
  try {
    const text = await fs.readFile(file, "utf8");
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function* walkStrings(node: any): Generator<string> {
  if (node == null) return;
  const t = typeof node;
  if (t === "string") {
    yield node as string;
    return;
  }
  if (Array.isArray(node)) {
    for (const v of node) yield* walkStrings(v);
    return;
  }
  if (t === "object") {
    for (const v of Object.values(node)) yield* walkStrings(v);
  }
}

function normalizeEntry(e: any): ProgressEntry | null {
  // Minimal normalization: ensure required keys exist
  if (!e || typeof e !== "object") return null;
  const required = [
    "date",
    "feature",
    "change",
    "sentinel",
    "apps",
    "files",
    "tests",
    "preflight",
    "notes",
  ];
  for (const k of required) if (!(k in e)) return null;
  return e as ProgressEntry;
}

async function main() {
  const { cwd, out, files } = parseArgs(process.argv.slice(2));
  if (!files.length) {
    console.error("usage: pnpm progress:import-chat <export.json> [more.json] [--out tmp/progress-lines.txt]");
    process.exit(1);
  }

  // Load existing ledger to skip duplicates by {date|sentinel}
  let existingKeys = new Set<string>();
  try {
    const ledgerPath = path.join(cwd, "docs/progress/progress.json");
    const arr = JSON.parse(await fs.readFile(ledgerPath, "utf8")) as ProgressEntry[];
    for (const e of arr) existingKeys.add(`${e.date}|${e.sentinel}`);
  } catch {}

  const collected: ProgressEntry[] = [];
  let totalFound = 0;
  for (const input of files) {
    const abs = path.isAbsolute(input) ? input : path.join(cwd, input);
    const json = await readJsonSafe(abs);
    if (!json) {
      // Try raw text regex fallback
      try {
        const raw = await fs.readFile(abs, "utf8");
        let m: RegExpExecArray | null;
        while ((m = RBP_LINE_RE.exec(raw))) {
          totalFound++;
          try {
            const obj = JSON.parse(m[1]);
            const norm = normalizeEntry(obj);
            if (norm) collected.push(norm);
          } catch {}
        }
      } catch {}
      continue;
    }

    for (const s of walkStrings(json)) {
      let m: RegExpExecArray | null;
      RBP_LINE_RE.lastIndex = 0;
      while ((m = RBP_LINE_RE.exec(s))) {
        totalFound++;
        try {
          const obj = JSON.parse(m[1]);
          const norm = normalizeEntry(obj);
          if (norm) collected.push(norm);
        } catch {}
      }
    }
  }

  // Dedupe within batch and against existing ledger
  const batchMap = new Map<string, ProgressEntry>();
  for (const e of collected) {
    batchMap.set(`${e.date}|${e.sentinel}`, e);
  }
  const batchUnique = [...batchMap.values()];
  const toWrite = batchUnique.filter((e) => !existingKeys.has(`${e.date}|${e.sentinel}`));

  const lines = toWrite.map((e) => `RBP_PROGRESS: ${JSON.stringify(e)}`).join("\n");
  const skipped = totalFound - toWrite.length;

  if (!out || out === "-" || out === "/dev/stdout") {
    process.stdout.write(lines + (lines ? "\n" : ""));
  } else {
    const outAbs = path.isAbsolute(out) ? out : path.join(cwd, out);
    await fs.mkdir(path.dirname(outAbs), { recursive: true });
    await fs.writeFile(outAbs, lines + (lines ? "\n" : ""), "utf8");
  }

  console.log(
    `progress:import-chat scanned ${files.length} file(s), found ${totalFound} entries, wrote ${toWrite.length}, skipped ${skipped} duplicate(s)`
  );
}

main().catch((err) => {
  console.error("progress:import-chat FAILED", err?.message || err);
  process.exit(1);
});
/* <!-- END RBP GENERATED: rbp-chat-importer-v1 --> */