/*
<!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 -->
*/
import { fetchProxy } from '../../fetchProxy.server';

export type CatalogProduct = {
  id: string;
  title: string;
  vendor?: string;
  tags?: string[];
  priceBand?: string | number;
  enabled: boolean;
};

export type CatalogListResponse = {
  items: CatalogProduct[];
  pageInfo?: { nextCursor?: string; prevCursor?: string; total?: number };
};

export function createCatalogApi(fetchImpl: typeof fetch = fetchProxy as any) {
  return {
    async list(params: { vendor?: string[]; tags?: string[]; q?: string; priceBand?: string; cursor?: string }): Promise<CatalogListResponse> {
      // Use comma-delimited multi-selects per contract
      const sp = new URLSearchParams();
      const vend = (params.vendor || []).filter(Boolean);
  const tgs = (params.tags || []).filter(Boolean);
      if (vend.length) sp.set('vendor', vend.join(','));
  if (tgs.length) sp.set('tag', tgs.join(','));
      if (params.q) sp.set('q', params.q);
      if (params.priceBand) sp.set('priceBand', params.priceBand);
      if (params.cursor) sp.set('cursor', params.cursor);
      const res = await fetchImpl(`/apps/proxy/api/catalog/products?${sp.toString()}`);
      if (!res.ok) throw new Error(`Failed to load products: ${res.status}`);
      return (await res.json()) as CatalogListResponse;
    },
    async setEnabled(id: string, enabled: boolean): Promise<{ ok: boolean }> {
      const res = await fetchImpl(`/apps/proxy/api/catalog/product/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error(`Toggle failed: ${res.status}`);
      return { ok: true };
    },
  };
}
/*
<!-- END RBP GENERATED: tenant-admin-catalog-v2 -->
*/
