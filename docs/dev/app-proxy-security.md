# App Proxy Security: HMAC Everywhere (Strict)

All `/apps/proxy/*` routes in the API Gateway now enforce an HMAC signature.

- Canonical string: `pathname + '?' + query` excluding `signature`.
- Algorithm: HMAC-SHA256 in hex using `SHOPIFY_API_SECRET`.
- Optional timestamp skew: enable by setting `RBP_PROXY_HMAC_REQUIRE_TS=1`; control skew via `RBP_PROXY_HMAC_MAX_SKEW_SECONDS` (default 300 seconds).
- Dev/test bypass: `RBP_PROXY_HMAC_BYPASS=1` allows unsigned requests during local testing.

## Signing locally

- Use the helper: `SHOPIFY_API_SECRET=... pnpm proxy:sign /apps/proxy/ping shop=myshop.myshopify.com ts=1690000000`.
- The script returns a full path with `signature=...` appended. Curl with your dev server host prefixed.

## Behavior on failure

- Routes return `401` JSON: `{ ok:false, code:"UNAUTHORIZED_PROXY_REQUEST", reason }`.

## Notes

- `getTenantFromRequest()` still derives the tenant from `?shop`, `x-shopify-shop-domain` header, or fallback env `RBP_SHOP_DOMAIN`. The `verified` flag reflects HMAC status and reason.
- Apply `enforce(request)` at the top of new proxy routes to keep protection consistent.
