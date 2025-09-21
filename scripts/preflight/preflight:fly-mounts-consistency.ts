// <!-- BEGIN RBP GENERATED: fly-volume-reconcile-v1-0 -->
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FLY = path.join(ROOT, "src/apps/gateway/api-gateway/fly.toml");

function read(file: string) {
  try { return fs.readFileSync(file, "utf8"); } catch { return ""; }
}

const flyToml = read(FLY);
if (!flyToml) {
  console.error("fly.toml not found at", FLY);
  process.exit(1);
}

// Very light TOML parse via regex for mounts
const mounts = Array.from(flyToml.matchAll(/\[\[mounts\]\][^\[]+/g)).map(m => m[0]);
const hasDataDest = mounts.some(block => /destination\s*=\s*"\/data"/i.test(block));

// Heuristic: if repo tooling references file:/data/, enforce mounts include /data
const repoImpliesData = [
  read(path.join(ROOT, "package.json")),
  read(path.join(ROOT, "scripts/fly/ensure-volume.sh")),
  read(path.join(ROOT, "README.md")),
  read(path.join(ROOT, "README_DEV.md")),
  read(path.join(ROOT, "src/apps/gateway/api-gateway/.env")),
].some(txt => /file:\/data\//.test(txt));

if (repoImpliesData && !hasDataDest) {
  console.error("Missing [[mounts]] with destination=/data in fly.toml, but repo uses file:/data/... DATABASE_URL.");
  process.exit(1);
}

console.log("preflight:fly-mounts-consistency PASS");
// <!-- END RBP GENERATED: fly-volume-reconcile-v1-0 -->
