// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import http from 'node:http';
import type { HealthzResponse } from './openapi/types';
import * as routeModules from './routes/hq.api.modules';
import * as routeTenantModules from './routes/hq.api.tenants.$id.modules';
import * as routeCatalogMaster from './routes/hq.api.catalog.master';
import * as routePricingBook from './routes/hq.api.pricing.books.$id';
import * as routeUsage from './routes/hq.api.usage.$tenantId';

const PORT = Number(process.env.PORT || 8083);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    // Only serve /hq/*; reject others to avoid colliding with APP paths
    if (!url.pathname.startsWith('/hq/')) {
      res.statusCode = 404;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ error: 'HQ only' }));
      return;
    }
    if (url.pathname === '/hq/healthz') {
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      const payload: HealthzResponse = { ok: true };
      res.end(JSON.stringify(payload));
      return;
    }
    if (url.pathname === '/hq/openapi.json') {
      res.statusCode = 200;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(OPENAPI));
      return;
    }
    if (url.pathname === '/hq/api/modules' && req.method === 'GET') {
      return routeModules.handle(req, res);
    }
    if (/^\/hq\/api\/tenants\/.+\/modules$/.test(url.pathname) && req.method === 'GET') {
      return routeTenantModules.handle(req, res);
    }
    if (url.pathname === '/hq/api/catalog/master' && req.method === 'GET') {
      return routeCatalogMaster.handle(req, res);
    }
    if (/^\/hq\/api\/pricing\/books\/.+/.test(url.pathname) && req.method === 'GET') {
      return routePricingBook.handle(req, res);
    }
    if (/^\/hq\/api\/usage\/.+/.test(url.pathname) && req.method === 'GET') {
      return routeUsage.handle(req, res);
    }
    res.statusCode = 404;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found' }));
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Server error' }));
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`[hq.api] listening on :${PORT}`);
});

// Minimal placeholder OpenAPI; real spec to be generated later
// For now keep minimal inline OPENAPI; full spec lives in docs/openapi/hq.v0.yml
const OPENAPI = { openapi: '3.0.0', info: { title: 'RBP HQ API', version: '0.0.1' }, paths: { '/hq/healthz': { get: { responses: { '200': { description: 'ok' } } } } } } as const;
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
