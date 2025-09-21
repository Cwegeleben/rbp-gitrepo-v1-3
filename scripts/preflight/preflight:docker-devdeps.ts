// <!-- BEGIN RBP GENERATED: gateway-docker-devdeps-fix-v1-0 -->
import fs from "node:fs";
import path from "node:path";

const p = path.join(process.cwd(), "src/apps/gateway/api-gateway/Dockerfile");
if (!fs.existsSync(p)) {
  console.error("Dockerfile not found for gateway app");
  process.exit(1);
}
const t = fs.readFileSync(p, "utf8");
if (!/pnpm\s+-w\s+-r\s+install[^\n]*--prod=false/.test(t)) {
  console.error("Dockerfile must install devDependencies in deps stage: add --prod=false to pnpm install");
  process.exit(1);
}
if (/prisma|rbp-shopify-app|rod-builder-pro|ln\s+-s\s+.*rbp-shopify-app/.test(t)) {
  console.error("Dockerfile contains forbidden Shopify/Prisma directives");
  process.exit(1);
}
console.log("preflight:docker-devdeps PASS");
// <!-- END RBP GENERATED: gateway-docker-devdeps-fix-v1-0 -->
