/**
 * Preflight: app-csp
 * Verifies that key /app endpoints return:
 *  - content-security-policy with frame-ancestors https://admin.shopify.com https://*.myshopify.com
 *  - NO X-Frame-Options header present
 *
 * Config:
 *  - BASE_URL: process.env.APP_CSP_BASE_URL or staging default
 */
import http from "node:http";
import https from "node:https";
import { URL } from "node:url";

const DEFAULT_BASE = "https://rbp-rod-builder-pro-staging.fly.dev";
const BASE = process.env.APP_CSP_BASE_URL || DEFAULT_BASE;

const PATHS = ["/app", "/app/doctor", "/app/catalog"];

type HeadersLike = Record<string, string | string[] | undefined>;

function request(u: string): Promise<{ status: number; headers: HeadersLike; body: string }> {
  return new Promise((resolve, reject) => {
    const url = new URL(u);
    const lib = url.protocol === "http:" ? http : https;
    const req = lib.request(
      {
        method: "GET",
        hostname: url.hostname,
        path: url.pathname + url.search,
        port: url.port || undefined,
        headers: {
          // Simulate a browser-ish request without embedding context
          "User-Agent": "rbp-preflight/1.0",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          resolve({ status: res.statusCode || 0, headers: res.headers, body: data });
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

function getHeader(headers: HeadersLike, name: string): string | undefined {
  const v = headers[name.toLowerCase() as keyof HeadersLike] as string | string[] | undefined;
  if (Array.isArray(v)) return v[0];
  return v as string | undefined;
}

(async () => {
  const failures: string[] = [];

  for (const p of PATHS) {
    const url = `${BASE}${p}`;
    let status = 0; let headers: HeadersLike = {}; let lastErr: any = null;
    // Retry up to 3 times with small backoff to dodge transient 502s
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const r = await request(url);
        status = r.status; headers = r.headers;
        if (![502, 503, 504].includes(status)) break;
      } catch (err) {
        lastErr = err;
      }
      await new Promise((res) => setTimeout(res, 800 * attempt));
    }
    try {
      const csp = getHeader(headers, "content-security-policy");
      const xfo = getHeader(headers, "x-frame-options");

      // We accept 200 or 404 here — the route might be a resource 404 by design; headers still must be present
      if (![200, 302, 404].includes(status)) {
        failures.push(`${p}: unexpected status ${status}`);
      }

      const want = "frame-ancestors https://admin.shopify.com https://*.myshopify.com";
      if (!csp || !csp.includes(want)) {
        failures.push(`${p}: missing/invalid CSP frame-ancestors; got: ${csp ?? "<none>"}`);
      }
      if (typeof xfo !== "undefined") {
        failures.push(`${p}: x-frame-options should be absent; got: ${xfo}`);
      }
    } catch (err: any) {
      failures.push(`${p}: request failed: ${(err?.message || lastErr?.message) ?? String(err ?? lastErr)}`);
    }
  }

  if (failures.length) {
    console.error("preflight:app-csp failed:\n" + failures.map((f) => ` - ${f}`).join("\n"));
    process.exit(1);
  }
  console.log("preflight:app-csp ok for", BASE);
})();
