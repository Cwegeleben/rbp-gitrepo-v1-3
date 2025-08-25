// <!-- BEGIN RBP GENERATED: registry-health-v1 -->
import { checkRegistryHealth } from "../../modules/health.server";

jest.mock("../../../lib/paths.server", () => ({ modulesDir: "/mock/modules" }));
import fs from "node:fs/promises";
jest.mock("node:fs/promises", () => ({ stat: jest.fn() }));

const stat = fs.stat as unknown as jest.Mock;

describe("checkRegistryHealth", () => {
  const origin = "http://localhost:3000";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("flags healthy rbp-shell@0.2.0", async () => {
    stat.mockResolvedValue({ isFile: () => true });
    const registry = {
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
    };
    const health = await checkRegistryHealth(registry, { fsCheck: true, origin });
    expect(health.ok).toBe(true);
    expect(health.errors).toHaveLength(0);
    expect(health.modules["rbp-shell"].ok).toBe(true);
    expect(health.modules["rbp-shell"].pathPrefixOk).toBe(true);
    expect(health.modules["rbp-shell"].sameOriginOk).toBe(true);
    expect(health.modules["rbp-shell"].fileExists).toBe(true);
  });

  it("flags WRONG_PREFIX when path does not start with /apps/proxy/", async () => {
    stat.mockResolvedValue({ isFile: () => true });
    const registry = {
      modules: {
        bad: {
          version: "1.0.0",
          path: "/bad/modules/bad/1.0.0/index.js"
        }
      }
    };
    const health = await checkRegistryHealth(registry, { fsCheck: true, origin });
    expect(health.ok).toBe(false);
    expect(health.errors.find(e => e.code === "WRONG_PREFIX")).toBeTruthy();
    expect(health.modules.bad.pathPrefixOk).toBe(false);
  });

  it("flags CROSS_ORIGIN for absolute external URL", async () => {
    stat.mockResolvedValue({ isFile: () => true });
    const registry = {
      modules: {
        ext: {
          version: "1.0.0",
          path: "https://cdn.example.com/modules/ext/1.0.0/index.js"
        }
      }
    };
    const health = await checkRegistryHealth(registry, { fsCheck: true, origin });
    expect(health.ok).toBe(false);
    expect(health.errors.find(e => e.code === "CROSS_ORIGIN")).toBeTruthy();
    expect(health.modules.ext.sameOriginOk).toBe(false);
  });

  it("flags MISSING_FILE when fsCheck true and file missing", async () => {
    stat.mockRejectedValue(new Error("not found"));
    const registry = {
      modules: {
        missing: {
          version: "0.0.1",
          path: "/apps/proxy/modules/missing/0.0.1/index.js"
        }
      }
    };
    const health = await checkRegistryHealth(registry, { fsCheck: true, origin });
    expect(health.ok).toBe(false);
    const err = health.errors.find(e => e.code === "MISSING_FILE");
    expect(err).toBeTruthy();
    expect(health.modules.missing.fileExists).toBe(false);
  });
});
// <!-- END RBP GENERATED: registry-health-v1 -->
