// <!-- BEGIN RBP GENERATED: mode-a -->
export type TenantInventoryMode = "rbp_hosted" | "tenant_shadow";

export function getTenantInventoryMode(tenantDomain?: string): TenantInventoryMode {
  // For now static; later read from Access ctx or settings
  return "rbp_hosted";
}
// <!-- END RBP GENERATED: mode-a -->
