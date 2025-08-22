<!-- BEGIN RBP GENERATED: inventory-commit-phase2 -->
# Orders Paid Commit (SOFT→HARD)

This phase converts SOFT reservations into HARD commits when Shopify sends the `orders/paid` webhook.

Key points:
- Idempotency key: `tenantDomain + orderId`. Repeated webhook deliveries are safe.
- Only RBP-sourced lines decrement RBP inventory; supplier lines are skipped here.
- `variantId` is propagated end-to-end; if missing but `sku` exists, it's resolved once via Admin and cached per request.
- On partial failure during decrements, previously applied decrements in this request are rolled back.

Environment required:
- RBP Admin API creds: `RBP_STORE_DOMAIN`, `RBP_ADMIN_TOKEN` (or compatible envs). Optional `RBP_SHOPIFY_API_VERSION`.

Local testing:
- Unit tests: `pnpm test -- orders.commit.test.ts`.
- Logs include a correlation id. Pass `x-correlation-id` header when invoking locally to trace.

What SOFT→HARD means:
- SOFT reservations are tentative holds created by the packager.
- HARD commits represent final inventory deductions upon payment. In this phase, we decrement availability at the RBP Shopify location and persist an `OrderCommit` record.

Artifacts:
- Webhook route: `src/apps/gateway/api-gateway/app/routes/apps.proxy.api.webhooks.orders.paid.ts`
- Commit engine: `src/apps/gateway/api-gateway/app/proxy/commit/orderCommit.server.ts`
- Plan helper: `src/apps/gateway/api-gateway/app/proxy/packager/plan.server.ts`
- Logger: `src/apps/gateway/api-gateway/app/proxy/logger.server.ts`
- Admin GraphQL helpers: `src/packages/shopify/admin.ts`

Inspecting logs:
- Look for messages starting with `orders.paid ...` and fields `{ tenant, orderId, correlationId }`.
<!-- END RBP GENERATED: inventory-commit-phase2 -->
