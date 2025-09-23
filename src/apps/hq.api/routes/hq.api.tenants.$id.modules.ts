// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import type http from 'node:http';
import { ok, badRequest } from '../utils/respond';
import { mockTenantModules } from '../mock/hqMockData';
import type { TenantModulesResponse } from '../types/hq';

export function handle(req: http.IncomingMessage, res: http.ServerResponse) {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const m = url.pathname.match(/^\/hq\/api\/tenants\/(.+?)\/modules$/);
  const id = m?.[1];
  if (!id) return badRequest(res, 'Missing tenant id');
  const body: TenantModulesResponse = mockTenantModules(id);
  ok(res, body);
}
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
