// <!-- BEGIN RBP GENERATED: storefront-cart-e2e-v1-1 -->
import { buildCartPermalink } from "../packager";

describe("buildCartPermalink", () => {
  it("returns /cart/<id:qty,id:qty>", () => {
    const url = buildCartPermalink([
      { variantId: 111, qty: 2 },
      { variantId: 222, qty: 1 },
    ]);
    expect(url).toBe("/cart/111:2,222:1");
  });
});
// <!-- END RBP GENERATED: storefront-cart-e2e-v1-1 -->
