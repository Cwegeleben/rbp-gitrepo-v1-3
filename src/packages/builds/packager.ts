// <!-- BEGIN RBP GENERATED: storefront-cart-e2e-v1-1 -->
export type BuildSelection = Array<{ sku: string; price: number; qty?: number }>;

export type BundleResult = {
  ok: boolean;
  totalCents: number;
  totalQty: number;
  lines: Array<{ sku: string; qty: number; price: number }>;
  cartPath?: string;
};

export function packageSelectionToCart(selection: BuildSelection, opts?: { cartPathBase?: string; qty?: number }): BundleResult {
  const qty = Math.max(1, Number(opts?.qty ?? 1));
  const lines = selection.map((s) => ({ sku: s.sku, qty: Math.max(1, Number(s.qty ?? 1)) * qty, price: s.price }));
  const totalCents = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const totalQty = lines.reduce((sum, l) => sum + l.qty, 0);
  const cartPathBase = opts?.cartPathBase || "/cart";
  // Theme cart path respecting Shopify format: /cart/sku1:1,sku2:2
  const qp = lines.map((l) => `${encodeURIComponent(l.sku)}:${l.qty}`).join(",");
  const cartPath = `${cartPathBase}/${qp}`;
  return { ok: true, totalCents, totalQty, lines, cartPath };
}

export function buildCartPermalink(lines: Array<{ variantId: number; qty: number }>, opts?: { cartPathBase?: string }): string {
  const base = opts?.cartPathBase || "/cart";
  const qp = lines.map(l => `${l.variantId}:${Math.max(1, Number(l.qty || 1))}`).join(",");
  return `${base}/${qp}`;
}
// <!-- END RBP GENERATED: storefront-cart-e2e-v1-1 -->
