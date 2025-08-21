// <!-- BEGIN RBP GENERATED: mode-a -->
import { PrismaClient } from "@prisma/client";
import { smartChoiceV1 } from "../packages/builds/package/index";
import { seedInventoryFixtures, getResolvedLocations } from "../test/fixtures/inventory.fixtures";

describe("smartChoiceV1 Mode A", () => {
  const prisma = new PrismaClient() as any;
  beforeAll(async () => {
    await seedInventoryFixtures(prisma);
  });

  it("prefers tenant-virtual over RBP when virtual onHand is sufficient", async () => {
  const res = await smartChoiceV1([{ sku: "REELSEAT", qty: 2 }]);
  const locs = await getResolvedLocations(prisma);
  expect(res.plan[0].locationId).toBe(locs.tenantVirtual.id);
  });
});
// <!-- END RBP GENERATED: mode-a -->
