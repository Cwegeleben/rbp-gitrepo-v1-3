// <!-- BEGIN RBP GENERATED: proxy-misroute-detect-v1 -->
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { getProxyDiag } from "../utils/appProxy";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const diag = getProxyDiag(url);
    const body = {
      path: diag.path,
      bypass: diag.bypass,
      enforce: diag.enforce,
      signaturePresent: diag.signaturePresent,
      signatureValid: diag.signatureValid,
      secretUsed: diag.secretUsed,
      routeId: "routes/apps.proxy._diag",
    } as const;
    return json(body, { headers: { "cache-control": "no-store" } });
  } catch {
    // Never throw; always return 200 with safe defaults
    return json(
      {
        path: "/apps/proxy/_diag",
        bypass: process.env.RBP_PROXY_BYPASS === "1",
        enforce: false,
        signaturePresent: false,
        signatureValid: false,
        secretUsed: "none",
        routeId: "routes/apps.proxy._diag",
      },
      { headers: { "cache-control": "no-store" } }
    );
  }
}
// <!-- END RBP GENERATED: proxy-misroute-detect-v1 -->
