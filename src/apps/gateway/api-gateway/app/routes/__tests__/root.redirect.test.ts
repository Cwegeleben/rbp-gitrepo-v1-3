// <!-- BEGIN RBP GENERATED: root-redirect-preflight-v1 -->
import { describe, it, expect } from "@jest/globals";

describe("root redirects to /app", () => {
  it("GET / returns 302 Location: /app", async () => {
    const mod = await import("../_index");
    const res: Response = await (mod as any).loader({} as any);
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("/app");
  });
});
// <!-- END RBP GENERATED: root-redirect-preflight-v1 -->
