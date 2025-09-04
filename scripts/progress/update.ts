/* <!-- BEGIN RBP GENERATED: rbp-progress-ledger-v1 --> */
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import cp from "node:child_process";
import type { ProgressEntry } from "./types";

const RBP_RE_GLOBAL = /^\s*\+?\s*RBP_PROGRESS:\s*(\{[\s\S]*?\})\s*$/gm;

interface Args {
  fromFile?: string;
  cwd: string;
}

function parseArgs(argv: string[]): Args {
  const fileIdx = argv.indexOf("--from-file");
  const cwdIdx = argv.indexOf("--cwd");
  return {
    fromFile: fileIdx !== -1 ? argv[fileIdx + 1] : undefined,
    cwd: cwdIdx !== -1 ? argv[cwdIdx + 1] : process.cwd(),
  };
}

function getStagedDiff(cwd: string): string {
  try {
    const out = cp.execSync("git --no-pager diff --cached -U0 | cat", { cwd, stdio: ["ignore", "pipe", "pipe"] });
    return out.toString("utf8");
  } catch {
    return "";
  }
}

async function readInputSource(cwd: string, fromFile?: string): Promise<string> {
  if (fromFile) {
    const abs = path.isAbsolute(fromFile) ? fromFile : path.join(cwd, fromFile);
    return fs.readFile(abs, "utf8");
  }
  const diff = getStagedDiff(cwd);
  if (diff) return diff;
  // Fallback to stdin
  return new Promise<string>((resolve) => {
    let buf = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (c) => (buf += c));
    process.stdin.on("end", () => resolve(buf));
    if (process.stdin.isTTY) resolve("");
  });
}

function extractEntries(text: string): ProgressEntry[] {
  const entries: ProgressEntry[] = [];
  let m: RegExpExecArray | null;
  while ((m = RBP_RE_GLOBAL.exec(text))) {
    try {
      const obj = JSON.parse(m[1]);
      entries.push(obj);
    } catch {}
  }
  return entries;
}

function validate(e: ProgressEntry): string[] {
  const errs: string[] = [];
  const req = ["date", "feature", "change", "sentinel", "apps", "files", "tests", "preflight", "notes"] as const;
  for (const k of req) if ((e as any)[k] === undefined) errs.push(`missing ${k}`);
  if (e.notes && e.notes.length > 120) errs.push("notes too long (>120)");
  if (!Array.isArray(e.apps)) errs.push("apps must be array");
  if (!Array.isArray(e.files)) errs.push("files must be array");
  const isBreaking = /BREAKING/i.test(e.change);
  if (isBreaking) {
    const hasAdrPath = e.files.some((f) => f.startsWith("docs/adr/"));
    if (!hasAdrPath) errs.push("BREAKING requires ADR path in docs/adr");
  }
  return errs;
}

async function main() {
  const { cwd, fromFile } = parseArgs(process.argv.slice(2));
  const src = await readInputSource(cwd, fromFile);
  const entries = extractEntries(src);
  if (entries.length === 0) {
    console.error("progress:update found 0 entries (staged diff or input)");
    process.exit(1);
  }
  const errors: string[] = [];
  const valid: ProgressEntry[] = [];
  for (const e of entries) {
    const errs = validate(e);
    if (errs.length) {
      errors.push(`${e.sentinel || "<unknown>"}: ${errs.join(", ")}`);
    } else {
      valid.push(e);
    }
  }
  if (errors.length) {
    console.error("progress:update INVALID entries:\n" + errors.map((s) => `- ${s}`).join("\n"));
    process.exit(2);
  }

  const ledgerPath = path.join(cwd, "docs/progress/progress.json");
  const logPath = path.join(cwd, "docs/progress/progress.log");
  await fs.mkdir(path.dirname(ledgerPath), { recursive: true });

  let existing: ProgressEntry[] = [];
  try {
    existing = JSON.parse(await fs.readFile(ledgerPath, "utf8"));
  } catch {}

  const key = (e: ProgressEntry) => `${e.date}|${e.sentinel}`;
  const map = new Map(existing.map((e) => [key(e), e] as const));
  for (const e of valid) map.set(key(e), e);
  const merged = [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
  await fs.writeFile(ledgerPath, JSON.stringify(merged, null, 2), "utf8");

  const logLines = valid.map((e) => `RBP_PROGRESS: ${JSON.stringify(e)}`).join("\n") + "\n";
  await fs.appendFile(logPath, logLines, "utf8");

  console.log(`progress:update merged ${valid.length} entries -> docs/progress/progress.json (+log)`);
}

main().catch((err) => {
  console.error("progress:update FAILED", err?.message || err);
  process.exit(1);
});
/* <!-- END RBP GENERATED: rbp-progress-ledger-v1 --> */
