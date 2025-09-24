// <!-- BEGIN RBP GENERATED: rbp-hq-catalog-inventory-v0-4 -->
import { getSettings } from "./settings.server";

type AdminClient = { graphql: (q: string, opts?: any) => Promise<any> };

export type VariantInventory = { id: string; sku?: string; available: number; incoming: number };
export type ProductInventory = { available: number; incoming: number; variants: VariantInventory[] };

export async function getInventoryForProducts(
  admin: AdminClient,
  productIds: string[],
  opts?: { locationId?: string }
): Promise<Record<string, ProductInventory>> {
  if (!productIds.length) return {};
  const locationId = await resolveLocationId(admin, opts?.locationId);
  const byProductId: Record<string, ProductInventory> = {};
  for (const pid of productIds) {
    const inv = await fetchProductInventory(admin, pid, locationId);
    byProductId[pid] = inv;
  }
  return byProductId;
}

async function resolveLocationId(admin: AdminClient, override?: string): Promise<string> {
  if (override) return override;
  const settings = await getSettings(admin);
  if (settings.defaultLocationId) return settings.defaultLocationId;
  const q = `#graphql { locations(first: 1, includeInactive: false) { nodes { id name } } }`;
  const res = await admin.graphql(q);
  const data = await res.json();
  const id = data?.data?.locations?.nodes?.[0]?.id;
  if (!id) throw new Error("No active location found");
  return id;
}

async function fetchProductInventory(admin: AdminClient, productId: string, locationId: string): Promise<ProductInventory> {
  const q = `#graphql
    query RbpInv($id: ID!, $loc: ID!) {
      product(id: $id) {
        id
        variants(first: 50) {
          nodes {
            id
            sku
            inventoryItem { id inventoryLevels(first: 5, locations: [$loc]) { nodes { id available incoming } } }
          }
        }
        updatedAt
      }
    }
  `;
  const res = await admin.graphql(q, { variables: { id: productId, loc: locationId } });
  const data = await res.json();
  const nodes = data?.data?.product?.variants?.nodes || [];
  const variants: VariantInventory[] = nodes.map((v: any) => {
    const levels = v?.inventoryItem?.inventoryLevels?.nodes || [];
    const lvl = levels[0] || {};
    return {
      id: v.id,
      sku: v.sku || undefined,
      available: Number(lvl.available ?? 0),
      incoming: Number(lvl.incoming ?? 0)
    };
  });
  const available = variants.reduce((a, b) => a + (b.available || 0), 0);
  const incoming = variants.reduce((a, b) => a + (b.incoming || 0), 0);
  return { available, incoming, variants };
}
// <!-- END RBP GENERATED: rbp-hq-catalog-inventory-v0-4 -->
