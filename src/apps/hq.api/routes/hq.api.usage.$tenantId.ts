// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import type http from 'node:http';
import { ok, badRequest } from '../utils/respond';
import { mockUsage } from '../mock/hqMockData';
import type { UsageResponse } from '../types/hq';

export function handle(req: http.IncomingMessage, res: http.ServerResponse) {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const m = url.pathname.match(/^\/hq\/api\/usage\/(.+)$/);
  const tenantId = m?.[1];
  if (!tenantId) return badRequest(res, 'Missing tenant id');
  const body: UsageResponse = mockUsage(tenantId);
  ok(res, body);
}
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
