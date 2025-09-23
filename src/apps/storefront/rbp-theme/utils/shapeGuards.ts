// <!-- BEGIN RBP GENERATED: live-proxy-default-v1 -->
export type Part = {
  id: string;
  sku: string;
  title: string;
  price: number;
  group: string;
  image?: string;
  variantId?: number;
};

export function isPart(x: unknown): x is Part {
  const o = x as Record<string, unknown>;
  return !!o && typeof o === "object"
    && typeof o.id === "string"
    && typeof o.sku === "string"
    && typeof o.title === "string"
    && typeof o.price === "number"
    && typeof o.group === "string";
}

export function isPartArray(x: unknown): x is Part[] {
  return Array.isArray(x) && x.every(isPart);
}

export function isCatalogPayload(x: unknown): x is { parts: Part[] } {
  const o = x as Record<string, unknown>;
  return !!o && typeof o === "object" && isPartArray((o as any).parts);
}

export function isModulesPayload(x: unknown): x is { modules: { key: string; enabled: boolean; label?: string }[] } {
  const o = x as Record<string, unknown>;
  if (!o || typeof o !== "object") return false;
  const arr = (o as any).modules;
  return Array.isArray(arr) && arr.every((m) => m && typeof m.key === "string" && typeof m.enabled === "boolean");
}

export function isVariantsBySkuPayload(x: unknown): x is { ok: true; map: Record<string, number> } {
  const o = x as Record<string, unknown>;
  if (!o || typeof o !== "object") return false;
  const m = (o as any).map;
  return (o as any).ok === true && m && typeof m === "object" && Object.values(m).every((v) => typeof v === "number");
}
// <!-- END RBP GENERATED: live-proxy-default-v1 -->
