// API route: /apps/proxy/api/checkout/package

import { PrismaClient } from "@prisma/client";
import { json } from "@remix-run/node";
import { readCatalogJson } from "~/proxy/catalog.server";
import { dbg, dbe } from "../../apps/rbp-shopify-app/rod-builder-pro/app/utils/debug.server";

const prisma = new PrismaClient();
const HEADERS = { "content-type": "application/json", "cache-control": "no-store" } as const;

async function getBuildId(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("buildId")?.trim();
  if (q) return q;
  if (req.method !== "GET") {
    try {
      const body = await req.json().catch(() => null);
      const id = body?.buildId?.toString().trim();
      if (id) return id;
    } catch {}
  }
  return null;
}

export async function loader({ request }: { request: Request }) {
  return handlePack(request);
}
export async function action({ request }: { request: Request }) {
  return handlePack(request);
}

async function handlePack(request: Request) {
  try {
    dbg("packager:start", { url: request.url, method: request.method });
    const buildId = await getBuildId(request);
    dbg("packager:buildId", buildId);
    if (!buildId) {
      return json({ error: "BAD_REQUEST", message: "buildId required" }, { status: 400, headers: HEADERS });
    }

    const build = await prisma.build.findUnique({
      where: { id: buildId },
      include: { items: true },
    });
    if (!build) {
      dbg("packager:not_found", { buildId });
      return json({ error: "NOT_FOUND", message: "build not found" }, { status: 404, headers: HEADERS });
    }
    dbg("packager:build_loaded", { id: build.id, tenant: build.tenant, items: build.items?.length ?? 0 });

    // Optional variant mapping from catalog
    let catalog: any = null;
    try { catalog = await readCatalogJson(); } catch {}

    const normItems = (build.items ?? []).map(it => {
      const qty = Math.max(1, Math.min(999, Number(it.quantity ?? 1)));
      const title = (it as any).label ?? (it as any).productId ?? "Item";
      let variantId: string | undefined;
      if (catalog && it.productId) {
        const p = (catalog.products || catalog || []).find((x: any) => x.id === it.productId || x.handle === it.productId);
        if (p?.variantId) variantId = String(p.variantId);
      }
      return { productId: it.productId ?? null, title: String(title), quantity: qty, ...(variantId ? { variantId } : {}) };
    });
    const withVariants = normItems.filter(i => "variantId" in i).length;
    dbg("packager:normalized", { total: normItems.length, withVariants });

    // Build cartPath if every item has variantId
    const allHaveVariants = normItems.length > 0 && normItems.every(i => !!(i as any).variantId);
    const cartPath = allHaveVariants
      ? `/cart/${normItems.map(i => `${(i as any).variantId}:${i.quantity}`).join(",")}`
      : null;
    const addJsPayload = allHaveVariants
      ? { items: normItems.map(i => ({ id: (i as any).variantId, quantity: i.quantity })) }
      : null;
    dbg("packager:cart", { cartPath, addJsItems: addJsPayload?.items?.length ?? 0 });

    const payload = {
      buildId,
      totalItems: normItems.length,
      items: normItems,
      cart: { cartPath, addJsPayload },
    };

    return json(payload, { headers: HEADERS });
  } catch (e: any) {
    dbe("packager:error", e?.message);
    return json({ error: "INTERNAL", message: e?.message ?? "unexpected" }, { status: 500, headers: HEADERS });
  }
}
