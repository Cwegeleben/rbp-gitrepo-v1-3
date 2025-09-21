// <!-- BEGIN RBP GENERATED: gateway-pin-and-bind-v1-2 -->
import fs from "node:fs";
import path from "node:path";

const p = path.join(process.cwd(), "src/apps/gateway/api-gateway/fly.toml");
if (!fs.existsSync(p)) {
  console.error("fly.toml not found for gateway app");
  process.exit(1);
}
const t = fs.readFileSync(p, "utf8");
// allow local dockerfile since fly.toml is inside gateway folder
const okLocal = /\[build][\s\S]*dockerfile\s*=\s*"Dockerfile"[\s\S]*context\s*=\s*"\."\s*$/m.test(t);
// keep support for the earlier absolute-from-root style if the config moves later
const okRoot = /\[build][\s\S]*dockerfile\s*=\s*"src\/apps\/gateway\/api-gateway\/Dockerfile"[\s\S]*context\s*=\s*"\."\s*$/m.test(t);
if (!(okLocal || okRoot)) {
  console.error("fly.toml must pin build.dockerfile to the gateway Dockerfile with context '.'");
  process.exit(1);
}
console.log("preflight:fly-build-pin PASS");
// <!-- END RBP GENERATED: gateway-pin-and-bind-v1-2 -->
