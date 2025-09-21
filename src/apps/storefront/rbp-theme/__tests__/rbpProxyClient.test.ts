// <!-- BEGIN RBP GENERATED: storefront-cart-e2e-v1-1 -->
import { RbpProxyClient } from "../lib/rbpProxyClient";

describe("RbpProxyClient.tryProxyOrMock", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn();
  });

  it("falls back to mock on 401", async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({ ok: false, status: 401 });
    const c = new RbpProxyClient("");
    const parts = await c.getCatalogParts();
    expect(Array.isArray(parts)).toBe(true);
    expect(c.state.proxyBlocked).toBe(true);
    expect(c.state.usingMock).toBe(true);
  });

  it("returns proxy data when ok", async () => {
    const data = { parts: [{ id: "x", sku: "S", title: "T", price: 1, group: "Blanks" }] };
    // @ts-ignore
    global.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => data });
    const c = new RbpProxyClient("");
    const parts = await c.getCatalogParts();
    expect(parts.length).toBe(1);
    expect(c.state.proxyBlocked).toBe(false);
  });

  it("getVariantsBySku falls back to mock on 401", async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({ ok: false, status: 401 });
    const c = new RbpProxyClient("");
    const m = await c.getVariantsBySku();
    expect(typeof m).toBe("object");
    expect(m["BL-100"]).toBe(111000001);
    expect(c.state.usingMock).toBe(true);
  });
});
// <!-- END RBP GENERATED: storefront-cart-e2e-v1-1 -->
