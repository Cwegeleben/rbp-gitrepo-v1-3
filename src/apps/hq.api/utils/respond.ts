// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import type http from 'node:http';

export function json(res: http.ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
}

export function notFound(res: http.ServerResponse, msg = 'Not found') {
  json(res, 404, { error: msg });
}

export function badRequest(res: http.ServerResponse, msg = 'Bad request') {
  json(res, 400, { error: msg });
}

export function ok(res: http.ServerResponse, body: unknown) {
  json(res, 200, body);
}
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
