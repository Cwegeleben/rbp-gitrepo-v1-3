// <!-- BEGIN RBP GENERATED: proxy-hardening-v2 -->
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { verifyShopifyProxySignature, shouldEnforceProxySignature } from "../utils/appProxy";
import fs from "node:fs/promises";
import path from "node:path";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const enforce = shouldEnforceProxySignature();

  // Strict 401 only when enforcement is enabled
  if (enforce && !verifyShopifyProxySignature(url)) {
    return json(
      { ok: false, error: "unauthorized" },
      { status: 401, headers: { "cache-control": "no-store" } }
    );
  }

  try {
    const filePath = path.resolve(process.cwd(), "config/registry.json");
    const text = await fs.readFile(filePath, "utf8");
    const raw = JSON.parse(text) as { modules?: Record<string, unknown> };

    return json(
      {
        modules: raw.modules ?? {},
        updatedAt: new Date().toISOString(),
        ...(enforce ? {} : { bypass: true }),
      },
      { headers: { "cache-control": "no-store" } }
    );
  } catch (err) {
    console.error("[proxy/registry] error:", err);
    // Degraded but never a 500; keep cache disabled
    return json(
      {
        modules: {},
        updatedAt: new Date().toISOString(),
        degraded: true,
        ...(enforce ? {} : { bypass: true }),
      },
      { headers: { "cache-control": "no-store" } }
    );
  }
}
// <!-- END RBP GENERATED: proxy-hardening-v2 -->
