// <!-- BEGIN RBP GENERATED: gateway-boot-resource-v1-0 -->
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader(_args: LoaderFunctionArgs) {
  // Minimal boot payload (adjust later as needed)
  const body = `// RBP boot
export const ok = true;`;
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
// <!-- END RBP GENERATED: gateway-boot-resource-v1-0 -->
