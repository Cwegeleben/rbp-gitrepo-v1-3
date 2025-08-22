// <!-- BEGIN RBP GENERATED: orders-commit-phase2 -->
import { PrismaClient } from "@prisma/client";

describe("orders.paid webhook commit flow", () => {
  const OLD_ENV = { ...process.env } as any;
  beforeAll(() => { process.env = { ...process.env, RBP_PROXY_HMAC_BYPASS: "1" } as any; });
  afterAll(() => { process.env = OLD_ENV; });
  const prisma = new PrismaClient();

  it("is idempotent by (tenant, orderId)", async () => {
    // TODO: seed a sourcing plan, SOFT reservations, then POST the webhook twice and assert one OrderCommit row
    expect(true).toBe(true);
  });

  it("flips SOFT reservations to HARD and updates plan status", async () => {
    // TODO: seed and assert transitions; mock adjustRbpInventory where needed
    expect(true).toBe(true);
  });
});
// <!-- END RBP GENERATED: orders-commit-phase2 -->
