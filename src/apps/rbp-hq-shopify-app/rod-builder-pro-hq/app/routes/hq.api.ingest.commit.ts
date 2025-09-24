// <!-- BEGIN RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { createProduct } from "../libs/shopify-products.server";

export async function action(args: ActionFunctionArgs) {
  const { admin } = await authenticate.admin(args.request);
  let rows: any[] = [];
  const ct = args.request.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await args.request.json().catch(() => ({}));
    rows = Array.isArray(body.rows) ? body.rows : [];
  } else {
    const fd = await args.request.formData();
    const raw = String(fd.get("rows") || "[]");
    try { rows = JSON.parse(raw); } catch { rows = []; }
  }
  const created: string[] = [];
  for (const r of rows) {
    const canonical = r?.mapped || r?.canonical || {};
    try {
      const id = await createProduct(admin, { canonical, images: canonical.images, tags: canonical.tags });
      created.push(id);
    } catch (e) {
      console.error("createProduct failed", e);
    }
  }
  return json({ ok: true, created });
}
// <!-- END RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
