// BEGIN RBP GENERATED PREFLIGHT CLI
import fs from "fs/promises";
import path from "path";
import { srcRoot, cfgDir, modulesDir, detectDoubleSrc } from "../../src/apps/gateway/api-gateway/app/lib/paths.server.ts";
import toml from "toml";

const strict = process.argv.includes("--strict");
const results: string[] = [];
let okCount = 0, warnCount = 0, errCount = 0;

function bullet(type: string, msg: string) {
  results.push(`${type} ${msg}`);
  if (type === "✅") okCount++;
  else if (type === "⚠️") warnCount++;
  else if (type === "❌") errCount++;
}

// BEGIN RBP GENERATED
function info(msg: string) {
  console.log(`ℹ️ ${msg}`);
}
function ok(msg: string) {
  bullet("✅", msg);
}
function warn(msg: string) {
  bullet("⚠️", msg);
}
function err(msg: string) {
  bullet("❌", msg);
}
// END RBP GENERATED

function checkDoubleSrc() {
  [srcRoot, cfgDir, modulesDir].forEach((p, i) => {
    if (detectDoubleSrc && detectDoubleSrc(p)) {
      bullet("⚠️", `Detected synthetic double src/src in ${["srcRoot","cfgDir","modulesDir"][i]}; check path resolution.`);
    }
  });
}

async function checkModules() {
  const required = ["rbp-shell", "rbp-catalog", "rbp-builds"];
  try {
    const entries = await fs.readdir(modulesDir);
    required.forEach(mod => {
      if (!entries.includes(mod)) {
        bullet("⚠️", `Module missing: ${mod}`);
      } else {
        bullet("✅", `Module present: ${mod}`);
      }
    });
  } catch {
    bullet("❌", "Modules dir missing");
  }
}

async function checkThemeExtension() {
  const extRoot = path.join(srcRoot, "apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme");
  const blocks = path.join(extRoot, "blocks");
  const assets = path.join(extRoot, "assets");
  let blocksOk = false, assetsOk = false;
  try {
    blocksOk = (await fs.stat(blocks)).isDirectory();
    bullet("✅", "Theme blocks/ present");
  } catch {
    bullet("⚠️", "Theme blocks/ missing (create blocks/rbp-builder.liquid)");
  }
  try {
    assetsOk = (await fs.stat(assets)).isDirectory();
    bullet("✅", "Theme assets/ present");
  } catch {
    bullet("⚠️", "Theme assets/ missing (create assets/rbp-bootstrap.js)");
  }
  // Check for dev/deploy bundle
  const shopifyDir = path.join(srcRoot, "apps/rbp-shopify-app/rod-builder-pro/.shopify");
  try {
    const bundleDirs = await fs.readdir(shopifyDir);
    for (const dir of bundleDirs) {
      // Info: curl -sS "https://rbp-dev.myshopify.com/apps/proxy/doctor?hello=world" | jq
      if (dir.endsWith("bundle")) {
        const bundlePath = path.join(shopifyDir, dir);
        const hasBlocks = await fs.stat(path.join(bundlePath, "blocks")).catch(()=>false);
        const hasAssets = await fs.stat(path.join(bundlePath, "assets")).catch(()=>false);
        if ((!(blocksOk && assetsOk)) && (hasBlocks || hasAssets)) {
          bullet("⚠️", "Theme is only present in dev/deploy bundle; restore source files under extensions/rbp-theme.");
        }
      }
    }
  } catch {}
}

// BEGIN RBP GENERATED PREFLIGHT EXTRAS
async function checkGhostStorefrontTheme() {
  const ghostTheme = path.join(srcRoot, "apps/storefront/rbp-theme");
  try {
    if ((await fs.stat(ghostTheme)).isDirectory()) {
      bullet("⚠️", "Ghost storefront theme path detected: apps/storefront/rbp-theme");
    }
  } catch {}
}

async function checkGatewayShimImport() {
  try {
    await import("../../src/apps/gateway/api-gateway/app/lib/paths.server.ts");
    bullet("✅", "Gateway shim import resolved");
  } catch {
    bullet("❌", "Gateway shim import failed");
  }
}

