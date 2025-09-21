// <!-- BEGIN RBP GENERATED: gateway-boot-resource-v1-0 -->
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP = path.join(ROOT, "src/apps/gateway/api-gateway/app/routes");
// Resource patterns we want to enforce as loader-only:
const GLOBS = [/^apps\.proxy\..*$/];

function* walk(dir: string): Generator<string> {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && (p.endsWith(".ts") || p.endsWith(".tsx"))) yield p;
  }
}

const offenders: string[] = [];
for (const file of walk(APP)) {
  const base = path.basename(file);
  if (!GLOBS.some(re => re.test(base))) continue;
  const src = fs.readFileSync(file, "utf8");
  // disallow default export, React/JSX, or @remix-run/react
  if (/export\s+default\s+/m.test(src)) offenders.push(`${file}: default export not allowed`);
  if (/\bfrom\s+['"]@remix-run\/react['"]/.test(src)) offenders.push(`${file}: @remix-run/react import not allowed`);
  if (/<[A-Za-z]/.test(src)) offenders.push(`${file}: JSX not allowed`);
}

if (offenders.length) {
  console.error("preflight:remix-resource-routes FAIL");
  console.error(offenders.join("\n"));
  process.exit(1);
}
console.log("preflight:remix-resource-routes PASS");
// <!-- END RBP GENERATED: gateway-boot-resource-v1-0 -->
