import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { verifyProxyRequest } from "../verify.server";

describe("verifyProxyRequest", () => {
  const OLD = { ...process.env } as any;
  beforeAll(() => {
    process.env = { ...process.env, SHOPIFY_API_SECRET: "shhh" } as any;
  });
  afterAll(() => {
    process.env = OLD as any;
  });

  it("fails when missing signature", () => {
    const r = new Request("http://x/apps/proxy/ping");
    const v = verifyProxyRequest(r);
    expect(v.ok).toBe(false);
  });

  it("verifies correct signature for path+query", () => {
    const now = Math.floor(Date.now() / 1000);
    const base = `/apps/proxy/ping?shop=demo.myshopify.com&ts=${now}`;
    const crypto = require("node:crypto");
    const sig = crypto.createHmac("sha256", "shhh").update(base).digest("hex");
    const r = new Request(`http://x${base}&signature=${sig}`);
    const v = verifyProxyRequest(r);
    expect(v.ok).toBe(true);
  });

  it("rejects when signature mismatches", () => {
    const r = new Request("http://x/apps/proxy/ping?signature=deadbeef");
    const v = verifyProxyRequest(r);
    expect(v.ok).toBe(false);
    expect(v.reason).toBe("bad_signature");
  });

  it("enforces timestamp skew when configured", () => {
    process.env.RBP_PROXY_HMAC_REQUIRE_TS = "1";
    process.env.RBP_PROXY_HMAC_MAX_SKEW_SECONDS = "1";
    const base = "/apps/proxy/ping?shop=demo.myshopify.com&ts=1"; // ts way in the past
    const crypto = require("node:crypto");
    const sig = crypto.createHmac("sha256", "shhh").update(base).digest("hex");
    const r = new Request(`http://x${base}&signature=${sig}`);
    const v = verifyProxyRequest(r);
    expect(v.ok).toBe(false);
    expect(v.reason).toBe("ts_skew");
    delete process.env.RBP_PROXY_HMAC_REQUIRE_TS;
    delete process.env.RBP_PROXY_HMAC_MAX_SKEW_SECONDS;
  });
});
