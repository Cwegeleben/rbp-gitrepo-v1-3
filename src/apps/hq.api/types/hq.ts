// AUTO-GENERATED from docs/openapi/hq.v0.yml. Do not edit by hand.

// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->

export interface Module {
  id: string;
  key: string;
  name: string;
  enabledByDefault: boolean;
}
export interface TenantModules {
  tenantId: string;
  modules: Module[];
}
export interface Component {
  id: string;
  type: string;
  name: string;
}
export interface CatalogMaster {
  components: Component[];
  updatedAt: string;
}
export interface Rule {
  condition: string;
  value: number;
}
export interface PricingBook {
  id: string;
  name: string;
  currency: string;
  rules: Rule[];
}
export interface Usage {
  tenantId: string;
  period: string;
  counters: { [key: string]: number };
}
export type ModulesResponse = Module[];
export type TenantModulesResponse = TenantModules;
export type CatalogMasterResponse = CatalogMaster;
export type PricingBookResponse = PricingBook;
export type UsageResponse = Usage;
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->

