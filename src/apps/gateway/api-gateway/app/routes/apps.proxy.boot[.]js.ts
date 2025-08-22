/**
 * Shopify theme snippet:
 * <script src="{{ shop.url }}/apps/proxy/boot.js"></script>
 * Paste this into your theme file to load the bootstrap.
 */
// type-only import avoided for compat

export async function loader({ request }: any) {
  const js = `
(async function() {
  try {
    const status = { ok: false, error: null, modules: [], ts: Date.now() };
    window.__RBP_BOOT_STATUS__ = status;
    // Fetch tenant context
    let ctx;
    try {
      const ctxRes = await fetch('/apps/proxy/api/access/ctx');
      if (!ctxRes.ok) throw new Error('ctx fetch failed: ' + ctxRes.status);
      ctx = await ctxRes.json();
    } catch (e) {
      status.error = 'Failed to fetch ctx: ' + (e?.message || e);
      console.error('[RBP_BOOT] ctx error', e);
      return;
    }
    // Fetch registry
    let registry;
    try {
      const regRes = await fetch('/apps/proxy/modules/registry.json');
      if (!regRes.ok) throw new Error('registry fetch failed: ' + regRes.status);
      registry = await regRes.json();
    } catch (e) {
      status.error = 'Failed to fetch registry: ' + (e?.message || e);
      console.error('[RBP_BOOT] registry error', e);
      return;
    }
    if (!registry?.modules || typeof registry.modules !== 'object') {
      status.error = 'Malformed registry';
      console.error('[RBP_BOOT] malformed registry', registry);
      return;
    }
    // Load modules (filtered by access features)
    for (const [name, info] of Object.entries(registry.modules)) {
      if (!info?.enabled) continue;
  // <!-- BEGIN RBP GENERATED: AccessV2 -->
  if (!ctx || !ctx.features || !ctx.features['module:' + name]) {
        continue;
      }
      // <!-- END RBP GENERATED: AccessV2 -->
      const v = info.v;
      const moduleUrl = `/apps/proxy/modules/${name}/${v}/index.js`;
      try {
        const mod = await import(moduleUrl);
        if (typeof mod.default === 'function') {
          mod.default(ctx);
          status.modules.push(name);
        }
      } catch (e) {
        console.error(`[RBP_BOOT] Failed to load module ${name} from ${moduleUrl}`, e);
      }
    }
    status.ok = true;
    status.ts = Date.now();
  } catch (e) {
    window.__RBP_BOOT_STATUS__ = { ok: false, error: e?.message || e, modules: [], ts: Date.now() };
    console.error('[RBP_BOOT] bootstrap error', e);
  }
})();
  `;
  return new Response(js, {
    headers: {
      "content-type": "application/javascript",
      "cache-control": "no-store"
    }
  });
}
