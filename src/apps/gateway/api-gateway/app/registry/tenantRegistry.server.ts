// <!-- BEGIN RBP GENERATED: proxy-registry-endpoint-v1-0 -->
import fs from 'node:fs/promises';
import path from 'node:path';

type ModuleVersion = { path: string };
type ModuleEntry = {
  enabled?: boolean | string;
  default?: string;
  latest?: string;
  versions?: Record<string, ModuleVersion>;
};

type Registry = { modules: Record<string, ModuleEntry> };

function normalizePath(p: string): string {
  try {
    const u = new URL(p);
    return u.pathname + (u.search || '');
  } catch {
    return p; // keep relative
  }
}

export async function getRegistryForTenant(tenant: string): Promise<Registry> {
  // Base registry from config file
  let reg: Registry = { modules: {} };
  try {
    const fp = path.resolve(process.cwd(), 'config/registry.json');
    const txt = await fs.readFile(fp, 'utf8');
    const parsed = JSON.parse(txt) as any;
    if (parsed && typeof parsed === 'object' && parsed.modules) reg.modules = parsed.modules;
  } catch {}

  const forced = process.env.REGISTRY_FORCE_SHELL === '1' || process.env.REGISTRY_FORCE_SHELL === 'true';
  const shellUrl = process.env.RBP_SHELL_URL ? normalizePath(process.env.RBP_SHELL_URL) : '';
  const pick = '0.2.0';

  const current = reg.modules['rbp-shell'] || {};
  const next: ModuleEntry = { ...current };

  if (shellUrl) {
    next.enabled = true;
    next.default = next.default || pick;
    next.versions = { ...(next.versions || {}), [next.default!]: { path: shellUrl } };
  } else if (forced) {
    // Ensure enabled but keep any existing path/version
    next.enabled = true;
    next.default = next.default || pick;
    if (!next.versions || !next.versions[next.default!]) {
      // Provide a safe relative fallback path under proxy modules
      next.versions = { ...(next.versions || {}), [next.default!]: { path: `/apps/proxy/modules/rbp-shell/${next.default}/index.js` } };
    }
  } else {
    // Respect config; if missing, set disabled with no versions
    if (!('enabled' in next)) next.enabled = false;
  }

  reg.modules['rbp-shell'] = next;
  return reg;
}
// <!-- END RBP GENERATED: proxy-registry-endpoint-v1-0 -->
