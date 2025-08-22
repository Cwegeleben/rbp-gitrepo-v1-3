// <!-- BEGIN RBP GENERATED: orders-commit-phase2 -->
// Lightweight Shopify Admin GraphQL client for RBP shop only
export type AdminResult<T=any> = { ok: true; data: T } | { ok: false; status?: number; message?: string; errors?: any };

function getRbpEnv() {
  const shopDomain = process.env.RBP_STORE_DOMAIN || process.env.RBP_SHOP_DOMAIN || process.env.SHOPIFY_SHOP_DOMAIN;
  const token = process.env.RBP_ADMIN_TOKEN || process.env.SHOPIFY_ACCESS_TOKEN || process.env.SHOPIFY_ADMIN_TOKEN;
  const apiVersion = process.env.RBP_SHOPIFY_API_VERSION || "2025-01";
  return { shopDomain, token, apiVersion } as const;
}

export async function adminGraphQL<T=any>(query: string, variables?: Record<string, any>): Promise<AdminResult<T>> {
  const { shopDomain, token, apiVersion } = getRbpEnv();
  if (!shopDomain || !token) return { ok: false, message: "missing_rbp_admin_env" };
  const url = `https://${shopDomain}/admin/api/${apiVersion}/graphql.json`;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, status: r.status, message: json?.errors?.[0]?.message || "http_error", errors: json?.errors };
    if (json?.errors) return { ok: false, status: r.status, message: json?.errors?.[0]?.message || "gql_error", errors: json?.errors };
    return { ok: true, data: json?.data };
  } catch (e: any) {
    return { ok: false, message: e?.message || "network_error" };
  }
}

export async function getVariantInventoryItemId(variantIdOrSku: { variantId?: string; sku?: string }): Promise<AdminResult<{ variantId: string; inventoryItemId: string }>> {
  if (!variantIdOrSku.variantId && !variantIdOrSku.sku) return { ok: false, message: "missing_variant_ref" };
  if (variantIdOrSku.variantId) {
    const q = /* GraphQL */ `#graphql
      query VariantInvItem($id: ID!) {
        productVariant(id: $id) { id sku inventoryItem { id } }
      }
    `;
    const r = await adminGraphQL(q, { id: variantIdOrSku.variantId });
    if (!r.ok) return r as any;
    const v = (r.data as any)?.productVariant;
    if (!v?.inventoryItem?.id) return { ok: false, message: "variant_no_inventory_item" };
    return { ok: true, data: { variantId: v.id, inventoryItemId: v.inventoryItem.id } };
  } else {
    // Lookup by SKU (best-effort); assumes unique SKU in RBP shop
    const q = /* GraphQL */ `#graphql
      query VariantBySku($query: String!) {
        productVariants(first: 1, query: $query) { nodes { id sku inventoryItem { id } } }
      }
    `;
    const r = await adminGraphQL(q, { query: `sku:${JSON.stringify(variantIdOrSku.sku)}` });
    if (!r.ok) return r as any;
    const v = (r.data as any)?.productVariants?.nodes?.[0];
    if (!v?.inventoryItem?.id) return { ok: false, message: "sku_no_inventory_item" };
    return { ok: true, data: { variantId: v.id, inventoryItemId: v.inventoryItem.id } };
  }
}

export async function getAvailableAtLocation(inventoryItemId: string, shopifyLocationId: string): Promise<AdminResult<{ available: number }>> {
  const q = /* GraphQL */ `#graphql
    query ItemLevels($id: ID!) {
      inventoryItem(id: $id) {
        id
        inventoryLevels(first: 50) {
          nodes { available location { id } }
        }
      }
    }
  `;
  const r = await adminGraphQL(q, { id: inventoryItemId });
  if (!r.ok) return r as any;
  const levels = (r.data as any)?.inventoryItem?.inventoryLevels?.nodes || [];
  const level = levels.find((n: any) => n?.location?.id === shopifyLocationId);
  const available = Number(level?.available ?? 0);
  return { ok: true, data: { available: Number.isFinite(available) ? available : 0 } };
}

export async function adjustAvailableDelta(inventoryItemId: string, shopifyLocationId: string, delta: number): Promise<AdminResult<{ available?: number }>> {
  // Use legacy inventoryAdjustQuantity for broad compatibility
  const m = /* GraphQL */ `#graphql
    mutation Adjust($inventoryItemId: ID!, $availableDelta: Int!, $locationId: ID!) {
      inventoryAdjustQuantity(inventoryItemId: $inventoryItemId, availableDelta: $availableDelta, locationId: $locationId) {
        inventoryLevel { available }
        userErrors { field message }
      }
    }
  `;
  const r = await adminGraphQL(m, { inventoryItemId, availableDelta: delta, locationId: shopifyLocationId });
  if (!r.ok) return r as any;
  const res = (r.data as any)?.inventoryAdjustQuantity;
  if (res?.userErrors?.length) return { ok: false, message: res.userErrors[0]?.message || "user_error", errors: res.userErrors };
  return { ok: true, data: { available: res?.inventoryLevel?.available } };
}
// <!-- END RBP GENERATED: orders-commit-phase2 -->
