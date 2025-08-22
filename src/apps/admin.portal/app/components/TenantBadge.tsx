/*
<!-- BEGIN RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
import React, { useContext, useEffect, useRef } from 'react';
import { TenantContext } from '../../TenantContext';

export type TenantBadgeProps = {
  domain?: string;
  plan?: string;
  showDevChip?: boolean;
  isLoading?: boolean;
  error?: string | null;
};

export const TenantBadge: React.FC<TenantBadgeProps> = (props) => {
  const ctx = useContext(TenantContext);
  const loading = props.isLoading;
  const error = props.error;
  const domain = props.domain ?? ctx?.shopDomain;
  const plan = props.plan ?? (ctx?.plan || ctx?.tenant?.plan);
  const showDev = props.showDevChip ?? (ctx?.flags?.showDevTools === true);

  const alertRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (error && alertRef.current) {
      alertRef.current.focus();
    }
  }, [error]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {loading ? (
        <div aria-live="polite" role="status" style={{ fontSize: 12, color: '#666' }}>Loading tenant…</div>
      ) : error ? (
        <div
          ref={alertRef}
          tabIndex={-1}
          role="alert"
          aria-atomic
          style={{ fontSize: 12, color: '#b00020', outline: 'none' }}
        >
          {error}
        </div>
      ) : (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              padding: '4px 8px',
              borderRadius: 999,
              background: '#eef2ff',
              color: '#1e40af',
              fontWeight: 600,
              fontSize: 12,
            }}
            aria-label={`Tenant ${domain || 'unknown'}`}
          >
            {domain || '—'}
          </span>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: 6,
              background: '#f1f5f9',
              color: '#334155',
              fontSize: 11,
              border: '1px solid #e2e8f0',
            }}
            aria-label={`Plan ${plan || 'unknown'}`}
          >
            {plan || '—'}
          </span>
          {showDev && (
            <span
              style={{
                padding: '2px 6px',
                borderRadius: 6,
                background: '#fff7ed',
                color: '#9a3412',
                fontSize: 11,
                border: '1px solid #fed7aa',
              }}
              title="Developer tools enabled"
            >
              DEV
            </span>
          )}
        </div>
      )}
    </div>
  );
};
/*
<!-- END RBP GENERATED: tenant-admin-dashboard-v1 -->
*/
