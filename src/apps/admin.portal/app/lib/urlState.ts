/*
<!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 -->
*/
export type CatalogUrlState = {
  q: string;
  vendor: string[];
  tags: string[];
  priceBand?: string;
  cursor?: string;
};

function splitCSV(v?: string | null): string[] {
  if (!v) return [];
  return v.split(',').map(s => s.trim()).filter(Boolean);
}

export function read(sp: URLSearchParams): CatalogUrlState {
  return {
    q: sp.get('q') || '',
    vendor: splitCSV(sp.get('vendor')),
    tags: splitCSV(sp.get('tags')),
    priceBand: sp.get('priceBand') || undefined,
    cursor: sp.get('cursor') || undefined,
  };
}

export function write(state: Partial<CatalogUrlState>): URLSearchParams {
  const sp = new URLSearchParams();
  if (state.q !== undefined) sp.set('q', state.q || '');
  if (state.vendor !== undefined) sp.set('vendor', (state.vendor || []).join(','));
  if (state.tags !== undefined) sp.set('tags', (state.tags || []).join(','));
  if (state.priceBand !== undefined) {
    if (state.priceBand) sp.set('priceBand', state.priceBand);
    else sp.delete('priceBand');
  }
  if (state.cursor !== undefined) {
    if (state.cursor) sp.set('cursor', state.cursor);
    else sp.delete('cursor');
  }
  return sp;
}
/*
<!-- END RBP GENERATED: tenant-admin-catalog-v2 -->
*/
