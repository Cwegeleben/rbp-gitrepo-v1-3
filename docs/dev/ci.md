<!-- BEGIN RBP GENERATED: ci-admin-tests-smoke -->
# CI on PRs

This repository runs the following on pull_request and push to main:

- tests: Installs deps, runs Jest (admin portal + server tests).
- smoke_admin_mock: Runs the Tenant Admin smoke in mocked mode (no Shopify).

## Local runs

- Unit tests

```bash
pnpm test
```

- Admin smoke against a local server

```bash
RBP_ADMIN_BASE_URL=http://localhost:<port> pnpm smoke:admin
```

- Mocked admin smoke (no server, no Shopify)

```bash
RBP_SMOKE_ADMIN_MOCK=1 pnpm smoke:admin
```

Notes:
- The CI uses Node 20 and pnpm with frozen lockfile.
- Mock mode prints lines prefixed with [mock] and exits 0.
<!-- END RBP GENERATED: ci-admin-tests-smoke -->
