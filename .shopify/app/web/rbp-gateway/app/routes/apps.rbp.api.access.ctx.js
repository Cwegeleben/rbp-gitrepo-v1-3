import { json } from "@remix-run/node";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function loader({ request }) {
  const url = new URL(request.url);
  const domain = url.searchParams.get("domain") || process.env.RBP_STORE_DOMAIN || "demo.myshopify.com";
  const root = process.cwd();
  const tenantsPath = join(root, "src", "config", "tenants.json");
  const flagsPath = join(root, "src", "config", "flags.json");

  const [tenantsRaw, flagsRaw] = await Promise.all([
    readFile(tenantsPath, "utf8"),
    readFile(flagsPath, "utf8")
  ]);

  const tenants = JSON.parse(tenantsRaw);
  const flags = JSON.parse(flagsRaw);
  const tenant = tenants.find(t => t.domain === domain);
  if (!tenant) return new Response("TENANT_NOT_FOUND", { status: 404 });

  const ctx = { tenant, ts: new Date().toISOString(), flags };
  return json(ctx);
}
