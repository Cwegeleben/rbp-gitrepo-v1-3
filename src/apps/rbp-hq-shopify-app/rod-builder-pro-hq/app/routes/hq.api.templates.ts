// <!-- BEGIN RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { ensureSeedTemplates, getTemplates, saveTemplates, seedTemplates, type SpecTemplates } from "../libs/templates.server";

export async function loader(args: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(args.request);
  const t = (await getTemplates(admin)) || (await ensureSeedTemplates(admin));
  return json({ templates: t });
}

export async function action(args: ActionFunctionArgs) {
  const { admin } = await authenticate.admin(args.request);
  const body = await args.request.json().catch(() => ({}));
  let templates: SpecTemplates | null = null;
  if (body && body.templates) templates = body.templates as SpecTemplates;
  if (!templates) templates = seedTemplates();
  await saveTemplates(admin, templates);
  return json({ ok: true });
}
// <!-- END RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
