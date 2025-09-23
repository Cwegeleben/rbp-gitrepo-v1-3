// <!-- BEGIN RBP GENERATED: admin-embed-relocation-v1 -->
export function withEmbedHeaders(res: Response) {
  const h = new Headers(res.headers);
  // Remove any X-Frame-Options that could block embedding in Shopify Admin
  h.delete("X-Frame-Options");
  // Allow Shopify Admin & Online Store to frame the app
  h.set("Content-Security-Policy", "frame-ancestors https://admin.shopify.com https://*.myshopify.com");
  // Avoid caching these small gateway HTML responses
  h.set("Cache-Control", "no-store");
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}
// <!-- END RBP GENERATED: admin-embed-relocation-v1 -->
