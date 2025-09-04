/* <!-- BEGIN RBP GENERATED: rbp-progress-ledger-paths-v1 --> */
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

async function exists(p: string): Promise<boolean> {
  try { await fs.access(p); return true; } catch { return false; }
}

async function lsFiles(cwd: string): Promise<string[]> {
  // Prefer git for speed/ignore; fallback to minimal FS walk under scripts/
  try {
    const { execSync } = await import("node:child_process");
    const out = execSync("git ls-files", { cwd });
    return out.toString("utf8").split(/\r?\n/).filter(Boolean);
  } catch {
    const results: string[] = [];
    async function walk(dir: string) {
      let ents: any[] = [];
      try { ents = await fs.readdir(dir, { withFileTypes: true } as any) as any; } catch { return; }
      for (const ent of ents as any[]) {
        const abs = path.join(dir, ent.name);
        if (ent.isDirectory()) await walk(abs);
        else if (ent.isFile()) results.push(path.relative(cwd, abs));
      }
    }
    await walk(path.join(cwd, "scripts"));
    return results;
  }
}

async function main() {
  const cwd = process.cwd();
  const required = [
    "scripts/progress/scan.ts",
    "scripts/progress/update.ts",
    "scripts/progress/gaps.ts",
    "scripts/progress/import-chat.ts",
    "scripts/progress/types.ts",
  ];

  const missing: string[] = [];
  for (const rel of required) {
    const abs = path.join(cwd, rel);
    if (!await exists(abs)) missing.push(rel);
  }

  const files = await lsFiles(cwd);
  const progressBasenames = new Set(["scan.ts", "update.ts", "gaps.ts", "import-chat.ts", "types.ts"]);
  const misplaced: string[] = [];
  for (const f of files) {
    if (!f.startsWith("scripts/")) continue; // only consider scripts folder
    if (f.startsWith("scripts/progress/")) continue;
    const base = path.basename(f);
    if (progressBasenames.has(base)) {
      misplaced.push(f);
    }
  }

  if (missing.length || misplaced.length) {
    if (missing.length) {
      console.error("progress-paths: missing required file(s):\n" + missing.map(m => `- ${m}`).join("\n"));
    }
    if (misplaced.length) {
      console.error(
        "progress-paths: found progress script(s) outside scripts/progress — move them:" +
        "\n" + misplaced.map(m => `- ${m} -> scripts/progress/${path.basename(m)}`).join("\n")
      );
    }
    process.exit(2);
  }

  console.log("progress-paths: ok — progress scripts are in scripts/progress/");
}

main().catch((err) => {
  console.error("progress-paths FAILED", err?.message || err);
  process.exit(1);
});
/* <!-- END RBP GENERATED: rbp-progress-ledger-paths-v1 --> */
