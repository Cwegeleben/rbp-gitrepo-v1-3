// <!-- BEGIN RBP GENERATED: remix-tsx-fix-v1-0 -->
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP = path.join(ROOT, "src/apps/rbp-shopify-app/rod-builder-pro/app");
const offenders: string[] = [];

function* walk(dir: string): Generator<string> {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && p.endsWith(".ts")) yield p;
  }
}

// Heuristic: catch JSX-like tags in .ts files. Avoid obvious generics by requiring `</` or a tag start at line start/after whitespace.
const JSX_RE = /(^|\s)<[A-Za-z][^>]*>|<\/[A-Za-z]/;

for (const file of walk(APP)) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((ln, i) => {
    if (JSX_RE.test(ln)) offenders.push(`${file}:${i + 1}: ${ln.trim()}`);
  });
}

if (offenders.length) {
  console.error("Found JSX in .ts files (use .tsx):");
  console.error(offenders.join("\n"));
  process.exit(1);
}
console.log("preflight:no-jsx-in-ts PASS");
// <!-- END RBP GENERATED: remix-tsx-fix-v1-0 -->
