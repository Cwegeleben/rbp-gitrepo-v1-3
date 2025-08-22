# RBP Dev Workflow

<!-- BEGIN RBP GENERATED: dev-workflow-doc -->

## Surfaces
- Local (Shopify CLI dev): Recommended. CLI injects keys and opens a tunnel.
- Local Remix server: Example: http://localhost:55276 (the port changes).
- CLI Tunnel: Example host: `*.trycloudflare.com` (dynamic). Don’t hard-code this.
- Fly.io Staging: Canonical proxy target for storefront `/apps/proxy/*`.

## Start Local (CLI)
```bash
cd src/apps/rbp-shopify-app/rod-builder-pro
export PORT=55276  # or whatever port Remix shows
pnpm dev:shopify-cli
```

CLI will display:
- Remix Local URL (e.g., http://localhost:55276)
- Public tunnel URL (e.g., https://<random>.trycloudflare.com)

Storefront Proxy (Canonical)

`[app_proxy]` in `shopify.app.toml` should point to:

```
url = "https://rbp-rod-builder-pro-staging.fly.dev"
prefix = "apps"
subpath = "proxy"
```

This keeps a single source of truth for storefront proxy traffic.

## Preflight

Default (warn on tunnel/local):

```bash
pnpm preflight
```

Strict (fail if not Fly staging URL):

```bash
pnpm preflight:strict
```

Strict but allow a tunnel/local override:

```bash
PREFLIGHT_EXPECTED_PROXY_URL="https://<your-tunnel>.trycloudflare.com" pnpm preflight:strict
# or
PREFLIGHT_EXPECTED_PROXY_URL="http://localhost:55276" pnpm preflight:strict
```

## Quick Tests

Doctor:

```bash
curl -sS "http://localhost:PORT/apps/proxy/doctor?shop=demo.myshopify.com" | jq
# Shows { proxy: { prefix, subpath, url }, verify: { hmacEnabled } }
```

Signed Proxy:

```bash
pnpm proxy:sign
pnpm proxy:test
```

## Don’ts
- Don’t hard-code dynamic tunnel URLs.
- Don’t commit secrets. Rotate in Partners if exposed.

## TL;DR
- Use CLI for local; deploy to Fly for staging.
- Proxy source of truth = Fly staging.
- Use `PREFLIGHT_EXPECTED_PROXY_URL` to strict-check tunnels.

<!-- END RBP GENERATED: dev-workflow-doc -->
