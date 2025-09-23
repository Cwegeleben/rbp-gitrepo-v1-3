// <!-- BEGIN RBP GENERATED: admin-embed-fix-v1 -->
export function withEmbedHeaders(res: Response) {
  const h = new Headers(res.headers);
  // Strip any X-Frame-Options that could block embedding
  h.delete("X-Frame-Options");
  // Enforce Shopify Admin embedding policy
  h.set(
    "Content-Security-Policy",
    "frame-ancestors https://admin.shopify.com https://*.myshopify.com"
  );
  // Avoid caching tiny gateway HTML responses
  h.set("Cache-Control", "no-store");
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}
// <!-- END RBP GENERATED: admin-embed-fix-v1 -->
