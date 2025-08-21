<!-- BEGIN RBP GENERATED: Fly-Deploy-Fix -->
## Fly Deploy Quickstart
```bash
# one-time
fly volumes create data --size 1 --region sea
fly secrets set DATABASE_URL="file:/data/dev.sqlite" SHOPIFY_API_KEY="..." SHOPIFY_API_SECRET="..." SESSION_SECRET="$(openssl rand -hex 16)" NODE_ENV=production
# deploy
fly deploy --remote-only
# verify
./scripts/fly/curl-smoke.sh https://rbp-rod-builder-pro-staging.fly.dev
<!-- END RBP GENERATED: Fly-Deploy-Fix -->
# Rod Builder Pro v1-3

## Catalog endpoint checks
Run all curl-based health checks:

	pnpm curl:checks

## Dev/Testing

Local curl packs use PORT from scripts/port.env (default 51544). Override with:
	PORT=12345 pnpm curl:builds
If scripts/port.env is absent or blank, scripts fall back to auto-discovery.
