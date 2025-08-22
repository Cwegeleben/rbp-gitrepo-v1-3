// <!-- BEGIN RBP GENERATED: check-app-proxy -->
import fs from "node:fs";
import path from "node:path";

function parseAppProxy(toml: string) {
  // Tiny parser for [app_proxy] block
  const lines = toml.split(/\r?\n/);
  let inBlock = false;
  const out: Record<string, string> = {};
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    if (/^\[app_proxy\]/.test(line)) { inBlock = true; continue; }
    if (/^\[.*\]/.test(line)) { if (inBlock) break; continue; }
    if (!inBlock) continue;
    const m = line.match(/^([a-zA-Z0-9_]+)\s*=\s*(.+)$/);
    if (!m) continue;
    const k = m[1];
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return { prefix: out["prefix"], subpath: out["subpath"], url: out["url"] } as { prefix?: string; subpath?: string; url?: string };
}

// <!-- BEGIN RBP GENERATED: preflight-override -->
function getHostname(u?: string) {
  if (!u) return "";
  try {
    const url = new URL(u);
    return url.hostname;
  } catch {
    try {
      const url = new URL(`https://${u}`);
      return url.hostname;
    } catch {
      return "";
    }
  }
}

function printDiffTable(expected: { prefix?: string; subpath?: string; url?: string }, found: { prefix?: string; subpath?: string; url?: string }) {
  const rows: Array<[string, string, string]> = [
    ["prefix", String(expected.prefix ?? "<unset>"), String(found.prefix ?? "<missing>")],
    ["subpath", String(expected.subpath ?? "<unset>"), String(found.subpath ?? "<missing>")],
    ["url.host", getHostname(expected.url) || "<unset>", getHostname(found.url) || "<missing>"]
  ];
  const header = ["field", "expected", "found"];
  const widths = [header[0], header[1], header[2]].map((h, i) => Math.max(h.length, ...rows.map(r => r[i].length)));
  const fmt = (cols: string[]) => cols.map((c, i) => c.padEnd(widths[i])).join("  |");
  console.log(fmt(header));
  console.log(widths.map(w => "-".repeat(w)).join("--"));
  for (const r of rows) console.log(fmt(r as unknown as string[]));
}
// <!-- END RBP GENERATED: preflight-override -->

function main() {
  const strict = process.argv.includes("--strict") || process.env.PREFLIGHT_STRICT === "1";
  const appToml = path.resolve(process.cwd(), "src/apps/rbp-shopify-app/rod-builder-pro/shopify.app.toml");
  const expected = {
    prefix: "apps",
    subpath: "proxy",
    // Default expected proxy URL to Fly staging; allow override
    url: process.env.PREFLIGHT_EXPECTED_PROXY_URL ?? "https://rbp-rod-builder-pro-staging.fly.dev",
  };
  if (!fs.existsSync(appToml)) {
    console.log(`[WARN] Missing shopify.app.toml at ${appToml}`);
    if (strict) process.exit(1);
    return;
  }
  const toml = fs.readFileSync(appToml, "utf8");
  const found = parseAppProxy(toml);
  const expectedHost = getHostname(expected.url);
  const foundHost = getHostname(found.url);

  const isTunnel = foundHost.endsWith(".trycloudflare.com");
  const isLocal = foundHost === "localhost" || foundHost.endsWith(".localhost");

  const urlMatches = found.url === expected.url;
  const hasMismatch = !urlMatches || found.prefix !== expected.prefix || found.subpath !== expected.subpath;

  if (!hasMismatch) {
    console.log("[PASS] App Proxy configuration matches expected.");
    console.log({ proxy: { ...found, url: found.url }, expected: expected.url });
    process.exit(0);
  }

  // Special handling for tunnel/local URLs
  if (isTunnel || isLocal) {
    const lvl = strict ? "ERROR" : "WARN";
    console.log(`[${lvl}] Tunnel/local override in use; run non-strict preflight or set PREFLIGHT_EXPECTED_PROXY_URL to the tunnel.`);
    printDiffTable(expected, found);
    // Strict mode: fail only if no override AND found.url !== expected.url
    const shouldFail = strict && !process.env.PREFLIGHT_EXPECTED_PROXY_URL && !urlMatches;
    process.exit(shouldFail ? 1 : 0);
  }

  // Generic mismatch (non-tunnel)
  const lvl = strict ? "ERROR" : "WARN";
  console.log(`[${lvl}] App Proxy mismatch.`);
  printDiffTable(expected, found);
  console.log(`expected.url=${expectedHost} found.url=${foundHost || "<missing>"}`);
  process.exit(strict ? 1 : 0);
}

main();
// <!-- END RBP GENERATED: check-app-proxy -->
