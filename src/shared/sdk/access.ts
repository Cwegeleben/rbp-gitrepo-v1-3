// <!-- BEGIN RBP GENERATED: AccessV2 -->
export type AccessCtx = {
  tenant: { domain: string; plan: string } & Record<string, any>;
  roles: string[];
  features: Record<string, boolean>;
};

export type AccessRule = string | string[];

export function mergeAllows(tenantAllows: Record<string, boolean>, userAllows?: Record<string, boolean>): Record<string, boolean> {
  const out: Record<string, boolean> = { ...(tenantAllows || {}) };
  for (const [k, v] of Object.entries(userAllows || {})) out[k] = !!v;
  return out;
}

export function canAccess(ctx: { roles?: string[]; features?: Record<string, boolean> } | null | undefined, rule: AccessRule): boolean {
  if (!ctx) return false;
  const roles = ctx.roles || [];
  if (roles.includes("RBP_ADMIN")) return true;
  const features = ctx.features || {};
  const keys = Array.isArray(rule) ? rule : [rule];
  return keys.every((k) => !!features[k]);
}
// <!-- END RBP GENERATED: AccessV2 -->
