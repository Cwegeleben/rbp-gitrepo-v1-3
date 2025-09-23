// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import React from 'react';
import { Link } from 'react-router-dom';
import { HQHeader } from '../components/hq/HQHeader';

export default function HQIndex() {
  return (
    <div>
      <HQHeader title="RBP HQ" subtitle="Control plane" />
      <nav style={{ padding: 16, display: 'grid', gap: 8 }}>
        <Link to="/hq/modules">Modules</Link>
        <Link to="/hq/tenants">Tenants</Link>
        <Link to="/hq/catalog">Catalog</Link>
        <Link to="/hq/pricing">Pricing</Link>
      </nav>
    </div>
  );
}
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
