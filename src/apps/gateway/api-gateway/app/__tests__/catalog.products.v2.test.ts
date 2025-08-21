/**
 * Tests for Catalog v2 behavior on products endpoint
 */
// <!-- BEGIN RBP GENERATED: CatalogV2 -->
import { loader } from "../../../../rbp-shopify-app/rod-builder-pro/app/routes/apps.proxy.api.catalog.products";

function makeArgs(url: string) { return { request: new Request(url) } as any; }
async function jsonOf(r: any) { const txt = await r.text(); try { return JSON.parse(txt); } catch { throw new Error("Invalid JSON: "+txt); } }

describe("Catalog v2", () => {
  it("returns v1 array when no params provided", async () => {
  const res: any = await loader(makeArgs("http://localhost/apps/proxy/api/catalog/products"));
    const body = await jsonOf(res);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  it("filters by vendor CSV, case-insensitive", async () => {
  const res: any = await loader(makeArgs("http://localhost/apps/proxy/api/catalog/products?vendor=prolite,RBP&limit=50"));
    const body = await jsonOf(res);
    expect(Array.isArray(body.items)).toBe(true);
  const vendors = new Set(body.items.map((p: any) => String(p.vendor).toLowerCase()));
  const vArr: string[] = Array.from(vendors).map((x:any)=>String(x));
  expect(vArr.every((v) => ["prolite","rbp"].includes(v))).toBe(true);
    expect(body.applied.vendor).toEqual(["prolite","rbp"]);
  });

  it("filters by tags CSV, case-insensitive (any match)", async () => {
  const res: any = await loader(makeArgs("http://localhost/apps/proxy/api/catalog/products?tags=GRAPHITE,featured&limit=50"));
    const body = await jsonOf(res);
    const ok = body.items.every((p: any) => (p.tags||[]).map((t:string)=>t.toLowerCase()).some((t:string)=>["graphite","featured"].includes(t)));
    expect(ok).toBe(true);
    expect(new Set(body.applied.tags)).toEqual(new Set(["graphite","featured"]));
  });

  it("priceBand filters into 3 bands", async () => {
    for (const band of ["LT100","100to250","GT250"]) {
  const res: any = await loader(makeArgs(`http://localhost/apps/proxy/api/catalog/products?priceBand=${band}&limit=50`));
      const body = await jsonOf(res);
      if (band === "LT100") expect(body.items.every((p:any)=>p.price < 100)).toBe(true);
      if (band === "100to250") expect(body.items.every((p:any)=>p.price>=100 && p.price<=250)).toBe(true);
      if (band === "GT250") expect(body.items.every((p:any)=>p.price > 250)).toBe(true);
    }
  });

  it("supports forward cursor pagination and stable nextCursor", async () => {
  const first: any = await loader(makeArgs("http://localhost/apps/proxy/api/catalog/products?tags=graphite&limit=1"));
    const body1 = await jsonOf(first);
    expect(typeof body1.nextCursor === "string" || body1.nextCursor === null).toBe(true);
    if (body1.nextCursor) {
  const second: any = await loader(makeArgs(`http://localhost/apps/proxy/api/catalog/products?tags=graphite&limit=1&cursor=${encodeURIComponent(body1.nextCursor)}`));
      const body2 = await jsonOf(second);
      expect(body2.items[0]?.id).not.toBe(body1.items[0]?.id);
    }
  });

  it("supports sort modes including default rank", async () => {
  const resRank: any = await loader(makeArgs("http://localhost/apps/proxy/api/catalog/products?tags=graphite,featured&limit=50"));
  const resPriceAsc: any = await loader(makeArgs("http://localhost/apps/proxy/api/catalog/products?tags=graphite,featured&limit=50&sort=priceAsc"));
    const a = await jsonOf(resRank);
    const b = await jsonOf(resPriceAsc);
    // Rank returns items array
    expect(Array.isArray(a.items)).toBe(true);
    // Price asc should be non-decreasing
    const pricesB = b.items.map((p:any)=>p.price);
    expect(pricesB.slice().every((v:number,i:number,arr:number[])=> i===0 || arr[i-1] <= v)).toBe(true);
  });

  it("falls back when catalog_ranking.json missing", async () => {
  const res: any = await loader(makeArgs("http://localhost/apps/proxy/api/catalog/products?tags=graphite&limit=5&sort=rank"));
    const body = await jsonOf(res);
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.applied.sort).toBe("rank");
  });
});
// <!-- END RBP GENERATED: CatalogV2 -->
