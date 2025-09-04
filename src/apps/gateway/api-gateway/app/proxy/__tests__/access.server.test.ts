// <!-- BEGIN RBP GENERATED: accessv2-tests-v1 -->
import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";

// Mock Prisma at import time so the SUT binds to our fake client
type Row = Record<string, any>;
let userRoleRows: Row[] = [];
let tenantFeatureRows: Row[] = [];
let userFeatureRows: Row[] = [];

jest.mock("@prisma/client", () => {
  class PrismaClient {
    userRole = { findMany: async ({ where }: any) => userRoleRows.filter(r => r.tenantId === where.tenantId && r.userId === where.userId) };
    tenantFeatureAllow = { findMany: async ({ where }: any) => tenantFeatureRows.filter(r => r.tenantId === where.tenantId) };
    userFeatureAllow = { findMany: async ({ where }: any) => userFeatureRows.filter(r => r.tenantId === where.tenantId && r.userId === where.userId) };
  }
  return { PrismaClient };
});

import { getAccessForUser } from "../access.server";

describe("access.server:getAccessForUser", () => {
  beforeEach(() => {
    userRoleRows = [];
    tenantFeatureRows = [];
    userFeatureRows = [];
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("derives roles and tenant features; applies user overrides (happy path)", async () => {
    tenantFeatureRows = [
      { tenantId: "t1", featureKey: "catalog:view", enabled: true },
      { tenantId: "t1", featureKey: "checkout:package", enabled: false },
    ];
    userRoleRows = [
      { tenantId: "t1", userId: "u1", role: "RBP_EDITOR" },
    ];
    userFeatureRows = [
      { tenantId: "t1", userId: "u1", featureKey: "checkout:package", enabled: true },
    ];

    const out = await getAccessForUser("t1", "u1");
    expect(out.roles).toEqual(["RBP_EDITOR"]);
    expect(out.features["catalog:view"]).toBe(true);
    // user override flips disabled tenant feature
    expect(out.features["checkout:package"]).toBe(true);
  });

  it("returns empty roles and tenant-only features when userId is null (edge)", async () => {
    tenantFeatureRows = [
      { tenantId: "t2", featureKey: "builds:view", enabled: true },
    ];
    const out = await getAccessForUser("t2", null);
    expect(out.roles).toEqual([]);
    expect(out.features["builds:view"]).toBe(true);
    // No override path should be consulted when userId is null
    expect(out.features["nonexistent"]).toBeUndefined();
  });
});
// <!-- END RBP GENERATED: accessv2-tests-v1 -->
