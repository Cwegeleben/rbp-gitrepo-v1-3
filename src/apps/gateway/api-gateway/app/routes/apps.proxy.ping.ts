// <!-- BEGIN RBP GENERATED: proxy-hardening-v1 -->
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { shouldEnforceProxySignature, verifyShopifyProxySignature } from "../utils/appProxy";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Bypass on staging
  if (!shouldEnforceProxySignature()) {
    return json({ ok: true }, { headers: { "cache-control": "no-store" } });
  }

  // Enforce in production
  if (!verifyShopifyProxySignature(url)) {
    return json(
      { ok: false, error: "unauthorized" },
      { status: 401, headers: { "cache-control": "no-store" } }
    );
  }

  return json({ ok: true }, { headers: { "cache-control": "no-store" } });
}
// <!-- END RBP GENERATED: proxy-hardening-v1 -->
