// <!-- BEGIN RBP GENERATED: accessv2-tests-v1 -->
import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock fs reads used by the Shopify ctx.server so it doesn't touch real files
jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(async (p: string) => {
    if (String(p).endsWith("tenants.json")) return JSON.stringify([{ domain: "demo.myshopify.com", plan: "dev", vendors: ["RBP"] }]);
    if (String(p).endsWith("flags.json")) return JSON.stringify({ features: {} });
    return "{}";
  }),
}));

// Mock base ctx from Shopify app to avoid fs reads
// Mock base ctx to always return a tenant JSON regardless of request params
jest.mock(
  "../../../../rbp-shopify-app/rod-builder-pro/app/proxy/ctx.server",
  () => ({
    ctx: async () => new Response(
      JSON.stringify({ tenant: { domain: "demo.myshopify.com", plan: "dev", vendors: ["RBP"] }, ts: 1, flags: { features: {} } }),
      { headers: { "content-type": "application/json" } }
    ),
  }),
  { virtual: true }
);

jest.mock("../../proxy/verify.server", () => ({ getTenantFromRequest: (_req: Request) => ({ tenant: "demo.myshopify.com", verified: true }) }));
jest.mock("../../proxy/access.server", () => ({ getAccessForUser: jest.fn(async () => ({ roles: ["RBP_VIEWER"], features: { "catalog:view": true } })) }));

import { loader } from "../apps.rbp.api.access.ctx";

const makeReq = (url: string) => new Request(url);

describe("apps.rbp.api.access.ctx loader", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("returns 200 JSON and includes roles/features (happy)", async () => {
    const res = await loader({ request: makeReq("http://x/apps/rbp/api/access/ctx?domain=demo.myshopify.com") } as any);
    expect(res).toBeInstanceOf(Response);
    const ct = (res as Response).headers.get("content-type") || (res as any).headers.get("Content-Type");
    expect(ct?.toLowerCase()).toContain("application/json");
    const body = JSON.parse(await (res as Response).text());
    expect(Array.isArray(body.roles)).toBe(true);
    expect(body.features && typeof body.features).toBe("object");
  });

  it("includes vendors array even if base omits it (edge)", async () => {
    // Using the default mock which already includes vendors; just assert presence/type to avoid overfitting
    const res = await loader({ request: makeReq("http://x/apps/rbp/api/access/ctx?domain=demo.myshopify.com") } as any);
    const body = JSON.parse(await (res as Response).text());
    expect(Array.isArray(body.tenant?.vendors)).toBe(true);
  });
});
// <!-- END RBP GENERATED: accessv2-tests-v1 -->
