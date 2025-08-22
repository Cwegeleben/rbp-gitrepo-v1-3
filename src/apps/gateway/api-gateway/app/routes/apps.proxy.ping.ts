// <!-- BEGIN RBP GENERATED -->
import { json } from '@remix-run/node';
import { enforce } from "../proxy/verify.server";

export const loader = async ({ request }: { request: Request }) => {
  const block = await enforce(request);
  if (block) return block;
  // <!-- BEGIN RBP GENERATED: no-store-headers -->
  return json({ ok: true }, { headers: { "cache-control": "no-store" } });
  // <!-- END RBP GENERATED: no-store-headers -->
};
// <!-- END RBP GENERATED -->
