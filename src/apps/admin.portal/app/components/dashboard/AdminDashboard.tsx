/*
<!-- BEGIN RBP GENERATED: admin-dashboard-v1 -->
*/
import React, { useEffect, useMemo, useState } from 'react';
import ShopHostLink from '../../components/ShopHostLink';
import { useShopHostNavigate } from '../../hooks/useShopHostNavigate';
import { fetchProxy } from '../../../fetchProxy.server';
import RegistryHealth from '../../components/RegistryHealth';
import { ErrorBanner } from '../../components/ErrorBanner';

type BuildRow = { id: string; title?: string; customer?: string; updatedAt?: string; status?: string; total?: number };
type Health = React.ComponentProps<typeof RegistryHealth>["data"];

function fmtDate(ts?: string) {
  if (!ts) return '—';
  try { return new Date(ts).toLocaleString(); } catch { return ts; }
}

const isProd = process.env.NODE_ENV === 'production';
function debug(...args: any[]) { if (!isProd && typeof console !== 'undefined') console.debug('[AdminDashboard]', ...args); }

export const AdminDashboard: React.FC = () => {
  const nav = useShopHostNavigate();
  const [loading, setLoading] = useState({ today: true, queue: true, system: true });
  const [errors, setErrors] = useState<string[]>([]);

  // Today at a glance
  const [ordersToday, setOrdersToday] = useState<number | null>(null);
  const [activeBuilds, setActiveBuilds] = useState<number | null>(null);
  const [disabledCatalog, setDisabledCatalog] = useState<number | null>(null);

  // Queues (top 5 in-progress)
  const [queue, setQueue] = useState<BuildRow[] | null>(null);

  // System
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    let alive = true;
    // Today at a glance
    (async () => {
      try {
        const [buildsRes, disabledRes, ordersRes] = await Promise.all([
          // Reads total builds; when status filter supported server-side, update accordingly if needed
          fetchProxy('/apps/proxy/api/builds?cursor='),
          // Best-effort: ask for disabled only; if server ignores, we'll still get a total
          fetchProxy('/apps/proxy/api/catalog/products?enabled=false&cursor='),
          // Orders today endpoint may not exist; tolerate failure and surface in banner
          fetchProxy('/apps/proxy/api/orders?date=today&countOnly=1'),
        ]);
        try {
          const b = await buildsRes.json();
          const n = b?.pageInfo?.total ?? (Array.isArray(b?.items) ? b.items.length : 0);
          if (alive) setActiveBuilds(typeof n === 'number' ? n : 0);
        } catch { if (alive) setActiveBuilds(0); }
        try {
          const d = await disabledRes.json();
          const n = d?.pageInfo?.total ?? d?.count ?? 0;
          if (alive) setDisabledCatalog(typeof n === 'number' ? n : 0);
        } catch { if (alive) setDisabledCatalog(0); }
        try {
          const o = await ordersRes.json();
          const n = o?.count ?? o?.pageInfo?.total ?? 0;
          if (alive) setOrdersToday(typeof n === 'number' ? n : 0);
        } catch { if (alive) setOrdersToday(0); }
      } catch (e: any) {
        debug('today fetch failed', e?.message || e);
        if (alive) setErrors((prev) => prev.concat('Failed to load today-at-a-glance'));
        if (alive) {
          setActiveBuilds(0); setDisabledCatalog(0); setOrdersToday(0);
        }
      } finally {
        if (alive) setLoading((s) => ({ ...s, today: false }));
      }
    })();

    // Queue
    (async () => {
      try {
        const r = await fetchProxy('/apps/proxy/api/builds?status=in_progress&limit=5');
        const j = await r.json();
        const rows: BuildRow[] = (j?.items || []).map((it: any) => ({
          id: it.id,
          title: it.title || it.id,
          customer: it.customer || it?.meta?.customerName || '—',
          updatedAt: it.updatedAt || it.modifiedAt || it.createdAt,
          status: it.status || 'in_progress',
          total: it.total ?? it?.meta?.totals?.total,
        }));
        if (alive) setQueue(rows);
      } catch (e: any) {
        debug('queue fetch failed', e?.message || e);
        if (alive) setErrors((prev) => prev.concat('Failed to load builds queue'));
        if (alive) setQueue([]);
      } finally {
        if (alive) setLoading((s) => ({ ...s, queue: false }));
      }
    })();

    // System
    (async () => {
      try {
        const r = await fetchProxy('/apps/proxy/modules/health');
        const j = await r.json();
        if (alive) setHealth(j as Health);
      } catch (e: any) {
        debug('health fetch failed', e?.message || e);
        if (alive) setErrors((prev) => prev.concat('Failed to load registry health'));
        if (alive) setHealth({ ok: false, modules: {}, errors: [] } as any);
      } finally {
        if (alive) setLoading((s) => ({ ...s, system: false }));
      }
    })();

    return () => { alive = false; };
  }, []);

  const hasError = errors.length > 0;

  return (
    <main aria-labelledby="admin-dashboard-title" className="grid gap-4">
      <h1 id="admin-dashboard-title" className="text-xl font-semibold">Dashboard</h1>

      {hasError && (
        <ErrorBanner message={`Some data failed to load. ${errors.join(' • ')}`}/>
      )}

      {/* Today at a glance */}
      <section aria-labelledby="today-title" className="grid gap-2">
        <h2 id="today-title" className="text-base font-semibold">Today at a glance</h2>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <Card title="Orders today" loading={loading.today} value={ordersToday} />
          <Card title="Active builds" loading={loading.today} value={activeBuilds} action={<ShopHostLink as="a" to="/app/builds">View builds</ShopHostLink>} />
          <Card title="Disabled catalog items" loading={loading.today} value={disabledCatalog} />
        </div>
      </section>

      {/* Queues */}
      <section aria-labelledby="queues-title" className="grid gap-2">
        <h2 id="queues-title" className="text-base font-semibold">Queues</h2>
        <div className="rounded border border-slate-200 bg-white">
          {loading.queue ? (
            <div className="p-3 text-sm text-slate-500">Loading…</div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th scope="col" className="px-2 py-1">#</th>
                    <th scope="col" className="px-2 py-1">Customer</th>
                    <th scope="col" className="px-2 py-1">Updated</th>
                    <th scope="col" className="px-2 py-1">Status</th>
                    <th scope="col" className="px-2 py-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(queue || []).length === 0 && (
                    <tr><td colSpan={5} className="px-2 py-2 text-slate-500">No in-progress builds.</td></tr>
                  )}
                  {(queue || []).map((r) => (
                    <tr key={r.id} className="border-t border-slate-100">
                      <td className="px-2 py-2"><ShopHostLink as="a" to={`/app/builds/${r.id}`}>{r.title || r.id}</ShopHostLink></td>
                      <td className="px-2 py-2">{r.customer || '—'}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{fmtDate(r.updatedAt)}</td>
                      <td className="px-2 py-2">{r.status || '—'}</td>
                      <td className="px-2 py-2">{r.total != null ? `$${Number(r.total).toFixed(2)}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* System */}
      <section aria-labelledby="system-title" className="grid gap-2">
        <div className="flex items-center justify-between">
          <h2 id="system-title" className="text-base font-semibold">System</h2>
          <ShopHostLink as="a" to="/app/doctor">Registry health</ShopHostLink>
        </div>
        <div className="rounded border border-slate-200 bg-white p-2">
          {loading.system ? (
            <div className="p-2 text-sm text-slate-500">Loading…</div>
          ) : health ? (
            <RegistryHealth data={health} compact />
          ) : (
            <div className="p-2 text-sm text-slate-500">No data.</div>
          )}
        </div>
      </section>
    </main>
  );
};

const Card: React.FC<{ title: string; value: number | null; loading?: boolean; action?: React.ReactNode }> = ({ title, value, loading, action }) => {
  return (
    <div className="rounded border border-slate-200 bg-white p-3">
      <div className="text-sm text-slate-600">{title}</div>
      <div className="text-2xl font-semibold" aria-live="polite">{loading ? '—' : (value ?? '—')}</div>
      {action ? <div className="mt-2 text-sm">{action}</div> : null}
    </div>
  );
};

export default AdminDashboard;
/*
<!-- END RBP GENERATED: admin-dashboard-v1 -->
*/
