// <!-- BEGIN RBP GENERATED: AccessV2 -->
// Lazy-load Prisma to avoid bundling client browser shims
async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

export type AccessForUser = { roles: string[]; features: Record<string, boolean> };

export async function getAccessForUser(tenantId: string, userId: string | null): Promise<AccessForUser> {
  const prisma = await getPrisma();
  const roles: string[] = [];
  const features: Record<string, boolean> = {};

  // Roles
  if (userId) {
  const r = await (prisma as any).userRole.findMany({ where: { tenantId, userId } });
    for (const row of r) roles.push(String(row.role));
  }

  // Tenant base
  const tfa = await (prisma as any).tenantFeatureAllow.findMany({ where: { tenantId } });
  for (const row of tfa) features[row.featureKey] = !!row.enabled;

  // User overrides
  if (userId) {
  const ufa = await (prisma as any).userFeatureAllow.findMany({ where: { tenantId, userId } });
    for (const row of ufa) features[row.featureKey] = !!row.enabled;
  }

  return { roles, features };
}
// <!-- END RBP GENERATED: AccessV2 -->
