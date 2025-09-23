// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import type http from 'node:http';
import { ok, badRequest } from '../utils/respond';
import { mockPricingBook } from '../mock/hqMockData';
import type { PricingBookResponse } from '../types/hq';

export function handle(req: http.IncomingMessage, res: http.ServerResponse) {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const m = url.pathname.match(/^\/hq\/api\/pricing\/books\/(.+)$/);
  const id = m?.[1];
  if (!id) return badRequest(res, 'Missing pricing book id');
  const body: PricingBookResponse = mockPricingBook(id);
  ok(res, body);
}
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
