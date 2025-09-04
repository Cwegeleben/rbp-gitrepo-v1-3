/*
<!-- BEGIN RBP GENERATED: admin-builds-v1 -->
*/
import { http, HttpResponse } from 'msw';

export const buildsHandlers = [
  http.get('/apps/proxy/api/builds', ({ request }) => {
    const url = new URL(request.url);
    const status = (url.searchParams.get('status') || 'in_progress') as 'in_progress'|'queued'|'completed';
    const q = url.searchParams.get('q') || '';
    const items = [
      { id: 'b1', number: 101, customer: 'Alice', updatedAt: new Date().toISOString(), status: 'in_progress', total: 120 },
      { id: 'b2', number: 102, customer: 'Bob', updatedAt: new Date().toISOString(), status: 'queued', total: 90 },
      { id: 'b3', number: 103, customer: 'Cara', updatedAt: new Date().toISOString(), status: 'completed', total: 75 },
    ].filter(b => b.status === status).filter(b => q ? (b.customer.toLowerCase().includes(q.toLowerCase())) : true);
    return HttpResponse.json({ items });
  }),
  http.delete('/apps/proxy/api/builds/:id', () => HttpResponse.json({ ok: true })),
  http.post('/apps/proxy/api/builds/:id/duplicate', ({ params }) => {
    return HttpResponse.json({ id: params.id, duplicated: true });
  }),
];
/*
<!-- END RBP GENERATED: admin-builds-v1 -->
*/
