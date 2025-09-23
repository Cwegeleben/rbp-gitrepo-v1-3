# Staging /app entry + Secrets Preflight

<!-- BEGIN RBP GENERATED: staging-app-entry-preflight-v1 -->

Goal: Ensure the Shopify embedded Admin loads reliably from Fly staging.

Secrets to set (names only):
- SHOPIFY_API_KEY
- SHOPIFY_API_SECRET
- SESSION_SECRET
- APP_URL (e.g., https://rbp-rod-builder-pro-staging.fly.dev)
- PORT (8080)

Example commands:
```sh
export APP=rbp-rod-builder-pro-staging
fly secrets set \
  SHOPIFY_API_KEY=<Partners Client ID> \
  SHOPIFY_API_SECRET=<ROTATED Client Secret> \
  APP_URL=https://$APP.fly.dev \
  SESSION_SECRET=$(openssl rand -hex 32) \
  PORT=8080 \
  -a $APP

fly deploy -c src/apps/gateway/api-gateway/fly.toml -a $APP
```

Partner URLs to paste:
- App URL:     https://$APP.fly.dev/app
- Redirect:    https://$APP.fly.dev/auth/callback
- Proxy:       https://$APP.fly.dev/apps/proxy

6-step checklist:
1) Set secrets (above) on staging app
2) Deploy from repo root: `pnpm -s deploy:staging`
3) Verify endpoints: `curl -i https://$APP.fly.dev/healthz`, `/app/doctor`, `/app`
4) Update Partner URLs with the values above
5) Install/open in your dev store from Partners, confirm iframe loads
6) Tail logs if issues: `fly logs -a $APP -n 200`

Run preflight from repo root:
```sh
pnpm -s preflight:staging
```
Or scoped to gateway:
```sh
pnpm -F api-gateway -s preflight:staging
```

Acceptance:
- `/app` returns 200 and contains `data-testid="app-embed-ok"`
- `/healthz` returns 200
- Preflight prints PASS/FAIL lines and exits non-zero on failure

<!-- END RBP GENERATED: staging-app-entry-preflight-v1 -->
