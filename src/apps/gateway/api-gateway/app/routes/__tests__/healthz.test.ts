// <!-- BEGIN RBP GENERATED: healthz-v2 -->
import { describe, it, expect } from "@jest/globals";

describe("GET /healthz", () => {
  it("returns 200 { ok: true } and no-store", async () => {
    const mod = await import("../healthz");
    const res: Response = await (mod as any).loader({} as any);
    expect(res.status).toBe(200);
    const ct = res.headers.get("cache-control") || res.headers.get("Cache-Control");
    expect(ct).toBe("no-store");
    const body = await res.json();
    expect(body).toEqual({ ok: true });
  });
});
// <!-- END RBP GENERATED: healthz-v2 -->
