// <!-- BEGIN RBP GENERATED: registry-health-v1 -->
import { json } from "@remix-run/node";
import fs from "node:fs/promises";
import path from "node:path";
import { enforce } from "../proxy/verify.server";
import { cfgDir } from "../lib/paths.server";
import { checkRegistryHealth } from "../proxy/modules/health.server";

export const loader = async ({ request }: { request: Request }) => {
  const block = await enforce(request);
  if (block) return block;

  const url = new URL(request.url);
  const full = url.searchParams.get("full") === "1";
  const fsCheck = process.env.RBP_SKIP_FS_HEALTH ? false : true;

  try {
    const p = path.join(cfgDir, "registry.json");
    const raw = await fs.readFile(p, "utf8");
    const registry = JSON.parse(raw);
    const origin = `${url.protocol}//${url.host}`;
    const health = await checkRegistryHealth(registry, { fsCheck, origin });

    const body = full
      ? health
      : {
          ok: health.ok,
          errors: health.errors,
          modules: Object.fromEntries(
            Object.entries(health.modules).map(([name, mh]) => {
              // strip versions map by default
              const { versions: _omit, ...rest } = mh;
              return [name, rest];
            })
          ),
        };

    return json(body, { headers: { "cache-control": "no-store" } });
  } catch (e: any) {
    return json(
      { ok: false, code: "INTERNAL", message: e?.message ?? "unexpected" },
      { status: 500, headers: { "cache-control": "no-store" } }
    );
  }
};
// <!-- END RBP GENERATED: registry-health-v1 -->
