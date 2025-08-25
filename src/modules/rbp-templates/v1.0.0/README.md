<!-- BEGIN RBP GENERATED: builds-templates-v1 -->
# rbp-templates v1.0.0

Storefront Template Presets grid that reads a local manifest and lets users preview and create a new Build from a selected template. No new server endpoints.

- Default export: `mount(rootEl)` from `index.js`
- Filters/Search/Sort persisted in URL query.
- "Use this template" creates a build via `/apps/proxy/api/builds`, dispatches `rbp:active-build`, and announces with aria-live.

Files are versioned under `src/modules/rbp-templates/v1.0.0/`.
<!-- END RBP GENERATED: builds-templates-v1 -->
