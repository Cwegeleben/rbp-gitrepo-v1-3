// <!-- BEGIN RBP GENERATED: gateway-dockerfix-v1-0 -->
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function fail(msg: string): never {
  console.error(`preflight:docker-gateway-only FAIL — ${msg}`);
  process.exit(1);
}

function ok(msg: string) {
  console.log(msg);
}

const dockerfilePath = join(process.cwd(), "src", "apps", "gateway", "api-gateway", "Dockerfile");
if (!existsSync(dockerfilePath)) fail("gateway Dockerfile missing");

const df = readFileSync(dockerfilePath, "utf8");

// Must not include prisma or Shopify symlink/paths
const forbidden = [
  /\bprisma\b/i,
  /\brbp-shopify-app\b/i,
  /\brod-builder-pro\b/i,
  /\bln\s+-s\b/i,
  /config\s+\/app\/src\/apps\/rbp-shopify-app/i,
];
for (const re of forbidden) {
  if (re.test(df)) fail(`forbidden directive found: ${re}`);
}

// Minimal asserts that we build and run the gateway app only
if (!/--filter\s+"\.\/src\/apps\/gateway\/api-gateway"\s+build/.test(df)) {
  fail("missing gateway-only build step");
}
if (!/CMD\s*\[\s*"pnpm"\s*,\s*"--filter"\s*,\s*"\.\/src\/apps\/gateway\/api-gateway"\s*,\s*"start"\s*\]/.test(df)) {
  fail("missing gateway start CMD");
}

ok("preflight:docker-gateway-only PASS");
// <!-- END RBP GENERATED: gateway-dockerfix-v1-0 -->
