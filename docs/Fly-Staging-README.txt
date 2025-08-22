<!-- BEGIN RBP GENERATED: Fly staging proxy -->
One-page checklist to view the Remix app via Fly staging

1) Deploy to Fly
- flyctl deploy -a rbp-rod-builder-pro-staging

2) Configure environment variables on Fly
- Set SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_APP_URL, and any other required secrets

3) Ensure Shopify app proxy URL is the Fly staging URL
- shopify.app.toml [app_proxy].url should be:
  https://rbp-rod-builder-pro-staging.fly.dev/apps/proxy
- Strict preflight expects this exact URL; otherwise it will fail.
  - For CI exceptions, set PREFLIGHT_EXPECTED_PROXY_URL=https://rbp-rod-builder-pro-staging.fly.dev/apps/proxy

4) Run strict preflight locally
- pnpm preflight:strict

5) Verify endpoints
- curl https://rbp-rod-builder-pro-staging.fly.dev/apps/proxy/ping
- curl https://rbp-rod-builder-pro-staging.fly.dev/apps/proxy/api/access/ctx
<!-- END RBP GENERATED: Fly staging proxy -->
