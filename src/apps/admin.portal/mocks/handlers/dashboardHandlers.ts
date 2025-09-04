// @ts-nocheck
/*
<!-- BEGIN RBP GENERATED: admin-dashboard-v1 -->
*/
import { http, HttpResponse } from 'msw';

export const dashboardHandlers = [
  http.get('/apps/proxy/api/builds', ({ request }: { request: Request }) => {
    const url = new URL((request as any).url);
    const status = url.searchParams.get('status');
    const limit = Number(url.searchParams.get('limit') || '5');
    if (status === 'in_progress') {
      return HttpResponse.json({ items: Array.from({ length: Math.min(1, limit) }).map((_, i) => ({
        id: `b${i+1}`,
        title: `Build ${i+1}`,
        customer: 'Alice',
        updatedAt: new Date().toISOString(),
        status: 'in_progress',
        total: 12.34,
      })) });
    }
    return HttpResponse.json({ items: [], pageInfo: { total: 7 } });
  }),
  http.get('/apps/proxy/api/catalog/products', ({ request }: { request: Request }) => {
    const url = new URL((request as any).url);
    const enabled = url.searchParams.get('enabled');
    if (enabled === 'false') return HttpResponse.json({ count: 3 });
    return HttpResponse.json({ items: [], pageInfo: { total: 42 } });
  }),
  http.get('/apps/proxy/api/orders', () => HttpResponse.json({ count: 2 })),
  http.get('/apps/proxy/modules/health', () => HttpResponse.json({ ok: true, modules: {}, errors: [] })),
];
/*
<!-- END RBP GENERATED: admin-dashboard-v1 -->
*/
