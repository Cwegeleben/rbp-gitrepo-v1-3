// <!-- BEGIN RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getTemplates } from "../libs/templates.server";
import { adapters } from "../libs/adapters.server";
import { normalizeSpecs } from "../libs/normalize.server";

export async function action(args: ActionFunctionArgs) {
  const { admin } = await authenticate.admin(args.request);
  const t = (await getTemplates(admin));
  if (!t) return json({ rows: [], warnings: ["No templates configured"] });
  let urls: string[] = [];
  let productTypeId: string | undefined;
  let supplierId: string | undefined;
  const ct = args.request.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await args.request.json().catch(() => ({}));
    urls = Array.isArray(body.urls) ? body.urls : [];
    productTypeId = body.productTypeId;
    supplierId = body.supplierId;
  } else {
    const fd = await args.request.formData();
    const u = fd.getAll("urls[]").map(String).filter(Boolean);
    urls = u.length ? u : [];
    productTypeId = String(fd.get("productTypeId") || "");
    supplierId = String(fd.get("supplierId") || "");
  }
  const override = t.supplierOverrides.find((o) => o.id === supplierId && o.productTypeId === productTypeId);
  const template = t.productTypes.find((p) => p.id === productTypeId);
  if (!override || !template) return json({ rows: [], warnings: ["Invalid productTypeId or supplierId"] });

  const rows: any[] = [];
  for (const url of urls) {
    const adapter = adapters.find((a) => a.canHandle(url)) || adapters[0];
    const raw = await adapter.fetchRaw(url);
    const items = await adapter.extractItems(raw, override);
    for (const it of items) {
      const { canonical, warnings } = normalizeSpecs(it.raw, template, override);
      rows.push({ raw: it.raw, mapped: canonical, warnings });
    }
  }
  return json({ rows });
}
// <!-- END RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
