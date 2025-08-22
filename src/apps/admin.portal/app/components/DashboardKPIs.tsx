/*
<!-- BEGIN RBP GENERATED: tenant-admin-ui-visibility -->
*/
import React, { useEffect, useState } from 'react';
import { KpiTile, KpiTone } from '../../KpiTile';
import { ui } from '../../uiStrings';
import { fetchProxy } from '../../fetchProxy.server';
import { createPackagerApi } from '../lib/createPackagerApi';

export type KPIStatus = 'green' | 'amber' | 'red';

function mapPackageStatus(res: { ok: boolean; hints?: any[] }): { tone: KpiTone; subtext?: string; ok: boolean } {
  if (!res || res.ok === false) return { tone: 'red', subtext: ui.dashboard?.package?.error || 'Error', ok: false };
  const hintsCount = Array.isArray(res.hints) ? res.hints.length : 0;
  if (hintsCount > 0) return { tone: 'amber', subtext: (ui.dashboard?.package?.hints?.(hintsCount) || `${hintsCount} hints`), ok: true };
  return { tone: 'green', subtext: ui.dashboard?.package?.ok || 'OK', ok: true };
}

export const DashboardKPIs: React.FC = () => {
  const [buildsCount, setBuildsCount] = useState<number | null>(null);
  const [catalogCount, setCatalogCount] = useState<number | null>(null);
  const [pkg, setPkg] = useState<{ ok: boolean; hints?: any[]; meta?: any; code?: string } | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [buildsRes, catalogRes, pkgRes] = await Promise.all([
          fetchProxy('/apps/proxy/api/builds?limit=1'),
          fetchProxy('/apps/proxy/api/catalog/products?cursor='),
          (async () => {
            const api = createPackagerApi();
            return await api.packageDryRun();
          })(),
        ]);
        // builds
        try {
          const buildsJson = await buildsRes.json();
          const bCount = buildsJson?.pageInfo?.total ?? (Array.isArray(buildsJson?.items) ? buildsJson.items.length : 0);
          if (alive) setBuildsCount(typeof bCount === 'number' ? bCount : 0);
        } catch { if (alive) setBuildsCount(0); }
        // catalog
        try {
          const catJson = await catalogRes.json();
          const cCount = catJson?.pageInfo?.total ?? (Array.isArray(catJson?.items) ? catJson.items.length : 0);
          if (alive) setCatalogCount(typeof cCount === 'number' ? cCount : 0);
        } catch { if (alive) setCatalogCount(0); }
        // package
        if (alive) setPkg(pkgRes as any);
      } catch {
        if (alive) {
          setBuildsCount(0);
          setCatalogCount(0);
          setPkg({ ok: false, code: 'FETCH_FAILED' });
        }
      }
    })();
    return () => { alive = false; };
  }, []);

  const pkgMap = pkg ? mapPackageStatus(pkg) : { tone: 'red' as KpiTone, subtext: ui.dashboard?.package?.error, ok: false };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
      <KpiTile label={ui.dashboard?.kpis?.builds || 'Builds'} value={buildsCount ?? '—'} />
      <KpiTile label={ui.dashboard?.kpis?.catalog || 'Catalog'} value={catalogCount ?? '—'} />
      <KpiTile label={ui.dashboard?.kpis?.pkg || 'Package'} value={pkgMap.ok ? (pkg?.meta?.totals?.total != null ? `$${(pkg.meta.totals.total as number).toFixed(2)}` : ui.dashboard?.package?.ok || 'OK') : (pkg?.code || 'Error')} subtext={pkgMap.subtext} tone={pkgMap.tone} />
    </div>
  );
};

export const __testables = { mapPackageStatus };
/*
<!-- END RBP GENERATED: tenant-admin-ui-visibility -->
*/
