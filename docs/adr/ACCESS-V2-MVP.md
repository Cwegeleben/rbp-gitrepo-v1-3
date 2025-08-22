<!-- BEGIN RBP GENERATED: AccessV2 -->
# ADR: Access V2 (RBAC + Allowlist, MVP)

Status: Proposed, additive. No breaking changes.

Scope:
- Prisma: Role enum + UserRole, TenantFeatureAllow, UserFeatureAllow, AccessFeature (optional)
- Server helpers: getAccessForUser, requireAccess
- Access ctx endpoint extended to include roles/features
- Route guards for checkout.package and builds.$id
- Admin UI route to toggle tenant features
- Client SDK: getCtx() returns roles/features; canAccess helper
- UI modules hide/disable gated controls

Post-setup:
- pnpm install
- pnpm prisma generate (implicit via prisma)
- pnpm db:migrate
- pnpm db:seed
- pnpm dev:up

Acceptance checklist:
- [ ] /apps/proxy/api/access/ctx returns roles/features
- [ ] checkout.package returns 403 when feature disabled
- [ ] Admin UI at /apps/gateway/admin/access/:tenant toggles features
- [ ] Demo tenant seeded with basic features enabled
- [ ] RBP_ADMIN bypass works when userId has role

Notes:
- All new code is wrapped in AccessV2 sentinels for easy diffing.
<!-- END RBP GENERATED: AccessV2 -->
