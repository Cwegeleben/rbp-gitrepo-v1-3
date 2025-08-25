// <!-- BEGIN RBP GENERATED: registry-health-v1 -->
import { stat as fsStat } from "node:fs/promises";
import path from "node:path";
import { modulesDir } from "../../lib/paths.server";

type AnyRegistry = Record<string, any> & {
  modules?: Record<string, any>;
};

export type HealthErrorCode = "WRONG_PREFIX" | "CROSS_ORIGIN" | "MISSING_FILE";

export type VersionHealth = {
  ok: boolean;
  path: string;
  pathPrefixOk: boolean;
  sameOriginOk: boolean;
  fileExists?: boolean;
};

export type ModuleHealth = {
  ok: boolean;
  version?: string | null;
  default?: string | null;
  path?: string | null;
  pathPrefixOk: boolean;
  sameOriginOk: boolean;
  fileExists?: boolean;
  versions?: Record<string, VersionHealth>;
};

export type RegistryHealth = {
  ok: boolean;
  modules: Record<string, ModuleHealth>;
  errors: Array<{ code: HealthErrorCode; module: string; version?: string; path: string; message?: string }>;
};

function isProxyPath(p?: string | null): boolean {
  return typeof p === "string" && p.startsWith("/apps/proxy/");
}

function sameOriginOkForPath(p: string | null | undefined, origin: URL): boolean {
  if (!p || typeof p !== "string") return false;
  if (p.startsWith("http://") || p.startsWith("https://")) {
    try {
      const u = new URL(p);
      return u.host === origin.host; // allow absolute same-origin, reject cross-origin
    } catch {
      return false;
    }
  }
  // relative paths are considered same-origin
  return true;
}

function toDiskPath(p: string): string | null {
  // Maps a proxy path like /apps/proxy/modules/<name>/<version>/index.js
  // to the repo modules dir: <modulesDir>/<name>/<version>/index.js
  const prefix = "/apps/proxy/modules/";
  if (!p.startsWith(prefix)) return null;
  const rest = p.slice(prefix.length); // <name>/<version>/index.js
  return path.resolve(modulesDir, rest);
}

async function fileExists(p: string): Promise<boolean> {
  try {
    const st = await fsStat(p);
    return st.isFile();
  } catch {
    return false;
  }
}

export async function checkRegistryHealth(registry: AnyRegistry, opts: { fsCheck: boolean; origin: string }): Promise<RegistryHealth> {
  const originUrl = new URL(opts.origin);
  const out: RegistryHealth = { ok: true, modules: {}, errors: [] };
  const modules = registry?.modules || {};

  for (const [name, info] of Object.entries<any>(modules)) {
    const ver: string | null = info?.version ?? info?.default ?? null;
    const p: string | null = info?.path ?? null;
    const prefixOk = isProxyPath(p || undefined);
    const originOk = sameOriginOkForPath(p, originUrl);
    let exists: boolean | undefined = undefined;
    if (opts.fsCheck && typeof p === "string") {
      const disk = toDiskPath(p);
      exists = disk ? await fileExists(disk) : false;
    }

    const moduleHealth: ModuleHealth = {
      ok: Boolean(prefixOk && originOk && (exists !== false)),
      version: ver,
      default: info?.default ?? null,
      path: p,
      pathPrefixOk: prefixOk,
      sameOriginOk: originOk,
      fileExists: exists,
    };

    if (!prefixOk) out.errors.push({ code: "WRONG_PREFIX", module: name, path: p || "", message: "path must start with /apps/proxy/" });
    if (!originOk) out.errors.push({ code: "CROSS_ORIGIN", module: name, path: p || "", message: "path must be same-origin or relative" });
    if (opts.fsCheck && exists === false) out.errors.push({ code: "MISSING_FILE", module: name, path: p || "", message: "file not found on disk" });

    // Per-version checks (full detail)
    const versions: Record<string, { path: string }> = info?.versions || {};
    if (versions && typeof versions === "object") {
      moduleHealth.versions = {};
      for (const [v, vInfo] of Object.entries<any>(versions)) {
        const vp: string = vInfo?.path;
        const vPrefixOk = isProxyPath(vp);
        const vOriginOk = sameOriginOkForPath(vp, originUrl);
        let vExists: boolean | undefined = undefined;
        if (opts.fsCheck && typeof vp === "string") {
          const disk = toDiskPath(vp);
          vExists = disk ? await fileExists(disk) : false;
        }
        moduleHealth.versions[v] = {
          ok: Boolean(vPrefixOk && vOriginOk && (vExists !== false)),
          path: vp,
          pathPrefixOk: vPrefixOk,
          sameOriginOk: vOriginOk,
          fileExists: vExists,
        };
        if (!vPrefixOk) out.errors.push({ code: "WRONG_PREFIX", module: name, version: v, path: vp, message: "version path must start with /apps/proxy/" });
        if (!vOriginOk) out.errors.push({ code: "CROSS_ORIGIN", module: name, version: v, path: vp, message: "version path must be same-origin or relative" });
        if (opts.fsCheck && vExists === false) out.errors.push({ code: "MISSING_FILE", module: name, version: v, path: vp, message: "version file not found on disk" });
      }
    }

    out.modules[name] = moduleHealth;
  }

  // overall ok if no errors
  out.ok = out.errors.length === 0;
  return out;
}
// <!-- END RBP GENERATED: registry-health-v1 -->
