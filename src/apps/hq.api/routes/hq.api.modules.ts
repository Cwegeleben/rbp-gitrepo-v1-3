// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import type http from 'node:http';
import { ok } from '../utils/respond';
import { mockModules } from '../mock/hqMockData';
import type { ModulesResponse } from '../types/hq';

export function handle(_req: http.IncomingMessage, res: http.ServerResponse) {
  const body: ModulesResponse = mockModules;
  ok(res, body);
}
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
