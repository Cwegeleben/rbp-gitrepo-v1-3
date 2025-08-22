// <!-- BEGIN RBP GENERATED: mode-a -->
import { action } from "../routes/apps.proxy.api.inventory.sync";

// Mock tenant resolver to a fixed domain and enforce() to no-op
jest.mock("../proxy/verify.server", () => ({
  getTenantFromRequest: () => ({ tenant: "demo-tenant.myshopify.com" }),
  enforce: async () => null,
}));

// Spy on helper calls and return empty data by mutating syncDeps
const locationsMock = jest.fn(async () => []);
const levelsMock = jest.fn(async () => ({ levels: [], next: null }));
import * as SyncMod from "../../../../../packages/catalog/inventory/sync";

describe("inventory sync Mode A", () => {
  beforeAll(() => {
  process.env.RBP_PROXY_HMAC_BYPASS = "1";
    process.env.RBP_SHOP_DOMAIN = "rbp-test.myshopify.com";
  (SyncMod as any).syncDeps.fetchShopifyLocations = locationsMock;
  (SyncMod as any).syncDeps.fetchInventoryLevels = levelsMock;
  });

  it("defaults to RBP scope when no scope param is provided", async () => {
    const req = new Request("http://localhost/apps/proxy/api/inventory/sync", { method: "POST" });
    const res: any = await action({ request: req } as any);
    const body = JSON.parse(await res.text());
    expect(body.ok).toBe(true);
    expect(locationsMock).toHaveBeenCalledTimes(1);
    expect(locationsMock).toHaveBeenCalledWith("rbp-test.myshopify.com");
    expect(levelsMock).toHaveBeenCalled();
  });
});
// <!-- END RBP GENERATED: mode-a -->