async function checkEmptyModuleDirs() {
  const required = ["rbp-shell", "rbp-catalog", "rbp-builds"];
  for (const mod of required) {
    const modPath = path.join(modulesDir, mod);
    try {
      const files = await fs.readdir(modPath);
      if (files.length === 0) {
        bullet("⚠️", `Module dir empty: ${mod}`);
      }
    } catch {}
  }
}

// BEGIN RBP GENERATED
// BEGIN RBP GENERATED
async function checkBundleSourceOverlap() {
  const devBundle = path.join(srcRoot, "apps/rbp-shopify-app/rod-builder-pro/.shopify/dev-bundle");
  const deployBundle = path.join(srcRoot, "apps/rbp-shopify-app/rod-builder-pro/.shopify/deploy-bundle");
  const blocks = path.join(srcRoot, "apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/blocks");
  const assets = path.join(srcRoot, "apps/rbp-shopify-app/rod-builder-pro/extensions/rbp-theme/assets");

  const [devExists, deployExists, blocksExists, assetsExists] = await Promise.all([
    fs.access(devBundle).then(() => true).catch(() => false),
    fs.access(deployBundle).then(() => true).catch(() => false),
    fs.access(blocks).then(() => true).catch(() => false),
    fs.access(assets).then(() => true).catch(() => false),
  ]);

  const bundlePresent = devExists || deployExists;
  const sourcePresent = blocksExists && assetsExists;

  if (bundlePresent && sourcePresent) {
    if (strict) {
      bullet("⚠️", "Note: .shopify/*bundle/* exists and source theme folders exist; avoid editing bundle outputs.");
    } else {
      info("Note: .shopify/*bundle/* exists and source theme folders exist; avoid editing bundle outputs.");
    }
  }
}
// END RBP GENERATED
// END RBP GENERATED
// END RBP GENERATED PREFLIGHT EXTRAS

async function checkTOML() {
  const tomlPath = path.join(srcRoot, "apps/rbp-shopify-app/rod-builder-pro/shopify.app.toml");
  try {
    const raw = await fs.readFile(tomlPath, "utf8");
    const conf = toml.parse(raw);
    if (conf.app_proxy?.prefix === "apps" && conf.app_proxy?.subpath === "proxy") {
      bullet("✅", "App proxy config OK");
    } else {
      bullet("❌", "App proxy config missing or incorrect");
    }
  } catch {
    bullet("❌", "Cannot read shopify.app.toml");
  }
}

