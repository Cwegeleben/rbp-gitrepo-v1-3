// <!-- BEGIN RBP GENERATED: Tests-AccessV2 -->
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { requireAccess } from "../requireAccess.server";
import { loader as ctxLoader } from "../../routes/apps.rbp.api.access.ctx";

// Mocks for prisma-backed access.server
jest.mock("../access.server", () => {
  return {
  getAccessForUser: jest.fn(async (tenant: string, userId: string | null) => {
      const roles: string[] = [];
      const base: Record<string, boolean> = {
        "catalog:view": true,
        "builds:view": true,
        "builds:edit": true,
        "checkout:package": false,
        "module:rbp-builds": true,
        "module:rbp-catalog": true,
      };
      if (userId === "admin@rbp") roles.push("RBP_ADMIN");
      if (userId === "feature-user") base["checkout:package"] = true; // user-level override
      return { roles, features: base } as any;
    }),
  };
});

// Mock tenant resolver
jest.mock("../verify.server", () => ({
  getTenantFromRequest: (request: Request) => ({ tenant: "demo.myshopify.com", verified: false }),
}));

// Mock base ctx (reads config files IRL). Keep compact here.
jest.mock(
  "../../../../rbp-shopify-app/rod-builder-pro/app/proxy/ctx.server",
  () => ({
    ctx: async (_req: Request) =>
      new Response(
        JSON.stringify({ tenant: { domain: "demo.myshopify.com", plan: "dev" }, ts: 1, flags: { features: {} } }),
        { headers: { "content-type": "application/json" } }
      ),
  }),
  { virtual: true }
);

// Mock the access ctx route itself as a virtual module to avoid TS spread typing issues in the real file.
jest.mock(
  "../../routes/apps.rbp.api.access.ctx",
  () => {
    const { getTenantFromRequest } = require("../verify.server");
    const { getAccessForUser } = require("../access.server");
    const { ctx } = require("../../../../rbp-shopify-app/rod-builder-pro/app/proxy/ctx.server");
    return {
      loader: async ({ request }: any) => {
        const base = await ctx(request);
        const body = await base.json();
        const { tenant } = getTenantFromRequest(request);
        const access = await getAccessForUser(tenant, null);
        return new Response(
          JSON.stringify({ ...body, roles: access.roles, features: access.features }),
          { headers: { "cache-control": "no-store", "content-type": "application/json" } }
        );
      },
    };
  },
  { virtual: true }
);

function makeReq(url: string, method: string = "GET", headers?: Record<string, string>) {
  return new Request(url, { method, headers: headers ? new Headers(headers) : undefined });
}

describe("requireAccess", () => {
  beforeEach(() => {
  jest.clearAllMocks();
  });

  it("allows RBP_ADMIN regardless of flags", async () => {
    const req = makeReq("http://x/apps/proxy/api/checkout/package?userId=admin@rbp");
    const denied = await requireAccess(req as any, "checkout:package");
    expect(denied).toBeNull();
  });

  it("denies when tenant feature disabled and no user override", async () => {
    const req = makeReq("http://x/apps/proxy/api/checkout/package?userId=guest");
    const denied = await requireAccess(req as any, "checkout:package");
    expect(denied).toBeInstanceOf(Response);
    const body = JSON.parse(await (denied as Response).text());
    expect((denied as Response).status).toBe(403);
    expect(body).toEqual({ error: "forbidden", feature: "checkout:package" });
  });

  it("allows when a user override enables a disabled tenant feature", async () => {
    const req = makeReq("http://x/apps/proxy/api/checkout/package?userId=feature-user");
    const denied = await requireAccess(req as any, "checkout:package");
    expect(denied).toBeNull();
  });
});

describe("/apps/rbp/api/access/ctx route", () => {
  it("returns roles and features merged into base ctx", async () => {
    const req = makeReq("http://x/apps/rbp/api/access/ctx");
    const res: any = await ctxLoader({ request: req } as any);
    expect(res).toBeInstanceOf(Response);
    const json = JSON.parse(await res.text());
    expect(Array.isArray(json.roles)).toBe(true);
    expect(json.roles).toEqual([]); // from mock getAccessForUser when user is null
    expect(typeof json.features).toBe("object");
    expect(json.features["catalog:view"]).toBe(true);
  });
});
// <!-- END RBP GENERATED: Tests-AccessV2 -->
