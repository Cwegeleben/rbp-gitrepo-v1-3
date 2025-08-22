<!-- BEGIN RBP GENERATED: structure -->
# Project Structure

## Preflight

The preflight script validates your repo before builds and CI. It checks:
- Required directories: `srcRoot`, `cfgDir`, `modulesDir` (no `/src/src`)
- Modules: `rbp-shell`, `rbp-catalog`, `rbp-builds` present and not empty
- Theme extension: source folders and files exist, not just bundle outputs
- App proxy config: `[app_proxy] prefix="apps" subpath="proxy"` in `shopify.app.toml`
- Proxy routes: `apps.proxy.ping.ts`, `apps.proxy.$.ts` exist
- Gateway shim import resolves
- Ghost storefront theme path (should not exist)
- Double `src/src` path detection

### How to Run
- Local: `pnpm preflight`
- CI/Strict: `pnpm preflight:strict` (exits 1 if any WARN/ERROR)

### Strict Mode
In strict mode, any WARN (⚠️) or ERROR (❌) will fail the script (exit code 1). Use for CI to enforce repo hygiene.

### Common WARNs & Fixes
- **Missing config/**: Create with `mkdir -p config`
- **Theme source missing, bundle present**: Restore files under `extensions/rbp-theme/blocks` and `assets`, avoid editing `.shopify/*bundle/*`
- **Double src/src**: Check your path resolution logic and canonical paths
- **Ghost storefront theme path**: Remove or relocate `src/apps/storefront/rbp-theme` to the correct extension location

Output is terse, one bullet per line. All checks passing yields only ✅ lines.
<!-- END RBP GENERATED: structure -->

<!-- BEGIN RBP GENERATED: structure-diagnostics -->
**Diagnostics:** `/apps/proxy/doctor` returns `{ ok, path, queryKeys, verified }` for quick proxy checks.
HMAC is non-blocking here by design; harden the catch-all later.
<!-- END RBP GENERATED: structure-diagnostics -->
