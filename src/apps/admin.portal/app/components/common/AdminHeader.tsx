/*
<!-- BEGIN RBP GENERATED: ui-polish-v1 -->
*/
import React from 'react';
import { LiveRegion, useLiveRegion } from '../../../../../packages/ui/live-region/LiveRegion';
// <!-- BEGIN RBP GENERATED: ui-polish-v1 -->
// Lightweight primitives aligned to Polaris spacing but without requiring AppProvider.
// <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
// Force safe fallbacks to avoid AppProvider in tests/stories.
const Button = (props: any) => <button {...props} />;
const Banner = ({ tone, children }: any) => (
  <div role="region" aria-label="Notice" style={{
    border: '1px solid #e5e7eb', padding: 8, borderRadius: 6,
    background: tone === 'success' ? '#ecfdf5' : tone === 'warning' ? '#fffbeb' : tone === 'critical' ? '#fef2f2' : '#eff6ff',
  }}>{children}</div>
);
const InlineStack = ({ children, align, gap }: any) => (
  <div style={{ display: 'inline-flex', gap: gap ? 8 : 6, alignItems: 'center', justifyContent: align === 'end' ? 'flex-end' : 'flex-start' }}>{children}</div>
);
// <!-- END RBP GENERATED: admin-acceptance-v1 -->
// <!-- END RBP GENERATED: ui-polish-v1 -->

/**
 * AdminHeader: standardized page header for admin portal.
 * Notes: We keep markup dependency-free but align structure with Polaris patterns.
 */
export type AdminHeaderProps = {
  title: string;
  subtitle?: string;
  primaryAction?: { label: string; onClick: () => void; tone?: 'primary' | 'secondary' };
  secondaryActions?: Array<{ label: string; onClick: () => void }>;
  banner?: { tone: 'success' | 'info' | 'warning' | 'critical'; content: string } | null;
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle, primaryAction, secondaryActions = [], banner }) => {
  const { announce } = useLiveRegion();

  React.useEffect(() => {
    // Announce title on mount/update for context changes
    if (title) announce(`${title}`);
  }, [title, announce]);

  // <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
  // Intentionally do not auto-announce subtitle to avoid noisy, duplicate updates.
  // Header actions will still announce on interaction.
  // <!-- END RBP GENERATED: admin-acceptance-v1 -->

  return (
    <header aria-label="Page header" style={{ display: 'grid', gap: 8, marginBottom: 12, background: '#fafafa' }}>
      {/* Shared live region (render once near root ideally). Safe to render here as well. */}
      <LiveRegion />

      {banner && (
        // <!-- BEGIN RBP GENERATED: ui-polish-v1 -->
        <Banner tone={banner.tone}>{banner.content}</Banner>
        // <!-- END RBP GENERATED: ui-polish-v1 -->
      )}

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0 }}>{title}</h1>
          {subtitle && <div style={{ color: '#6b7280', marginTop: 2 }}>{subtitle}</div>}
        </div>
        <InlineStack align="end" gap>
          {secondaryActions.map((a, i) => (
            <Button key={i} onClick={() => { a.onClick(); announce(`${a.label} activated`); }}>
              {a.label}
            </Button>
          ))}
          {primaryAction && (
            <Button
              variant="primary"
              onClick={() => { primaryAction.onClick(); announce(`${primaryAction.label} activated`); }}
            >
              {primaryAction.label}
            </Button>
          )}
        </InlineStack>
      </div>
    </header>
  );
};

export default AdminHeader;
/*
<!-- END RBP GENERATED: ui-polish-v1 -->
*/
