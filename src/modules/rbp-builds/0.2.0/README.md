# rbp-builds v0.2.0 — QoL Panel

This module adds optional client-side quality-of-life actions for Builds:

- Duplicate build
- Reorder items (up/down)
- Clear items (with confirmation)
- Export to JSON / Import from JSON
- Toast notifications

Gating
- Entire UI is gated by registry flag `builds.qol.v1`. When false, the panel renders null.

Integration
- Render the default export `<BuildsQoLPanel />` inside your Builds page, passing:
  - `build`: the current build object `{ id, title, handle, items[] }`
  - `setActiveBuild(id: string)`: switch the active build after duplicate/import
  - `refreshBuilds()`: refetch builds list after mutations
- Include `<ToastHost />` somewhere once per page. The panel already renders one.

Contracts
- No server API changes. Uses existing endpoints:
  - POST `/apps/proxy/api/builds` to create (duplicate/import)
  - PATCH `/apps/proxy/api/builds/:id` to update items (reorder/clear)

Notes
- Optimistic updates with rollback are implemented for reorder/clear.
- Import validates JSON and minimal schema: `{ items: any[] }`.
