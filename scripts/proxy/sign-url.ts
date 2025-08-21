// BEGIN RBP GENERATED
import crypto from "node:crypto";

function usage() {
  console.log("Usage: SHOPIFY_API_SECRET=... pnpm proxy:sign /apps/proxy/<path> key1=val1 key2=val2");
  process.exit(1);
}

const secret = process.env.SHOPIFY_API_SECRET || process.env.SHOPIFY_API_SECRET_KEY || "";
if (!secret) {
  console.error("Missing SHOPIFY_API_SECRET (or SHOPIFY_API_SECRET_KEY)." );
  usage();
}

const [, , rawPath, ...kv] = process.argv;
if (!rawPath || !rawPath.startsWith("/apps/proxy")) usage();

const params = new URLSearchParams();
for (const pair of kv) {
  const ix = pair.indexOf("=");
  if (ix <= 0) continue;
  const k = pair.slice(0, ix);
  const v = pair.slice(ix + 1);
  if (k === "signature") continue;
  params.append(k, v);
}

const base = params.toString() ? `${rawPath}?${params.toString()}` : rawPath;
const signature = crypto.createHmac("sha256", secret).update(base).digest("hex");

const signed = new URLSearchParams(params);
signed.set("signature", signature);

const url = params.toString()
  ? `${rawPath}?${signed.toString()}`
  : `${rawPath}?signature=${signature}`;

console.log(url);
// END RBP GENERATED
