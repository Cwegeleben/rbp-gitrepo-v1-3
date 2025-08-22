<!-- BEGIN RBP GENERATED: packager-v2 -->
# Packager v2

Enhancements to `/apps/proxy/api/checkout/package`:

- Adds `meta.totals` object with `{ subtotal, estTax?, total, currency }`.
- Adds `hints[]` array for recoverable issues.

Semantics
- `ok: true` responses may include `hints` such as `MISSING_VARIANT` when some lines could not resolve a variantId. Packaging continues for others.
- Totals are derived from line prices when present in the plan/build items. If no prices are available, `subtotal=0` and a `NO_PRICE` hint is emitted.
- Internal errors return `ok: false` with `code` and `message` and HTTP 500.

UI guidance
- Show a lightweight callout when `hints` contains `MISSING_VARIANT`; list SKUs.
- Render a read-only "Package Summary" using `meta.totals`.

Backward compatibility
- Existing consumers can ignore `meta` and `hints`. No existing keys were removed.
<!-- END RBP GENERATED: packager-v2 -->