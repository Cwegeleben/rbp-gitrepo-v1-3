// <!-- BEGIN RBP GENERATED: storefront-proxy-e2e-v1-0 -->
import { packageSelectionToCart } from "../packager";

describe("packageSelectionToCart", () => {
  it("sums lines and produces cart path", () => {
    const r = packageSelectionToCart([
      { sku: "A", price: 1000, qty: 1 },
      { sku: "B", price: 250, qty: 2 },
    ]);
    expect(r.ok).toBe(true);
    expect(r.totalCents).toBe(1000 * 1 + 250 * 2);
    expect(r.cartPath).toContain("/cart/");
    expect(r.lines.length).toBe(2);
  });
});
// <!-- END RBP GENERATED: storefront-proxy-e2e-v1-0 -->
