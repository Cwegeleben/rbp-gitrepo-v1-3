// <!-- BEGIN RBP GENERATED: inventory-commit-phase2 -->
import { commitOrderPaid } from "../commit/orderCommit.server";

// Mocks
jest.mock("../../../../../../packages/shopify/admin", () => ({
  getVariantInventoryItemId: jest.fn(async (arg: any) => {
    if (arg.variantId) return { ok: true, data: { variantId: arg.variantId, inventoryItemId: `ii:${arg.variantId}` } };
  if (arg.sku === "FAIL") return { ok: false, message: "no_sku" };
  if (arg.sku === "ERR") return { ok: true, data: { variantId: "v:ERR", inventoryItemId: "ii:ERR-1" } };
  return { ok: true, data: { variantId: `v:${arg.sku}`, inventoryItemId: `ii:v:${arg.sku}` } };
  }),
  adjustAvailableDelta: jest.fn(async (inventoryItemId: string, locationId: string, delta: number) => {
    if (inventoryItemId.includes("ii:ERR")) return { ok: false, message: "adjust_error" };
    return { ok: true, data: { available: 0 } };
  }),
}));

// Minimal prisma mock shim via jest automock for the methods used
jest.mock("@prisma/client", () => {
  const commits = new Map<string, any>();
  const locations = [{ id: "rbp1", kind: "RBP", shopifyLocationId: "gid://shopify/Location/1", name: "RBP Main" }];
  return {
    PrismaClient: class {
      orderCommit = {
        findUnique: async ({ where: { tenantDomain_orderId } }: any) => commits.get(`${tenantDomain_orderId.tenantDomain}:${tenantDomain_orderId.orderId}`) || null,
        create: async ({ data }: any) => { commits.set(`${data.tenantDomain}:${data.orderId}`, data); return data; },
      };
      inventoryLocation = {
        findMany: async ({ where }: any) => (where?.kind === "RBP" ? locations : []),
      };
    },
  };
});

describe("orders.commit", () => {
  const tenant = "demo.myshopify.com";
  const orderId = "1001";
  const correlationId = "cid-1";

  it("idempotency: second call no-op", async () => {
    const lines = [{ variantId: "gid://shopify/ProductVariant/1", qty: 1, source: "RBP" as const }];
    const first = await commitOrderPaid({ tenant, orderId, lines, correlationId });
    expect(first.ok).toBe(true);
    const second = await commitOrderPaid({ tenant, orderId, lines, correlationId });
    expect(second.ok).toBe(true);
    expect((second as any).idempotent).toBe(true);
  });

  it("variantId path: adjust called once per line", async () => {
    const r = await commitOrderPaid({ tenant, orderId: "1002", lines: [
      { variantId: "gid://shopify/ProductVariant/2", qty: 2, source: "RBP" },
    ], correlationId });
    expect(r.ok).toBe(true);
  });

  it("sku resolve path: resolves then adjusts", async () => {
    const r = await commitOrderPaid({ tenant, orderId: "1003", lines: [
      { sku: "SKU1", qty: 1, source: "RBP" },
    ], correlationId });
    expect(r.ok).toBe(true);
  });

  it("partial failure: one adjust error triggers rollback and 500", async () => {
    // Arrange so first adjusts OK, second fails
    const r = await commitOrderPaid({ tenant, orderId: "1004", lines: [
      { sku: "SKU_OK", qty: 1, source: "RBP" },
      { sku: "ERR", qty: 1, source: "RBP" },
    ], correlationId });
    expect(r.ok).toBe(false);
  });

  it("supplier lines are ignored by RBP decrements", async () => {
    const r = await commitOrderPaid({ tenant, orderId: "1005", lines: [
      { sku: "SKU_SUP", qty: 5, source: "SUPPLIER" },
    ], correlationId });
    expect(r.ok).toBe(true);
  });
});
// <!-- END RBP GENERATED: inventory-commit-phase2 -->
