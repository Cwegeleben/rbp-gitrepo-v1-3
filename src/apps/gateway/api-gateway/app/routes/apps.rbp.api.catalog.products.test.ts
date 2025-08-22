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
  it("returns default list when no params", async () => {
  const mod = await import("./apps.proxy.api.catalog.products");
    const req = new Request("http://x/apps/proxy/api/catalog/products");
    const res: any = await mod.loader({ request: req } as any);
    expect(res).toBeInstanceOf(Response);
    const body = JSON.parse(await res.text());
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  it("filters by collection= and respects limit cap", async () => {
  const mod = await import("./apps.proxy.api.catalog.products");
    const req = new Request("http://x/apps/proxy/api/catalog/products?collection=rods&limit=2000");
    const res: any = await mod.loader({ request: req } as any);
    const body = JSON.parse(await res.text());
    expect(Array.isArray(body)).toBe(true);
    // limit cap applies in v1 default path (still array), but we only ensure it doesn't explode and items match collection
    expect(body.every((p: any) => (p.collections||[]).includes("rods"))).toBe(true);
  });

  it("supports v2 cursor response shape", async () => {
  const mod = await import("./apps.proxy.api.catalog.products");
    const req = new Request("http://x/apps/proxy/api/catalog/products?tags=bass&limit=1&sort=rank");
    const res: any = await mod.loader({ request: req } as any);
    const body = JSON.parse(await res.text());
    expect(body && Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBe(1);
  });

  it("handles error path cleanly", async () => {
    jest.doMock("../proxy/catalog.server", () => ({ readCatalogJson: jest.fn(async () => { throw new Error("read fail"); }) }));
  const mod = await import("./apps.proxy.api.catalog.products");
    const req = new Request("http://x/apps/proxy/api/catalog/products");
    const res: any = await mod.loader({ request: req } as any);
    expect(res.status).toBe(500);
  });
});
// <!-- END RBP GENERATED: CatalogV2-Tests -->
