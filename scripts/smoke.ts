// <!-- BEGIN RBP GENERATED: Tests-AccessV2 -->
/**
 * RBP Smoke Runner — Access V2 + App Proxy checks
 * - Verifies /apps/rbp/api/access/ctx shape
 * - Signs and calls /apps/proxy endpoints (ping, checkout/package)
 * - Toggles checkout:package off/on via Admin Access POST
 *
 * Usage:
 *   PORT=51544 SHOPIFY_API_SECRET=... tsx scripts/smoke.ts
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { FEATURE_KEYS } from "../src/apps/gateway/api-gateway/app/proxy/features.registry";

type Ctx = { roles?: string[]; features?: Record<string, boolean> } & Record<string, any>;

// <!-- BEGIN RBP GENERATED: DevUX v1 -->
async function waitForServer(baseUrl: string) {
  const target = `${baseUrl}/apps/rbp/api/access/ctx?userId=admin@rbp`;
  const maxTries = 30;
  const delayMs = 500;
  for (let i = 1; i <= maxTries; i++) {
    try {
      const r = await fetch(target, { method: "GET" });
      if (r.ok) return true;
    } catch {}
    await new Promise((res) => setTimeout(res, delayMs));
  }
  console.error(`\nServer not reachable at ${target}
Hints:
- Start the dev server:  pnpm dev:up  (alias of dev:shopify-cli)
- Ensure PORT matches your dev server (env or scripts/port.env)
- Then re-run:          pnpm smoke\n`);
  return false;
}
// <!-- END RBP GENERATED: DevUX v1 -->

function readPort(): number {
  const fromEnv = process.env.PORT && Number(process.env.PORT);
  if (fromEnv) return fromEnv;
  const p = path.resolve(process.cwd(), "scripts/port.env");
  if (fs.existsSync(p)) {
    try {
      const raw = fs.readFileSync(p, "utf8");
      const m = raw.match(/PORT\s*=\s*(\d+)/);

      if (m) return Number(m[1]);
    } catch {}
  }
  return 51544;
}

function signProxyPath(rawPath: string, params: Record<string, string | number | boolean> = {}): string {
  const secret = process.env.SHOPIFY_API_SECRET || process.env.SHOPIFY_API_SECRET_KEY || "";
  if (!secret) throw new Error("Missing SHOPIFY_API_SECRET for signing");
  if (!rawPath.startsWith("/apps/proxy")) throw new Error("signProxyPath requires /apps/proxy path");
  const qp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (k === "signature") continue;
    qp.append(k, String(v));
  }
  const base = qp.toString() ? `${rawPath}?${qp.toString()}` : rawPath;
  const signature = crypto.createHmac("sha256", secret).update(base).digest("hex");
  qp.set("signature", signature);
  return qp.toString() ? `${rawPath}?${qp.toString()}` : `${rawPath}?signature=${signature}`;
}

function color(ok: boolean, msg: string) {
  const GREEN = "\u001b[32m";
  const RED = "\u001b[31m";
  const NC = "\u001b[0m";
  const s = ok ? `${GREEN}PASS${NC}` : `${RED}FAIL${NC}`;
  console.log(`${s} ${msg}`);
}

async function getJSON<T = any>(url: string, init?: RequestInit): Promise<{ ok: boolean; status: number; json?: T; text?: string; }> {
  try {
    const res = await fetch(url, init);
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const j = (await res.json()) as T;
      return { ok: res.ok, status: res.status, json: j };
    } else {
      const t = await res.text();
      return { ok: res.ok, status: res.status, text: t };
    }
  } catch (e: any) {
    return { ok: false, status: 0, text: e?.message || String(e) };
  }
}

async function adminToggleFeature(base: string, tenant: string, toggles: Record<string, boolean>, asUser: string) {
  // POST to Admin Access route: /admin/access/:tenant
  const url = `${base}/admin/access/${encodeURIComponent(tenant)}?userId=${encodeURIComponent(asUser)}`;
  const form = new URLSearchParams();
  for (const k of FEATURE_KEYS) {
    if (toggles[k]) form.append(k, "on");
  }
  return fetch(url, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
}

async function main() {
  const PORT = readPort();
  const base = `http://localhost:${PORT}`;
  const demoTenant = "demo.myshopify.com"; // same as local compat in verify.server
  const adminUser = "admin@rbp";
  const guestUser = "guest@rbp";

  let failures = 0;

  // <!-- BEGIN RBP GENERATED: DevUX v1 -->
  const ready = await waitForServer(base);
  if (!ready) process.exit(1);
  // <!-- END RBP GENERATED: DevUX v1 -->

  // 1) ctx shape
  const ctxUrl = `${base}/apps/rbp/api/access/ctx?userId=${encodeURIComponent(adminUser)}`;
  const c1 = await getJSON<Ctx>(ctxUrl);
  const hasCtx = !!c1.json && Array.isArray(c1.json.roles) && !!c1.json.features && typeof c1.json.features === "object";
  color(hasCtx, "ctx has roles and features");
  if (!hasCtx) failures++;

  // 2) Signed /apps/proxy/ping
  try {
    const pingPath = signProxyPath("/apps/proxy/ping");
    const r = await fetch(base + pingPath);
    const ok = r.status === 200;
    color(ok, "/apps/proxy/ping 200 (signed)");
    if (!ok) failures++;
  } catch (e) {
    color(false, `/apps/proxy/ping error: ${(e as Error).message}`);
    failures++;
  }

  // 3) Ensure checkout:package ON, create a build, then check 200
  // Read current features
  const ctxNow = await getJSON<Ctx>(`${base}/apps/rbp/api/access/ctx?userId=${encodeURIComponent(adminUser)}`);
  const current = (ctxNow.json?.features ?? {}) as Record<string, boolean>;
  const desiredOn = { ...current, ["checkout:package"]: true };
  await adminToggleFeature(base, demoTenant, desiredOn, adminUser);

  // Create a build (title only) as admin
  let buildId: string | null = null;
  try {
    const createPath = signProxyPath("/apps/proxy/api/builds", { userId: adminUser });
    const r = await getJSON<any>(base + createPath, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Smoke Build" }),
    });
    buildId = (r.json as any)?.id || null;
  } catch {}

  // Call checkout/package with buildId
  try {
    const pkgPath = signProxyPath("/apps/proxy/api/checkout/package", { buildId: buildId ?? "__nope__", userId: adminUser });
    const r = await fetch(base + pkgPath);
    const ok = r.status === 200; // expected when feature enabled and valid build
    color(ok, "/apps/proxy/api/checkout/package 200 when enabled");
    if (!ok) failures++;
  } catch (e) {
    color(false, `/apps/proxy/api/checkout/package error: ${(e as Error).message}`);
    failures++;
  }

  // 4) Toggle OFF, then expect 403 as non-admin
  const desiredOff = { ...current, ["checkout:package"]: false };
  await adminToggleFeature(base, demoTenant, desiredOff, adminUser);
  try {
    const pkgPath = signProxyPath("/apps/proxy/api/checkout/package", { buildId: buildId ?? "__nope__", userId: guestUser });
    const r = await getJSON<any>(base + pkgPath);
    const ok = r.status === 403 && r.json && r.json.error === "forbidden" && r.json.feature === "checkout:package";
    color(ok, "403 when disabled (with { error:'forbidden', feature:'checkout:package' })");
    if (!ok) failures++;
  } catch (e) {
    color(false, `/apps/proxy/api/checkout/package expect 403 failed: ${(e as Error).message}`);
    failures++;
  }

  // 5) Toggle ON again, expect 200 as admin
  await adminToggleFeature(base, demoTenant, desiredOn, adminUser);
  try {
    const pkgPath = signProxyPath("/apps/proxy/api/checkout/package", { buildId: buildId ?? "__nope__", userId: adminUser });
    const r = await fetch(base + pkgPath);
    const ok = r.status === 200;
    color(ok, "200 again after re-enable");
    if (!ok) failures++;
  } catch (e) {
    color(false, `/apps/proxy/api/checkout/package re-enable check failed: ${(e as Error).message}`);
    failures++;
  }

  if (failures === 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();
// <!-- END RBP GENERATED: Tests-AccessV2 -->
