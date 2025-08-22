// <!-- BEGIN RBP GENERATED: CatalogV2-Tests -->
import { describe, it, expect, jest } from "@jest/globals";

// Mock catalog and ranking helpers to avoid file I/O
jest.mock("../proxy/catalog.server", () => ({
  readCatalogJson: jest.fn(async () => ({
    products: [
      { id: "1", title: "Alpha", handle: "alpha", vendor: "RBP", price: 99, collections: ["rods"], tags: ["bass"] },
      { id: "2", title: "Bravo", handle: "bravo", vendor: "Acme", price: 150, collections: ["reels"], tags: ["trout"] },
      { id: "3", title: "Charlie", handle: "charlie", vendor: "RBP", price: 300, collections: ["rods"], tags: ["bass","topwater"] },
    ],
  })),
}));
jest.mock("../proxy/ranking.server", () => ({
  loadRankingConfig: jest.fn(async () => ({ weights: {} })),
  scoreProduct: jest.fn(() => 1),
}));

describe("catalog products route", () => {
  const OLD_ENV = { ...process.env } as any;
  beforeAll(() => {
    process.env = { ...process.env, RBP_PROXY_HMAC_BYPASS: "1" } as any;
  });
  afterAll(() => { process.env = OLD_ENV; });
  it("returns default list when no params", async () => {
    const mod = await import("../apps.proxy.api.catalog.products");
    const req = new Request("http://x/apps/proxy/api/catalog/products");
    const res: any = await mod.loader({ request: req } as any);
    expect(res).toBeInstanceOf(Response);
    const body = JSON.parse(await res.text());
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  it("filters by collection= (v2 shape in gateway)", async () => {
    const mod = await import("../apps.proxy.api.catalog.products");
    const req = new Request("http://x/apps/proxy/api/catalog/products?collection=rods");
    const res: any = await mod.loader({ request: req } as any);
    const body = JSON.parse(await res.text());
    expect(body && Array.isArray(body.items)).toBe(true);
    // items should match collection
    expect(body.items.every((p: any) => (p.collections||[]).includes("rods"))).toBe(true);
  });

  it("caps limit to 100 in v2", async () => {
    const mod = await import("../apps.proxy.api.catalog.products");
    const req = new Request("http://x/apps/proxy/api/catalog/products?tags=bass&limit=2000");
    const res: any = await mod.loader({ request: req } as any);
    const body = JSON.parse(await res.text());
    expect(body && Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeLessThanOrEqual(100);
  });

  it("supports v2 cursor response shape", async () => {
    const mod = await import("../apps.proxy.api.catalog.products");
    const req = new Request("http://x/apps/proxy/api/catalog/products?tags=bass&limit=1&sort=rank");
    const res: any = await mod.loader({ request: req } as any);
    const body = JSON.parse(await res.text());
    expect(body && Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBe(1);
  });

  it("handles error path cleanly", async () => {
    jest.resetModules();
    jest.doMock("../proxy/catalog.server", () => ({ readCatalogJson: jest.fn(async () => { throw new Error("read fail"); }) }));
    let res: any;
    await jest.isolateModulesAsync(async () => {
      const mod = await import("../apps.proxy.api.catalog.products");
      const req = new Request("http://x/apps/proxy/api/catalog/products");
      res = await mod.loader({ request: req } as any);
    });
    expect(res.status).toBe(500);
  });
});
// <!-- END RBP GENERATED: CatalogV2-Tests -->
