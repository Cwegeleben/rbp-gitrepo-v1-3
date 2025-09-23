// <!-- BEGIN RBP GENERATED: proxy-hardening-v1 -->
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { shouldEnforceProxySignature } from "../utils/appProxy";
import { verifyShopifyProxySignature } from "../utils/appProxy";
import registryConfig from "../../../../../../config/registry.json";

type ModuleEntry = { name: string; version: string; path: string };

function resolveModules(): ModuleEntry[] {
  const modMap: any = (registryConfig as any)?.modules || {};
  const out: ModuleEntry[] = [];
  for (const [name, m] of Object.entries<any>(modMap)) {
    if (m && m.enabled === false) continue;
    const version: string = m?.version || m?.default;
    const path: string = m?.path || m?.versions?.[version]?.path;
    if (!name || !version || !path) continue;
    out.push({ name, version, path });
  }
  return out;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // 1) Staging bypass: return 200 immediately
  if (!shouldEnforceProxySignature()) {
    return json(
      { modules: resolveModules(), updatedAt: new Date().toISOString(), bypass: true },
      { headers: { "cache-control": "no-store" } }
    );
  }

  try {
    // 2) Prod enforcement: return 401 if bad/missing signature
    if (!verifyShopifyProxySignature(url)) {
      return json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    // 3) Normal 200 stub
    return json(
      { modules: resolveModules(), updatedAt: new Date().toISOString() },
      { headers: { "cache-control": "no-store" } }
    );
  } catch (err) {
    // 4) Last-ditch: never 500 the storefront
    console.error("[proxy/registry] error:", err, { url: request.url });
    return json(
      { modules: resolveModules(), updatedAt: new Date().toISOString(), degraded: true },
      { headers: { "cache-control": "no-store" } }
    );
  }
}
// <!-- END RBP GENERATED: proxy-hardening-v1 -->
