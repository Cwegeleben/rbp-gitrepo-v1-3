// <!-- BEGIN RBP GENERATED: storefront-proxy-e2e-v1-0 -->
import { json } from "@remix-run/node";
import { enforce } from "../proxy/verify.server";

type ModuleToggle = {
  key: string;
  enabled: boolean;
  label?: string;
};

const modules: ModuleToggle[] = [
  { key: "addToBuild", enabled: true, label: "Add to Build" },
  { key: "packager", enabled: true, label: "Checkout Packager" },
];

export const loader = async ({ request }: { request: Request }) => {
  const block = await enforce(request);
  if (block) return block;
  return json({ ok: true, modules }, { headers: { "cache-control": "no-store" } });
};
// <!-- END RBP GENERATED: storefront-proxy-e2e-v1-0 -->
