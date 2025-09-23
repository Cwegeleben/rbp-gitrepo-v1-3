// @ts-ignore - createRequestHandler is available at runtime in Remix v2
import { createRequestHandler } from "@remix-run/node";
// @ts-ignore - build output has no types; runtime import is valid
import * as build from "./build/index.js";
import http from "node:http";

// <!-- BEGIN RBP GENERATED: staging-app-entry-preflight-v1 -->
// Startup env guard and stable port selection
const rawPort = process.env.PORT ?? "8080";
const port = Number(rawPort);
if (!Number.isFinite(port) || port <= 0) {
  console.error(`[startup] Invalid PORT: ${rawPort}. Provide a positive integer (example: PORT=8080).`);
  process.exit(1);
}

// Required secrets for staging reliability
const requiredEnv = [
  "SHOPIFY_API_KEY",
  "SHOPIFY_API_SECRET",
  "SESSION_SECRET",
  "APP_URL",
];

const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`[startup] Missing required env: ${missing.join(", ")}`);
  console.error("[startup] Set these via your hosting secrets (do not log values). Exiting.");
  process.exit(1);
}
// <!-- END RBP GENERATED: staging-app-entry-preflight-v1 -->

const handler = createRequestHandler(build, process.env.NODE_ENV);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
  // <!-- BEGIN RBP GENERATED: admin-consolidation-embedded-only-v1-0 -->
  // Consolidation: Remove gateway '/app' placeholder. Embedded admin is served only by the Shopify app.
  // All '/app' requests should flow through Remix handlers or Shopify app hosting; no stub HTML here.
  // <!-- END RBP GENERATED: admin-consolidation-embedded-only-v1-0 -->
    const request = new Request(url, {
      method: req.method,
      headers: req.headers as any,
      body: req.method !== "GET" && req.method !== "HEAD" ? (req as any) : undefined,
    });
    const response = await handler(request);
    res.statusCode = response.status;
  response.headers.forEach((value: string, key: string) => res.setHeader(key, value));
    if (response.body) {
      const reader = response.body.getReader();
      const encoder = new TextEncoder();
      const pump = async (): Promise<void> => {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          return;
        }
        res.write(Buffer.from(value));
        await pump();
      };
      await pump();
    } else {
      res.end();
    }
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain");
    res.end("Internal Server Error\n" + (err instanceof Error ? err.stack : String(err)));
  }
});

server.listen(port, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
