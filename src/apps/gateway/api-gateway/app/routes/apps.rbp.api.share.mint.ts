// <!-- BEGIN RBP GENERATED: builds-share-links-v1 -->
import { json } from "@remix-run/node";
import crypto from "node:crypto";
import { enforce } from "../proxy/verify.server";

type TokenPayload = { buildId: string; iat: number; exp: number; v: number };

function getSecret(): string {
  const s = process.env.RBP_SHARE_SECRET || process.env.SHOPIFY_API_SECRET || "";
  if (!s) throw new Error("missing_secret");
  return s;
}

function sign(payload: TokenPayload, secret: string): string {
  const b64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const mac = crypto.createHmac("sha256", secret).update(b64).digest("base64url");
  return `${b64}.${mac}`;
}

export const loader = async ({ request }: { request: Request }) => {
  const block = await enforce(request);
  if (block) return block;
  const url = new URL(request.url);
  const buildId = url.searchParams.get("buildId");
  if (!buildId) return json({ error: "missing_buildId" }, { status: 400 });
  const ttlDays = Number(process.env.RBP_SHARE_TTL_DAYS ?? 7);
  const now = Math.floor(Date.now() / 1000);
  const exp = now + Math.max(1, Math.round(ttlDays * 24 * 60 * 60));
  const payload: TokenPayload = { buildId, iat: now, exp, v: 1 };
  const token = sign(payload, getSecret());
  return json({ token, expiresAt: new Date(exp * 1000).toISOString() }, { headers: { "cache-control": "no-store" } });
};

export const action = loader; // allow POST or GET
// <!-- END RBP GENERATED: builds-share-links-v1 -->
