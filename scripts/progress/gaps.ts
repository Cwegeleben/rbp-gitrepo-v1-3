/* <!-- BEGIN RBP GENERATED: rbp-progress-ledger-v1 --> */
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import type { GapItem, GapReport, ProgressEntry, ScanRecord } from "./types";

interface Args { cwd: string; }
function parseArgs(argv: string[]): Args {
  const idx = argv.indexOf("--cwd");
  return { cwd: idx !== -1 ? argv[idx + 1] : process.cwd() };
}

async function readJson<T>(abs: string, fallback: T): Promise<T> {
  try { return JSON.parse(await fs.readFile(abs, "utf8")); } catch { return fallback; }
}

function looksLikeUiPath(p: string): boolean {
  return /\.(tsx|jsx)$/.test(p) && /(components|ui|__stories__)/.test(p);
}

function nearbyHas(patterns: RegExp[], files: string[], allFiles: string[]): boolean {
  const set = new Set(allFiles);
  for (const f of files) {
    for (const re of patterns) {
      const base = f.replace(/\.(tsx|ts|jsx|js)$/, "");
      const candidates = [
        `${base}.test.ts`,
        `${base}.test.tsx`,
        `${base}.spec.ts`,
        `${base}.spec.tsx`,
        `${base}.stories.tsx`,
        `${base}.stories.mdx`,
      ];
      if (candidates.some((c) => set.has(c))) return true;
    }
  }
  return false;
}

async function main() {
  const { cwd } = parseArgs(process.argv.slice(2));
  const scanPath = path.join(cwd, "docs/progress/scan.json");
  const progressPath = path.join(cwd, "docs/progress/progress.json");
  const scanJson = await readJson<{ sentinels: ScanRecord[] }>(scanPath, { sentinels: [] });
  const progress = await readJson<ProgressEntry[]>(progressPath, []);

  // Preload full file list for simple existence checks
  // We'll read from git ls-files if available; else do minimal fs walk
  let allFiles: string[] = [];
  try {
    const { execSync } = await import("node:child_process");
    allFiles = execSync("git ls-files", { cwd }).toString("utf8").split(/\r?\n/).filter(Boolean);
  } catch {
    // Fallback: no-op (rely on simple patterns)
  }

  const gaps: GapItem[] = [];
  const bySentinel = new Map<string, ProgressEntry[]>();
  for (const e of progress) {
    const list = bySentinel.get(e.sentinel) || [];
    list.push(e);
    bySentinel.set(e.sentinel, list);
  }

  for (const s of scanJson.sentinels) {
    const entries = bySentinel.get(s.sentinel) || [];
    const isBreaking = entries.some((e) => /BREAKING/i.test(e.change));
    const files = s.files;

    // Tests gap
    const hasTests = files.some((f) => /__tests__|\.test\.|\.spec\./.test(f));
    if (!hasTests) {
      gaps.push({
        sentinel: s.sentinel,
        kind: "tests",
        message: "No nearby tests detected for sentinel files",
        hint: `BUILD: add tests near ${files[0] || s.sentinel}`,
        breaking: isBreaking,
      });
    }

    // Stories gap for UI-related paths
    const isUi = files.some(looksLikeUiPath);
    if (isUi) {
      const hasStories = files.some((f) => /\.stories\.(tsx|mdx)$/.test(f) || /__stories__\//.test(f));
      if (!hasStories) {
        gaps.push({
          sentinel: s.sentinel,
          kind: "stories",
          message: "No Storybook stories detected",
          hint: `BUILD: add stories for ${files[0] || s.sentinel}`,
          breaking: isBreaking,
        });
      }
    }

    // Preflight gap if there are scripts/preflight references in files
    const hasPreflight = files.some((f) => f.startsWith("scripts/preflight/"));
    if (!hasPreflight) {
      gaps.push({
        sentinel: s.sentinel,
        kind: "preflight",
        message: "No preflight script detected",
        hint: `BUILD: add scripts/preflight/<name>.ts for ${s.sentinel}`,
        breaking: isBreaking,
      });
    }

    // ADR required for breaking changes
    if (isBreaking) {
      const hasAdr = files.some((f) => f.startsWith("docs/adr/"));
      if (!hasAdr) {
        gaps.push({
          sentinel: s.sentinel,
          kind: "adr",
          message: "BREAKING entries require an ADR in docs/adr",
          hint: `BUILD: add ADR docs/adr/${s.sentinel.toUpperCase()}.md`,
          breaking: true,
        });
      }
    }
  }

  const report: GapReport = { generatedAt: new Date().toISOString(), gaps };
  const md: string[] = [];
  md.push(`<!-- BEGIN RBP GENERATED: rbp-progress-ledger-v1 -->`);
  md.push(`# Gaps Report`);
  md.push("");
  md.push(`- Generated: ${report.generatedAt}`);
  md.push(`- Total gaps: ${gaps.length}`);
  md.push("");
  for (const g of gaps) {
    md.push(`## ${g.sentinel} — ${g.kind.toUpperCase()}${g.breaking ? " (BREAKING)" : ""}`);
    md.push("");
    md.push(`- Reason: ${g.message}`);
    md.push(`- Next: ${g.hint}`);
    md.push("");
  }

  md.push(`\n<!-- END RBP GENERATED: rbp-progress-ledger-v1 -->`);
  const outPath = path.join(cwd, "docs/progress/GAPS.md");
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, md.join("\n"), "utf8");

  // Also update REPORT.md footer with gaps summary if present
  const reportMdPath = path.join(cwd, "docs/progress/REPORT.md");
  try {
    const existing = await fs.readFile(reportMdPath, "utf8");
    const footer = [``, `---`, `Open gaps: ${gaps.length}`, ``].join("\n");
    await fs.writeFile(reportMdPath, existing + "\n" + footer, "utf8");
  } catch {}

  console.log(`progress:gaps wrote docs/progress/GAPS.md (${gaps.length} gaps)`);
  const breakingGaps = gaps.filter((g) => g.breaking).length;
  if (breakingGaps > 0) {
    console.error(`progress:gaps FAIL: ${breakingGaps} gaps found in BREAKING items`);
    process.exit(3);
  }
}

main().catch((err) => {
  console.error("progress:gaps FAILED", err?.message || err);
  process.exit(1);
});
/* <!-- END RBP GENERATED: rbp-progress-ledger-v1 --> */
