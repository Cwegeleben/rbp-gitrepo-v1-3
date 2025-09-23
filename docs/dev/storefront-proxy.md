# Storefront app proxy: dev notes

When fetching your gateway endpoints from the Shopify storefront (e.g. `/apps/proxy/registry.json`), remember the storefront password gate can intercept requests.

- If the storefront is password-protected, requests to `https://<shop>.myshopify.com/apps/proxy/...` will 302 to `/password` before they ever reach Fly. This often shows up as a failed JSON fetch in the browser and can look like a “500” in your app, even though the gateway never saw the request.
- On staging, the gateway bypass is enabled (`RBP_PROXY_BYPASS=1`), so unsigned requests that do reach it will return 200. Production remains strict 401 for unsigned.

## How to test

- Prefer testing against the Fly staging origin directly while developing: `https://rbp-rod-builder-pro-staging.fly.dev/apps/proxy/registry.json`.
- If you must test from the shop domain:
  - Temporarily disable the storefront password, or
  - Log in once to set the password cookie and then reload your page, or
  - Expect a 302 to `/password` and handle that in your theme code gracefully.

## Theme fetch tips

- Use relative paths like `/apps/proxy/registry.json` (don’t hardcode any tunnel/trycloudflare origin).
- Be resilient to non-200 responses and HTML payloads (password page). Example pattern:

```js
async function fetchRegistry() {
  const res = await fetch('/apps/proxy/registry.json', { cache: 'no-store' });
  if (!res.ok) {
    // If Shopify redirects to /password, res.ok is false and content-type is text/html
    return { ok: false, reason: 'storefront_password_or_unavailable' };
  }
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    return { ok: false, reason: 'unexpected_content_type' };
  }
  return res.json();
}
```

## Signed requests (local tooling)

- Use the helper to sign paths when needed:
  - `SHOPIFY_API_SECRET=... pnpm proxy:sign /apps/proxy/ping shop=<shop>.myshopify.com ts=$(date +%s)`
- Or programmatically via `scripts/smoke.ts` helpers.

## Quick check: are we hitting the gateway?

- Curl the shop domain path and inspect for a 302 to `/password`:
  - `curl -si https://<shop>.myshopify.com/apps/proxy/registry.json | head -n 10`
  - If you see `Location: .../password`, it did not reach the gateway.
- Curl the Fly origin to verify the gateway behavior directly:
  - `curl -si https://rbp-rod-builder-pro-staging.fly.dev/apps/proxy/registry.json`

## Housekeeping

- Remove any trycloudflare/tunnel preconnects from the theme to avoid stale origins.
- Keep proxy calls cache-busted or `no-store` during development.
