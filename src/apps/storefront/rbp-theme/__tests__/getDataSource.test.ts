// <!-- BEGIN RBP GENERATED: live-proxy-default-v1 -->
import { getDataSource } from "../data/source";

describe("getDataSource", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns proxy on 200 + valid shape", async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ parts: [] }) });
    const info = await getDataSource({ timeoutMs: 200 });
    expect(info.source).toBe("proxy");
  });

  it("returns mock on invalid shape", async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ nope: true }) });
    const info = await getDataSource({ timeoutMs: 200 });
    expect(info.source).toBe("mock");
    expect(info.reason).toBe("invalid-shape");
  });

  it("returns mock on timeout", async () => {
    // Simulate fetch that rejects when aborted by signal
    // @ts-ignore
    global.fetch.mockImplementation((_, init) => new Promise((_, reject) => {
      const sig = (init && (init as any).signal) as AbortSignal | undefined;
      if (sig) {
        sig.addEventListener("abort", () => {
          const e: any = new Error("Timeout");
          e.name = "AbortError";
          reject(e);
        });
      }
    }));
    const p = getDataSource({ timeoutMs: 5 });
    jest.advanceTimersByTime(10);
    const info = await p;
    expect(info.source).toBe("mock");
    expect(info.reason).toBe("timeout");
  });
});
// <!-- END RBP GENERATED: live-proxy-default-v1 -->
