/*
<!-- BEGIN RBP GENERATED: tenant-admin-harden -->
*/
/* <!-- BEGIN RBP GENERATED: tenant-admin-audit-proxy --> */
import { fetchProxy } from "./fetchProxy.server";
/* <!-- END RBP GENERATED: tenant-admin-audit-proxy --> */

export type AccessCtx = {
  tenant?: { domain?: string; plan?: string; vendors?: string[] };
  shopDomain?: string;
  plan?: string;
  vendors?: string[];
  roles?: string[];
  features?: Record<string, any>;
  flags?: Record<string, any>;
};

export async function getAccessCtx(): Promise<AccessCtx | null> {
  try {
  const res = await fetchProxy("/apps/proxy/api/access/ctx");
  return (await res.json()) as AccessCtx;
  } catch {
    return null;
  }
}
/*
<!-- END RBP GENERATED: tenant-admin-harden -->
*/
