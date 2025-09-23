# Staging /app entry + Preflight

<!-- BEGIN RBP GENERATED: staging-app-entry-preflight-v1 -->

This preflight ensures the gateway boots with required secrets and exposes a minimal `/app` route for Shopify Admin embedding checks.

Checklist:
- Secrets set: SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SESSION_SECRET
- One of APP_URL or SHOPIFY_APP_URL configured
- `/healthz` responds 200
- `/app` responds 200 with data-testid="app-embed-ok"
- `/app/doctor` returns 200/302 (optional) — best-effort

Run locally:
- Ensure env vars, then:
  - pnpm -s preflight:staging

On Fly staging:
- fly secrets set SHOPIFY_API_KEY=... SHOPIFY_API_SECRET=... SESSION_SECRET=...
- Optionally: fly secrets set APP_URL=https://rbp-rod-builder-pro-staging.fly.dev
- Deploy: pnpm -s deploy:staging
- Verify: pnpm -s preflight:staging

Notes:
- The server validates PORT early and fails fast if misconfigured.
- Missing APP_URL/SHOPIFY_APP_URL is only a warning; preflight falls back to http://localhost:8080.

<!-- END RBP GENERATED: staging-app-entry-preflight-v1 -->
