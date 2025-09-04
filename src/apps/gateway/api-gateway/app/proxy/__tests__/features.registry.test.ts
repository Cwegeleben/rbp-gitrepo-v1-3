// <!-- BEGIN RBP GENERATED: accessv2-tests-v1 -->
import { describe, it, expect } from "@jest/globals";
import { FEATURE_KEYS } from "../features.registry";

describe("features.registry", () => {
  it("contains known feature keys (happy)", () => {
    expect(FEATURE_KEYS).toEqual(expect.arrayContaining(["catalog:view", "builds:view", "module:rbp-builds"]));
  });

  it("does not include unknown keys (edge)", () => {
    expect(FEATURE_KEYS.includes("unknown:feature" as any)).toBe(false);
  });
});
// <!-- END RBP GENERATED: accessv2-tests-v1 -->
