/*
<!-- BEGIN RBP GENERATED: admin-catalog-v2-2 -->
*/
import { http, HttpResponse } from 'msw';

export const catalogHandlers = [
  http.get('/apps/proxy/api/catalog/products', ({ request, params, cookies }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const enabled = url.searchParams.get('enabled');
    const items = [
      { id: 'p1', title: 'Alpha', vendor: 'Acme', priceBand: 'low', enabled: true },
      { id: 'p2', title: 'Beta', vendor: 'Bravo', priceBand: 'high', enabled: false },
      { id: 'p3', title: 'Gamma', vendor: 'Acme', priceBand: 'medium', enabled: true },
    ].filter(p => (q ? p.title.toLowerCase().includes(q.toLowerCase()) : true))
     .filter(p => (enabled === 'true' ? p.enabled : enabled === 'false' ? !p.enabled : true));
    return HttpResponse.json({ items });
  }),
  http.patch('/apps/proxy/api/catalog/product/:id', async ({ params, request }) => {
    const body = await request.json().catch(() => ({}));
    const id = params.id as string;
    const enabled = !!(body as any)?.enabled;
    return HttpResponse.json({ id, enabled });
  })
];
/*
<!-- END RBP GENERATED: admin-catalog-v2-2 -->
*/
