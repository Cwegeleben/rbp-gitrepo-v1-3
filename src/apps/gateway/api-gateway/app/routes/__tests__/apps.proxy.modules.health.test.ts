// <!-- BEGIN RBP GENERATED: registry-health-v1 -->
import { loader } from "../apps.proxy.modules.health";

jest.mock("../../proxy/verify.server", () => ({ enforce: async () => null }));
jest.mock("../../lib/paths.server", () => ({ cfgDir: "/mock/cfg" }));
jest.mock("node:fs/promises", () => ({ readFile: jest.fn().mockResolvedValue(JSON.stringify({
  modules: {
    "rbp-shell": {
      version: "0.2.0",
      default: "0.2.0",
      path: "/apps/proxy/modules/rbp-shell/0.2.0/index.js",
      versions: {
        "0.2.0": { path: "/apps/proxy/modules/rbp-shell/0.2.0/index.js" }
      }
    }
  }
})) }));

// ensure fs stat in health util resolves as present
jest.mock("../../proxy/modules/health.server", () => {
  const actual = jest.requireActual("../../proxy/modules/health.server");
  return {
    ...actual,
    // make file existence fast/consistent by bypassing real stat
    checkRegistryHealth: async (reg: any, opts: any) => {
      const h = await actual.checkRegistryHealth(reg, { ...opts, fsCheck: false });
      // emulate that files would exist if fsCheck were true
      for (const mh of Object.values<any>(h.modules)) mh.fileExists = true;
      h.ok = true;
      h.errors = [];
      return h;
    }
  };
});

function req(url: string) {
  return { request: new Request(url) } as any;
}

describe("/apps/proxy/modules/health route", () => {
  it("returns minimal by default", async () => {
    const r = await loader(req("http://localhost/apps/proxy/modules/health"));
    const body: any = await (r as Response).json();
    expect(body.ok).toBe(true);
    expect(body.modules["rbp-shell"].versions).toBeUndefined();
    expect(Array.isArray(body.errors)).toBe(true);
  });

  it("returns full when ?full=1", async () => {
    const r = await loader(req("http://localhost/apps/proxy/modules/health?full=1"));
    const body: any = await (r as Response).json();
    expect(body.ok).toBe(true);
    expect(body.modules["rbp-shell"].versions).toBeDefined();
  });
});
// <!-- END RBP GENERATED: registry-health-v1 -->
