// <!-- BEGIN RBP GENERATED: builds-share-links-v1 -->
import { json } from "@remix-run/node";
import crypto from "node:crypto";
import { enforce } from "../proxy/verify.server";

function getSecret(): string {
  const s = process.env.RBP_SHARE_SECRET || process.env.SHOPIFY_API_SECRET || "";
  if (!s) throw new Error("missing_secret");
  return s;
}

function timingSafeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function verify(token: string, secret: string): { ok: boolean; payload?: any; reason?: string } {
  const parts = token.split(".");
  if (parts.length !== 2) return { ok: false, reason: "format" };
  const [b64, mac] = parts;
  try {
    const dec = JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
    const expect = crypto.createHmac("sha256", secret).update(b64).digest("base64url");
    if (!timingSafeEq(expect, mac)) return { ok: false, reason: "sig" };
    const now = Math.floor(Date.now() / 1000);
    if (typeof dec.exp !== "number" || now >= dec.exp) return { ok: false, reason: "expired" };
    return { ok: true, payload: dec };
  } catch {
    return { ok: false, reason: "decode" };
  }
}

async function fetchBuild(buildId: string): Promise<any | null> {
  // Minimal internal fetch via proxy builds API
  try {
    const r = await fetch(`${process.env.RBP_SELF_ORIGIN ?? ''}/apps/proxy/api/builds/${encodeURIComponent(buildId)}`, { cache: 'no-store' });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

function sanitize(build: any){
  const items = Array.isArray(build?.items) ? build.items.map((it: any) => ({
    productId: it.productId ?? null,
    variantId: it.variantId ?? null,
    type: it.type ?? it.slotType ?? null,
    title: it.title ?? it.label ?? null,
    vendor: it.vendor ?? null,
    quantity: Number(it.quantity ?? 1),
  })) : [];
  return { id: String(build?.id ?? ''), name: String(build?.title ?? 'Shared Build'), items };
}

export const loader = async ({ request }: { request: Request }) => {
  const block = await enforce(request);
  if (block) return block;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) return json({ error: "missing_token" }, { status: 400 });
  // Dev UNSIGNED fallback: token starting with UNSIGNED.
  if (token.startsWith("UNSIGNED.")) {
    const buildId = token.slice("UNSIGNED.".length);
    const build = await fetchBuild(buildId);
    if (!build) return json({ error: "not_found" }, { status: 404 });
    return json({ build: sanitize(build), expiresAt: null }, { headers: { "cache-control": "no-store" } });
  }
  const v = verify(token, getSecret());
  if (!v.ok) {
    const status = v.reason === 'expired' ? 410 : 401;
    return json({ error: v.reason || 'invalid' }, { status });
  }
  const build = await fetchBuild(String(v.payload?.buildId ?? ''));
  if (!build) return json({ error: "not_found" }, { status: 404 });
  return json({ build: sanitize(build), expiresAt: new Date(Number(v.payload.exp) * 1000).toISOString() }, { headers: { "cache-control": "no-store" } });
};
// <!-- END RBP GENERATED: builds-share-links-v1 -->
