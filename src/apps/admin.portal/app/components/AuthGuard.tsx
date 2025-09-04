/* <!-- BEGIN RBP GENERATED: admin-auth-guard-stories-v1 --> */
import React, { ReactNode, useContext } from "react";
import { TenantContext } from "../../TenantContext";

export type AuthGuardProps = {
  featureKey?: string; // optional feature or flag key to check in ctx
  loading?: boolean; // force loading state regardless of context
  fallback?: ReactNode; // render when denied
  children?: ReactNode; // render when allowed
  // Optional custom predicate for complex checks
  allowIf?: (ctx: any) => boolean;
};

function getBool(v: any): boolean {
  return v === true;
}

function resolveFeature(ctx: any, key?: string): boolean {
  if (!key) return true;
  // Support nested "a:b" lookups in ctx.features[a][b]
  if (key.includes(":")) {
    const [a, b] = key.split(":");
    return getBool(ctx?.features?.[a]?.[b]);
  }
  // Try flat features map or flags
  return getBool(ctx?.features?.[key]) || getBool(ctx?.flags?.[key]);
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ featureKey, loading, fallback, children, allowIf }) => {
  const ctx = useContext(TenantContext);
  const isLoading = loading || ctx == null;
  if (isLoading) {
    return (<div role="status" aria-live="polite" style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Checking access…</div>
      <div style={{ background: "#f3f4f6", height: 8, borderRadius: 4, margin: "6px 0" }} />
      <div style={{ background: "#f3f4f6", height: 8, borderRadius: 4, margin: "6px 0", width: "80%" }} />
      <div style={{ background: "#f3f4f6", height: 8, borderRadius: 4, margin: "6px 0", width: "60%" }} />
    </div>);
  }
  const allowed = allowIf ? !!allowIf(ctx) : resolveFeature(ctx, featureKey);
  if (!allowed) {
    return (<div role="note" style={{ padding: 12, border: "1px solid #fbbf24", background: "#fffbeb", color: "#92400e", borderRadius: 8 }}>
      {fallback || <p>You don’t have access to this section.</p>}
    </div>);
  }
  return <>{children}</>;
};

export default AuthGuard;
/* <!-- END RBP GENERATED: admin-auth-guard-stories-v1 --> */
