// <!-- BEGIN RBP GENERATED: accessv2-tests-v1 -->
import { describe, it, expect, beforeEach, jest } from "@jest/globals";

jest.mock("../access.server", () => ({
  getAccessForUser: jest.fn(async (_tenant: string, userId: string | null) => {
    const base: Record<string, boolean> = { "catalog:view": true, "checkout:package": false };
    const roles: string[] = userId === "admin" ? ["RBP_ADMIN"] : [];
    if (userId === "packer") base["checkout:package"] = true;
    return { roles, features: base };
  }),
}));

jest.mock("../verify.server", () => ({ getTenantFromRequest: (_req: Request) => ({ tenant: "demo.myshopify.com", verified: true }) }));

import { requireAccess } from "../requireAccess.server";

const makeReq = (url: string, headers?: Record<string, string>) => new Request(url, { headers: headers ? new Headers(headers) : undefined });

describe("requireAccess", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("allows when role RBP_ADMIN is present (happy)", async () => {
    const denied = await requireAccess(makeReq("http://x/apps/proxy/foo?userId=admin"), "checkout:package");
    expect(denied).toBeNull();
  });

  it("allows when feature key is enabled for user (happy)", async () => {
    const denied = await requireAccess(makeReq("http://x/apps/proxy/foo?userId=packer"), "checkout:package");
    expect(denied).toBeNull();
  });

  it("denies with 403 when feature disabled and no admin role (edge)", async () => {
    const denied = await requireAccess(makeReq("http://x/apps/proxy/foo?userId=guest"), "checkout:package");
    expect(denied).toBeInstanceOf(Response);
    const res = denied as Response;
    expect(res.status).toBe(403);
    const body = JSON.parse(await res.text());
    expect(body).toMatchObject({ error: "forbidden", feature: "checkout:package" });
  });
});
// <!-- END RBP GENERATED: accessv2-tests-v1 -->
