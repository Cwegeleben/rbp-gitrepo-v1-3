<!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
# RBP HQ App v0.1

Dev: `pnpm hq:dev` (PORT defaults 8083)
OpenAPI: `pnpm hq:openapi` -> `public/openapi.json`

Deploy plan (staging):
```
flyctl apps create rbp-hq-staging
flyctl secrets set SHOPIFY_API_KEY=... SHOPIFY_API_SECRET=...
flyctl deploy
```
<!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
