// <!-- BEGIN RBP GENERATED: proxy-hardening-v1 -->
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { isProd, verifyShopifyProxySignature } from "../utils/appProxy";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);

    if (isProd() && !verifyShopifyProxySignature(url)) {
      return json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    return json(
      { modules: [], updatedAt: new Date().toISOString() },
      { headers: { "cache-control": "no-store" } }
    );
  } catch (err) {
    console.error("[proxy/registry] error:", err);
    return json({ ok: false }, { status: 500 });
  }
}
// <!-- END RBP GENERATED: proxy-hardening-v1 -->
