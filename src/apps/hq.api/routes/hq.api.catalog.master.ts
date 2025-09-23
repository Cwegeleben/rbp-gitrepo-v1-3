// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import type http from 'node:http';
import { ok } from '../utils/respond';
import { mockCatalogMaster } from '../mock/hqMockData';
import type { CatalogMasterResponse, Component } from '../types/hq';

export function handle(_req: http.IncomingMessage, res: http.ServerResponse) {
  const body: CatalogMasterResponse = mockCatalogMaster as CatalogMasterResponse;
  ok(res, body);
}
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
