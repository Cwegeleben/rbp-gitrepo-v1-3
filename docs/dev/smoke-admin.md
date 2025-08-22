<!-- BEGIN RBP GENERATED: docs-smoke-admin -->
# Tenant Admin Smoke Check

10-second sanity test for Access + Catalog + a dry-run PATCH.

## Purpose

- Verify Admin App Proxy endpoints respond and payloads shape as expected.
- Ensure Access context resolves a tenant and plan.
- Exercise Catalog list and a dry-run product PATCH.

## Prereqs

- Dev server or Shopify CLI session running.
- `RBP_ADMIN_BASE_URL` pointing at your local dev host.

## Run

```sh
RBP_ADMIN_BASE_URL=http://localhost:51544 pnpm smoke:admin
```

## Exit codes

- `0` success
- `1` HTTP/payload failure (prints URL, status, body excerpt)
- `2` config/network missing (prints hints)

## What it does

1. `GET /apps/proxy/api/access/ctx` → asserts tenant + plan.
2. `GET /apps/proxy/api/catalog/products` → asserts it returns a list.
3. `PATCH` (dry run) `/apps/proxy/api/catalog/product/:id` with `X-RBP-Dry-Run: 1` for the first item.

## Troubleshooting

- 401/403: ensure Admin dev session is active; App Proxy not gated by storefront password.
- 500: check server logs; verify Access ctx endpoint.
- Network: verify base URL; run via Shopify CLI if needed.

## CI usage (mocked)

Run smoke in CI with a mock base URL or a test double for fetch; do not hit real Shopify.

```yaml
name: admin-smoke
on:
  pull_request:
  push:
    branches: [ main ]
jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - env:
          RBP_ADMIN_BASE_URL: http://localhost:51544
        run: pnpm smoke:admin
```

## Copy-paste snippets

### `.env.local` example

```
RBP_ADMIN_BASE_URL=http://localhost:51544
```

### GitHub Actions job example

```yaml
- name: Admin smoke
  env:
    RBP_ADMIN_BASE_URL: http://localhost:51544
  run: pnpm smoke:admin
```

## Acceptance Criteria

- Both files created with sentinel blocks and the content above.
- Commands match current scripts: `storybook`, `build-storybook`, `smoke:admin`.
- Examples reference `src/apps/admin.portal/...` paths.
- No changes to app routes or types.
<!-- END RBP GENERATED: docs-smoke-admin -->
