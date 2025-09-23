// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import React from 'react';
import { LiveRegion } from '../../../../../packages/ui/live-region/LiveRegion';

export const HQHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  React.useEffect(() => { LiveRegion.announce(title); }, [title]);
  return (
    <header style={{ padding: 16, borderBottom: '1px solid #eee', background: '#fff' }}>
      <h1 style={{ margin: 0, fontSize: 20 }}>{title}</h1>
      {subtitle ? <p style={{ margin: 0, color: '#555' }}>{subtitle}</p> : null}
    </header>
  );
};
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
