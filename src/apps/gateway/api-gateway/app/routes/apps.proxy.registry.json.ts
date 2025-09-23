// <!-- BEGIN RBP GENERATED: proxy-registry-endpoint-v1-0 -->
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { verifyShopifyProxySignature, shouldEnforceProxySignature, getProxyDiag } from "../utils/appProxy";
import { getTenantFromRequest } from "../proxy/verify.server";
import { getRegistryForTenant } from "../registry/tenantRegistry.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const enforce = shouldEnforceProxySignature();

  if (enforce && !verifyShopifyProxySignature(url)) {
    const d = getProxyDiag(url);
    const diagHeader = `p=${d.path};b=${d.bypass ? 1 : 0};e=${d.enforce ? 1 : 0};sp=${d.signaturePresent ? 1 : 0};sv=${d.signatureValid ? 1 : 0};s=${d.secretUsed === "SHOPIFY_API_SECRET" ? "API" : d.secretUsed === "PROXY_HMAC_SECRET" ? "FALLBACK" : "NONE"}`;
    return json(
      { ok: false, error: "unauthorized" },
      { status: 401, headers: { "cache-control": "no-store", "X-RBP-Proxy-Diag": diagHeader } }
    );
  }

  const tenant = getTenantFromRequest ? getTenantFromRequest(request).tenant : (url.searchParams.get('shop') || 'unknown');
  try {
    const reg = await getRegistryForTenant(String(tenant));
    const d = getProxyDiag(url);
    const diagHeader = `p=${d.path};ten=${encodeURIComponent(String(tenant))};e=${d.enforce ? 1 : 0}`;
    return json(reg, {
      headers: {
        "cache-control": "no-store",
        "X-RBP-Proxy": "ok",
        "X-RBP-Proxy-Diag": diagHeader,
      },
    });
  } catch (err) {
    console.error("[proxy/registry] error:", err);
    const d = getProxyDiag(url);
    const diagHeader = `p=${d.path};ten=${encodeURIComponent(String(tenant))};e=${d.enforce ? 1 : 0};err=1`;
    return json(
      { modules: {}, degraded: true },
      { headers: { "cache-control": "no-store", "X-RBP-Proxy": "fail", "X-RBP-Proxy-Diag": diagHeader } }
    );
  }
}
// <!-- END RBP GENERATED: proxy-registry-endpoint-v1-0 -->
