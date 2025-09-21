// <!-- BEGIN RBP GENERATED: storefront-cart-e2e-v1-1 -->
export type RbpPart = {
  id: string;
  sku: string;
  title: string;
  price: number; // cents
  group: string;
  image?: string;
  variantId?: number;
};

export type RbpModules = { key: string; enabled: boolean; label?: string }[];

export type RbpProxyState = {
  proxyBlocked: boolean;
  usingMock: boolean;
};

const MOCK_PARTS: RbpPart[] = [
  { id: "blank-100", sku: "BL-100", title: "RBP Carbon Blank 7'", price: 12999, group: "Blanks" },
  { id: "butt-10", sku: "BC-010", title: "Butt Cap Standard", price: 599, group: "Butt Cap" },
  { id: "rear-20", sku: "RG-020", title: "Rear Grip EVA 10in", price: 1499, group: "Rear Grip" },
  { id: "seat-30", sku: "RS-030", title: "Reel Seat Size 17", price: 1899, group: "Reel Seat" },
  { id: "fore-40", sku: "FG-040", title: "Foregrip EVA 4in", price: 999, group: "Foregrip" },
  { id: "wind-50", sku: "WC-050", title: "Winding Check 12mm", price: 399, group: "Winding Check" },
  { id: "guides-60", sku: "GD-060", title: "Guide Set 9pc", price: 2499, group: "Guides" },
  { id: "tip-70", sku: "TT-070", title: "Tip Top 5.5", price: 499, group: "Tip Top" },
];

const MOCK_MODULES: RbpModules = [
  { key: "addToBuild", enabled: true, label: "Add to Build" },
  { key: "packager", enabled: true, label: "Checkout Packager" },
];

function isBlockedStatus(status: number) {
  return status === 401 || status === 403 || status === 404;
}

export class RbpProxyClient {
  state: RbpProxyState = { proxyBlocked: false, usingMock: false };

  constructor(private base = "") {}

  private async tryProxyOrMock<T>(path: string, mock: T): Promise<T> {
    const url = this.base + path;
    try {
      const res = await fetch(url, { headers: { "Accept": "application/json" } });
      if (!res.ok) {
        if (isBlockedStatus(res.status)) {
          this.state.proxyBlocked = true;
          this.state.usingMock = true;
          return mock;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      this.state.proxyBlocked = false;
      return (data?.parts || data?.modules) ?? data;
    } catch (e) {
      this.state.proxyBlocked = true;
      this.state.usingMock = true;
      return mock;
    }
  }

  async getCatalogParts(): Promise<RbpPart[]> {
    return this.tryProxyOrMock<RbpPart[]>("/apps/proxy/rbp/catalog", MOCK_PARTS);
  }

  async getModules(): Promise<RbpModules> {
    return this.tryProxyOrMock<RbpModules>("/apps/proxy/rbp/modules", MOCK_MODULES);
  }

  async getVariantsBySku(): Promise<Record<string, number>> {
    const mock: Record<string, number> = {
      "BL-100": 111000001,
      "BC-010": 111000002,
      "RG-020": 111000003,
      "RS-030": 111000004,
      "FG-040": 111000005,
      "WC-050": 111000006,
      "GD-060": 111000007,
      "TT-070": 111000008,
    };
    const data = await this.tryProxyOrMock<{ ok: true; map: Record<string, number> }>("/apps/proxy/rbp/variantsBySku", { ok: true, map: mock } as any);
    // If using tryProxyOrMock, it returns inner object; normalize
    const map = (data as any).map ?? data;
    return map as Record<string, number>;
  }

  setUseMock(on: boolean) {
    this.state.usingMock = !!on;
  }
}

export const GROUPS = [
  "Blanks",
  "Butt Cap",
  "Rear Grip",
  "Reel Seat",
  "Foregrip",
  "Winding Check",
  "Guides",
  "Tip Top",
] as const;

export type GroupName = typeof GROUPS[number];

export type SlotSelection = { [K in GroupName]?: RbpPart | null };

export function emptySelection(): SlotSelection {
  return {};
}

export const PERSIST_KEY = "rbp:addToBuild:v1";

export function persistSelection(sel: SlotSelection) {
  try { localStorage.setItem(PERSIST_KEY, JSON.stringify(sel)); } catch {}
}

export function loadSelection(): SlotSelection {
  try { const s = localStorage.getItem(PERSIST_KEY); return s ? JSON.parse(s) : {}; } catch { return {}; }
}

export function readSelectionFromUrl(): SlotSelection | null {
  try {
    const u = new URL(window.location.href);
    const enc = u.searchParams.get("rbpBuild");
    if (!enc) return null;
    const json = decodeURIComponent(enc);
    const obj = JSON.parse(json);
    return obj && typeof obj === "object" ? (obj as SlotSelection) : null;
  } catch { return null; }
}

export function writeSelectionToUrl(sel: SlotSelection) {
  try {
    const u = new URL(window.location.href);
    const json = encodeURIComponent(JSON.stringify(sel));
    u.searchParams.set("rbpBuild", json);
    window.history.replaceState({}, "", u.toString());
  } catch {}
}
// <!-- END RBP GENERATED: storefront-cart-e2e-v1-1 -->
