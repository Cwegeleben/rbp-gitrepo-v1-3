# Rod Builder Pro v1-3

## Catalog endpoint checks
Run all curl-based health checks:

	pnpm curl:checks

## Dev/Testing

Local curl packs use PORT from scripts/port.env (default 51544). Override with:
	PORT=12345 pnpm curl:builds
If scripts/port.env is absent or blank, scripts fall back to auto-discovery.
