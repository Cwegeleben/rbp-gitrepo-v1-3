// <!-- BEGIN RBP GENERATED: proxy-hardening-v2 -->
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { verifyShopifyProxySignature, shouldEnforceProxySignature, getProxyDiag } from "../utils/appProxy";
import fs from "node:fs/promises";
import path from "node:path";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const enforce = shouldEnforceProxySignature();

  // Strict 401 only when enforcement is enabled
  if (enforce && !verifyShopifyProxySignature(url)) {
    // <!-- BEGIN RBP GENERATED: proxy-misroute-detect-v1 -->
    const d = getProxyDiag(url);
    const diagHeader = `p=${d.path};b=${d.bypass ? 1 : 0};e=${d.enforce ? 1 : 0};sp=${d.signaturePresent ? 1 : 0};sv=${d.signatureValid ? 1 : 0};s=${d.secretUsed === "SHOPIFY_API_SECRET" ? "API" : d.secretUsed === "PROXY_HMAC_SECRET" ? "FALLBACK" : "NONE"}`;
    // <!-- END RBP GENERATED: proxy-misroute-detect-v1 -->
    return json(
      { ok: false, error: "unauthorized" },
      { status: 401, headers: { "cache-control": "no-store", "X-RBP-Proxy-Diag": diagHeader } }
    );
  }

  try {
    const filePath = path.resolve(process.cwd(), "config/registry.json");
    const text = await fs.readFile(filePath, "utf8");
    const raw = JSON.parse(text) as { modules?: Record<string, unknown> };

    // <!-- BEGIN RBP GENERATED: proxy-misroute-detect-v1 -->
    const d = getProxyDiag(url);
    const diagHeader = `p=${d.path};b=${d.bypass ? 1 : 0};e=${d.enforce ? 1 : 0};sp=${d.signaturePresent ? 1 : 0};sv=${d.signatureValid ? 1 : 0};s=${d.secretUsed === "SHOPIFY_API_SECRET" ? "API" : d.secretUsed === "PROXY_HMAC_SECRET" ? "FALLBACK" : "NONE"}`;
    // <!-- END RBP GENERATED: proxy-misroute-detect-v1 -->
    return json(
      {
        modules: raw.modules ?? {},
        updatedAt: new Date().toISOString(),
        ...(enforce ? {} : { bypass: true }),
      },
      { headers: { "cache-control": "no-store", "X-RBP-Proxy-Diag": diagHeader } }
    );
  } catch (err) {
    console.error("[proxy/registry] error:", err);
    // Degraded but never a 500; keep cache disabled
    // <!-- BEGIN RBP GENERATED: proxy-misroute-detect-v1 -->
    const d = getProxyDiag(new URL(request.url));
    const diagHeader = `p=${d.path};b=${d.bypass ? 1 : 0};e=${d.enforce ? 1 : 0};sp=${d.signaturePresent ? 1 : 0};sv=${d.signatureValid ? 1 : 0};s=${d.secretUsed === "SHOPIFY_API_SECRET" ? "API" : d.secretUsed === "PROXY_HMAC_SECRET" ? "FALLBACK" : "NONE"}`;
    // <!-- END RBP GENERATED: proxy-misroute-detect-v1 -->
    return json(
      {
        modules: {},
        updatedAt: new Date().toISOString(),
        degraded: true,
        ...(enforce ? {} : { bypass: true }),
      },
      { headers: { "cache-control": "no-store", "X-RBP-Proxy-Diag": diagHeader } }
    );
  }
}
// <!-- END RBP GENERATED: proxy-hardening-v2 -->
