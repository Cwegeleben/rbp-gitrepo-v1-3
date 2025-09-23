// <!-- BEGIN RBP GENERATED: admin-embed-fix-v1 -->
import { withEmbedHeaders } from "../../utils/embedHeaders";

describe("withEmbedHeaders", () => {
  it("injects CSP frame-ancestors, removes X-Frame-Options, sets no-store", () => {
    const base = new Response("ok", {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "X-Frame-Options": "DENY",
        "cache-control": "public, max-age=3600",
      },
    });
    const res = withEmbedHeaders(base);
    const h = res.headers;
    expect(h.get("X-Frame-Options")).toBeNull();
    expect(h.get("Cache-Control")).toBe("no-store");
    const csp = h.get("Content-Security-Policy");
    expect(csp).toBeTruthy();
    expect(csp).toContain("frame-ancestors https://admin.shopify.com https://*.myshopify.com");
  });
});
// <!-- END RBP GENERATED: admin-embed-fix-v1 -->
