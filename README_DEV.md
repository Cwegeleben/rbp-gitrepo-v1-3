# Dev Runbook (CLI-managed tunnel)

## Start servers
- Terminal A:
  pnpm --filter @rbp/gateway-web dev

- Terminal B:
  shopify app dev --reset --path=.shopify/app --store=rbp-dev.myshopify.com
  - Yes to update URLs
  - No to release

## Set App Proxy host to current tunnel (one-time per run if tunnel changed)
- Copy the Application URL (host only) that CLI sets during `app dev` (from the Partner Dashboard or terminal output)
- Then run:
  scripts/set-app-proxy-host.sh https://<copied-host>
  # deploy will release a config-only version

## Verify
pnpm run smoke
# Expect A–C PASS locally, E–G PASS via store domain
