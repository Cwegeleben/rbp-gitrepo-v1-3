/*
<!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 -->
*/
export type CatalogUrlState = {
  q: string;
  vendor: string[];
  tags: string[];
  priceBand?: string;
  cursor?: string;
  /* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
  sort?: { key: 'vendor'|'title'|'priceBand'|'enabled'; dir: 'asc'|'desc' };
  /* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */
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
    /* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
    sort: (() => {
      const v = sp.get('sort') || undefined;
      if (!v) return undefined;
      const [key, dir] = v.split(':');
      if (!key || (dir !== 'asc' && dir !== 'desc')) return undefined;
      if (key === 'vendor' || key === 'title' || key === 'priceBand' || key === 'enabled') return { key, dir } as any;
      return undefined;
    })(),
    /* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */
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
  /* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
  if (state.sort !== undefined) {
    const s = state.sort;
    if (s) sp.set('sort', `${s.key}:${s.dir}`);
    else sp.delete('sort');
  }
  /* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */
  return sp;
}
/*
<!-- END RBP GENERATED: tenant-admin-catalog-v2 -->
*/
