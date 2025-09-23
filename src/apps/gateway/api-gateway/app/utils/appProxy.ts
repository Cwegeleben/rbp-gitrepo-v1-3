// <!-- BEGIN RBP GENERATED: proxy-hardening-v1 -->
import crypto from "node:crypto";

function timingSafeEq(a: string, b: string) {
  try {
    const A = Buffer.from(a, "hex");
    const B = Buffer.from(b, "hex");
    if (A.length !== B.length) return false;
    return crypto.timingSafeEqual(A, B);
  } catch {
    return false;
  }
}

export function verifyShopifyProxySignature(url: URL): boolean {
  const signature = url.searchParams.get("signature") ?? url.searchParams.get("hmac");
  if (!signature) return false;

  const secret = process.env.SHOPIFY_API_SECRET ?? process.env.PROXY_HMAC_SECRET ?? "";
  if (!secret) return false;

  // Build canonical message: path + "?" + sorted query (excluding signature/hmac)
  const params = new URLSearchParams(url.searchParams);
  params.delete("signature");
  params.delete("hmac");
  const sorted = [...params.entries()].sort(([a], [b]) => a.localeCompare(b));
  const qs = new URLSearchParams(sorted).toString();
  const message = url.pathname + (qs ? `?${qs}` : "");

  const expected = crypto.createHmac("sha256", secret).update(message).digest("hex");
  return timingSafeEq(signature.toLowerCase(), expected.toLowerCase());
}

export function isProd() {
  return process.env.NODE_ENV === "production";
}

// <!-- BEGIN RBP GENERATED: proxy-bypass-v1 -->
export function shouldEnforceProxySignature() {
  if (process.env.RBP_PROXY_BYPASS === "1") return false; // staging/off
  return process.env.NODE_ENV === "production"; // prod/on
}
// <!-- END RBP GENERATED: proxy-bypass-v1 -->
// <!-- END RBP GENERATED: proxy-hardening-v1 -->
