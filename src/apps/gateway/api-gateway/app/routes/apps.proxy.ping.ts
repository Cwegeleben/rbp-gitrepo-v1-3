// <!-- BEGIN RBP GENERATED: proxy-hardening-v1 -->
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { shouldEnforceProxySignature, verifyShopifyProxySignature } from "../utils/appProxy";
// <!-- BEGIN RBP GENERATED: app-proxy-diagnostics-v1-1 -->
import { getProxyDiag } from "../utils/getProxyDiag";
// <!-- END RBP GENERATED: app-proxy-diagnostics-v1-1 -->

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Bypass on staging
  if (!shouldEnforceProxySignature()) {
  // <!-- BEGIN RBP GENERATED: app-proxy-diagnostics-v1-1 -->
  const d = getProxyDiag(url);
  const diagHeader = `p=${d.path};b=${d.bypass ? 1 : 0};e=${d.enforce ? 1 : 0};sp=${d.signaturePresent ? 1 : 0};sv=${d.signatureValid ? 1 : 0};s=${d.secretUsed === "SHOPIFY_API_SECRET" ? "API" : d.secretUsed === "PROXY_HMAC_SECRET" ? "FALLBACK" : "NONE"}`;
  return json({ ok: true }, { headers: { "cache-control": "no-store", "X-RBP-Proxy": "ok", "X-RBP-Proxy-Diag": diagHeader } });
  // <!-- END RBP GENERATED: app-proxy-diagnostics-v1-1 -->
  }

  // Enforce in production
  if (!verifyShopifyProxySignature(url)) {
    // <!-- BEGIN RBP GENERATED: app-proxy-diagnostics-v1-1 -->
    const d = getProxyDiag(url);
    const diagHeader = `p=${d.path};b=${d.bypass ? 1 : 0};e=${d.enforce ? 1 : 0};sp=${d.signaturePresent ? 1 : 0};sv=${d.signatureValid ? 1 : 0};s=${d.secretUsed === "SHOPIFY_API_SECRET" ? "API" : d.secretUsed === "PROXY_HMAC_SECRET" ? "FALLBACK" : "NONE"}`;
    return json(
      { ok: false, error: "unauthorized" },
      { status: 401, headers: { "cache-control": "no-store", "X-RBP-Proxy": "fail", "X-RBP-Proxy-Diag": diagHeader } }
    );
    // <!-- END RBP GENERATED: app-proxy-diagnostics-v1-1 -->
  }

  // <!-- BEGIN RBP GENERATED: app-proxy-diagnostics-v1-1 -->
  const d = getProxyDiag(url);
  const diagHeader = `p=${d.path};b=${d.bypass ? 1 : 0};e=${d.enforce ? 1 : 0};sp=${d.signaturePresent ? 1 : 0};sv=${d.signatureValid ? 1 : 0};s=${d.secretUsed === "SHOPIFY_API_SECRET" ? "API" : d.secretUsed === "PROXY_HMAC_SECRET" ? "FALLBACK" : "NONE"}`;
  return json({ ok: true }, { headers: { "cache-control": "no-store", "X-RBP-Proxy": "ok", "X-RBP-Proxy-Diag": diagHeader } });
  // <!-- END RBP GENERATED: app-proxy-diagnostics-v1-1 -->
}
// <!-- END RBP GENERATED: proxy-hardening-v1 -->
