// <!-- BEGIN RBP GENERATED: builds-share-links-v1 -->
export function buildShareUrlFromToken(token: string, baseHref?: string): string {
  try { const u = new URL(baseHref || window.location.href); u.searchParams.set('share', token); return u.toString(); } catch { return `?share=${encodeURIComponent(token)}`; }
}
// <!-- END RBP GENERATED: builds-share-links-v1 -->
