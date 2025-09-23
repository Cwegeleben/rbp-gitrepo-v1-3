// <!-- BEGIN RBP GENERATED: gateway-remix-root-v1-0 -->
import * as React from "react";
// <!-- BEGIN RBP GENERATED: root-redirect-preflight-v1 -->
export async function loader() {
  // Fast server redirect from "/" to "/app" to avoid SSR 500s at root
  return new Response(null, { status: 302, headers: { Location: "/app" } });
}
// <!-- END RBP GENERATED: root-redirect-preflight-v1 -->

export default function Index() {
  return (
    <main style={{ font: "16px/1.4 system-ui, sans-serif", padding: 16 }}>
      <h1>RBP Gateway</h1>
      <p>OK</p>
    </main>
  );
}
// <!-- END RBP GENERATED: gateway-remix-root-v1-0 -->