async function checkRoutes() {
// BEGIN RBP GENERATED
async function fileExists(p) { try { await fs.access(p); return true; } catch { return false; } }

async function assertSingleRouteBase(name) {
  const baseTs = `src/apps/rbp-shopify-app/rod-builder-pro/app/routes/${name}.ts`;
  const baseTsx = `src/apps/rbp-shopify-app/rod-builder-pro/app/routes/${name}.tsx`;
  const hasTs = await fileExists(baseTs);
  const hasTsx = await fileExists(baseTsx);
  if (hasTs && hasTsx) {
    warn(`Route ID collision: ${name}.ts and ${name}.tsx – remove one (prefer .tsx).`);
  } else if (!hasTs && !hasTsx) {
    err(`Canonical trimmed route missing: ${name} (dev proxy trims /apps/proxy).`);
  } else {
    ok(`Canonical trimmed route present: ${name} (${hasTsx ? "tsx" : "ts"})`);
  }
}

async function assertReexportOnly(proxyName, target) {
  const f = `src/apps/rbp-shopify-app/rod-builder-pro/app/routes/${proxyName}.ts`;
  if (!await fileExists(f)) { err(`Missing ${proxyName}.ts re-export`); return; }
  const src = await fs.readFile(f, "utf8");
  const reexport = new RegExp(`export\\s*\\{\\s*loader\\s*\\}\\s*from\\s*["']\\./${target}["']\\s*;?`);
  if (!reexport.test(src) || src.split("\n").filter(l => l.trim() && !l.trim().startsWith("//")).length > 1) {
    warn(`${proxyName}.ts should only re-export loader from \"./${target}\"`);
  } else {
    ok(`${proxyName}.ts re-exports loader`);
  }
}

await assertSingleRouteBase("doctor");
await assertReexportOnly("apps.proxy.doctor", "doctor");

await assertSingleRouteBase("ping");
await assertReexportOnly("apps.proxy.ping", "ping");
// END RBP GENERATED
  const routes = [
    "apps/rbp-shopify-app/rod-builder-pro/app/routes/apps.proxy.ping.ts",
    "apps/rbp-shopify-app/rod-builder-pro/app/routes/apps.proxy.$.ts"
  ];
  for (const r of routes) {
    try {
      await fs.stat(path.join(srcRoot, r));
      bullet("✅", `Route present: ${r.split("/").pop()}`);
    } catch {
      bullet("❌", `Route missing: ${r.split("/").pop()}`);
    }
  }
  // BEGIN RBP GENERATED
  // Check Doctor route
  {
    const doctor = path.join(srcRoot, "apps/rbp-shopify-app/rod-builder-pro/app/routes/apps.proxy.doctor.ts");
    try {
      await fs.access(doctor);
      bullet("✅", `Route present: apps.proxy.doctor.ts`);
    } catch {
      bullet("❌", `Route missing: apps.proxy.doctor.ts`);
    }
  }
  // END RBP GENERATED
    // BEGIN RBP GENERATED
    async function fileExists(p) {
      try { await fs.access(p); return true; } catch { return false; }
    }

    // Doctor: exactly one of doctor.ts / doctor.tsx
    {
      const ts = "src/apps/rbp-shopify-app/rod-builder-pro/app/routes/doctor.ts";
      const tsx = "src/apps/rbp-shopify-app/rod-builder-pro/app/routes/doctor.tsx";
      const hasTs = await fileExists(ts);
      const hasTsx = await fileExists(tsx);

      if (hasTs && hasTsx) {
        warn("Route ID collision: doctor.ts and doctor.tsx – remove one (prefer .tsx for document navigations).");
      } else if (!hasTs && !hasTsx) {
        warn("Shadow route missing: doctor (Shopify dev proxy trims /apps/proxy).");
      } else {
        ok(`Shadow route present: doctor (${hasTsx ? "tsx" : "ts"})`);
      }
    }

    // Ping: exactly one of ping.ts / ping.tsx
    {
      const ts = "src/apps/rbp-shopify-app/rod-builder-pro/app/routes/ping.ts";
      const tsx = "src/apps/rbp-shopify-app/rod-builder-pro/app/routes/ping.tsx";
      const hasTs = await fileExists(ts);
      const hasTsx = await fileExists(tsx);

      if (hasTs && hasTsx) {
        warn("Route ID collision: ping.ts and ping.tsx – remove one (prefer the existing .tsx).");
      } else if (!hasTs && !hasTsx) {
        warn("Shadow route missing: ping (Shopify dev proxy trims /apps/proxy).");
      } else {
        ok(`Shadow route present: ping (${hasTsx ? "tsx" : "ts"})`);
      }
    }
    // END RBP GENERATED
}

async function checkConfigDir() {
  try {
    await fs.stat(cfgDir);
    bullet("✅", "Config dir present");
  } catch {
    bullet("⚠️", "Missing config/; create with `mkdir -p config`.");
  }
}

async function main() {
  checkDoubleSrc();
  await checkModules();
  await checkThemeExtension();
  await checkGhostStorefrontTheme();
  await checkGatewayShimImport();
  await checkEmptyModuleDirs();
  await checkBundleSourceOverlap();
  await checkTOML();
  await checkRoutes();
  await checkConfigDir();
  // Summary
  results.forEach(r => console.log(r));
  console.log(`\n✅ ${okCount}  ⚠️ ${warnCount}  ❌ ${errCount}`);
  if (errCount || (strict && warnCount)) process.exit(1);
  process.exit(0);
}
main();
// END RBP GENERATED PREFLIGHT CLI
