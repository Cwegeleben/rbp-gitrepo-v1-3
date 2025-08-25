<!-- BEGIN RBP GENERATED: builds-gallery-v1 -->
# rbp-builds-gallery v1.0.0 — Storefront Gallery

UI-only module listing saved builds with search, sort, view toggle and actions: Open, Duplicate, Delete, Export, Share.

Contract: default export is a function `mount(rootEl)` that renders the gallery.

Events:
- Open → dispatches `rbp:active-build` and updates `?buildId=` in the URL.
- Share → emits `rbp:share:open { buildId }`; if unhandled, falls back to `/apps/rbp/api/share/mint` and copies link.
- Compatible with existing `rbp:build-updated`, `rbp:part-selected`.

No server changes. Uses existing Builds endpoints.
<!-- END RBP GENERATED: builds-gallery-v1 -->