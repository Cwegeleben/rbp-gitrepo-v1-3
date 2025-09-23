// <!-- BEGIN RBP GENERATED: live-proxy-default-v1 -->
import { isCatalogPayload, isModulesPayload, isVariantsBySkuPayload, type Part } from "../utils/shapeGuards";

export type DataSource = "proxy" | "mock";
export type DataSourceInfo = { source: DataSource; reason?: string };

function withTimeout(signal: AbortSignal | undefined, ms: number): AbortSignal {
  const ctrl = new AbortController();
  const abortErr = (() => {
    try {
      // @ts-ignore
      return new DOMException("Timeout", "AbortError");
    } catch {
      const e: any = new Error("Timeout");
      e.name = "AbortError";
      return e;
    }
  })();
  const timer = setTimeout(() => ctrl.abort(abortErr), ms);
  const onAbort = () => {
    clearTimeout(timer);
  };
  ctrl.signal.addEventListener("abort", onAbort, { once: true });
  if (signal) {
    signal.addEventListener("abort", () => ctrl.abort(signal.reason), { once: true });
  }
  return ctrl.signal;
}

export class ProxyClient {
  constructor(private base = "") {}

  async probeCatalog(options?: { timeoutMs?: number; signal?: AbortSignal }): Promise<DataSourceInfo> {
    const timeoutMs = options?.timeoutMs ?? 1200;
    const signal = withTimeout(options?.signal, timeoutMs);
    try {
      const res = await fetch(this.base + "/apps/proxy/rbp/catalog", {
        method: "GET",
        headers: { Accept: "application/json" },
        signal,
      });
      if (!res.ok) return { source: "mock", reason: `http-${res.status}` };
      const json = await res.json().catch(() => ({}));
      if (!isCatalogPayload(json)) return { source: "mock", reason: "invalid-shape" };
      return { source: "proxy" };
    } catch (err) {
      const reason = (err as Error)?.name === "AbortError" ? "timeout" : "network";
      return { source: "mock", reason };
    }
  }

  async getCatalog(signal?: AbortSignal): Promise<Part[]> {
    const res = await fetch(this.base + "/apps/proxy/rbp/catalog", { headers: { Accept: "application/json" }, signal });
    if (!res.ok) throw new Error(`http-${res.status}`);
    const json = await res.json();
    if (isCatalogPayload(json)) return json.parts;
    if (Array.isArray(json) && json.every((p) => typeof p?.sku === "string")) return json as Part[]; // lenient
    throw new Error("invalid-shape");
  }

  async getModules(signal?: AbortSignal): Promise<{ key: string; enabled: boolean; label?: string }[]> {
    const res = await fetch(this.base + "/apps/proxy/rbp/modules", { headers: { Accept: "application/json" }, signal });
    if (!res.ok) throw new Error(`http-${res.status}`);
    const json = await res.json();
    if (isModulesPayload(json)) return json.modules;
    if (Array.isArray(json)) return json as any; // lenient
    throw new Error("invalid-shape");
  }

  async getVariantsBySku(signal?: AbortSignal): Promise<Record<string, number>> {
    const res = await fetch(this.base + "/apps/proxy/rbp/variantsBySku", { headers: { Accept: "application/json" }, signal });
    if (!res.ok) throw new Error(`http-${res.status}`);
    const json = await res.json();
    if (isVariantsBySkuPayload(json)) return json.map;
    if (json && typeof json === "object") return (json as any).map ?? (json as any);
    throw new Error("invalid-shape");
  }
}
// <!-- END RBP GENERATED: live-proxy-default-v1 -->
