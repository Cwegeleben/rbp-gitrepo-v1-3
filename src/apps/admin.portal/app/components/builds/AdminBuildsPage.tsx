/*
<!-- BEGIN RBP GENERATED: admin-builds-v1 -->
*/
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useShopHostNavigate } from '../../hooks/useShopHostNavigate';
import { createBuildsApi } from '../../lib/createBuildsApi';
import { toast } from '../../../../../shared/ui/toast';

type Build = { id: string; number: number; customer: string; updatedAt: string; status: 'in_progress' | 'queued' | 'completed'; total: number };

export default function AdminBuildsPage({ api }: { api?: ReturnType<typeof createBuildsApi> }) {
  const { search, pathname } = useLocation();
  const nav = useShopHostNavigate();
  const sp = useMemo(() => new URLSearchParams(search), [search]);
  const setSp = (mut: (n: URLSearchParams) => void) => { const n = new URLSearchParams(sp.toString()); mut(n); nav(`${pathname}?${n.toString()}`); };
  const apiImpl = useMemo(() => api || createBuildsApi(), [api]);

  const status = (sp.get('status') as Build['status']) || 'in_progress';
  const q = sp.get('q') || '';
  const page = Number(sp.get('page') || '1');

  const [rows, setRows] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await apiImpl.list({ status, q, page, perPage: 20 });
        if (!alive) return;
        setRows(res.items as any);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || 'Failed to load builds');
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [apiImpl, status, q, page]);

  async function onDelete(id: string) {
    if (!confirm('Delete this build?')) return;
    const before = rows;
    setRows((r) => r.filter(x => x.id !== id));
    try {
      await apiImpl.delete(id as any);
      toast('success', 'Build deleted');
    } catch (e) {
      setRows(before);
      toast('error', 'Delete failed — rolled back');
    }
  }

  async function onDuplicate(id: string) {
    try { await apiImpl.duplicate(id as any); toast('success', 'Build duplicated'); }
    catch { toast('error', 'Duplicate failed'); }
  }

  const tab = (val: Build['status'], label: string) => (
    <button
      role="tab"
      aria-selected={status === val}
      onClick={() => setSp(n => { n.set('status', val); n.delete('page'); })}
      style={{ padding: 6, borderBottom: status === val ? '2px solid black' : '2px solid transparent' }}
    >{label}</button>
  );

  return (
    <div>
      <h1>Builds</h1>
      <div role="tablist" aria-label="Build status" style={{ display: 'flex', gap: 8 }}>
        {tab('in_progress', 'In progress')}
        {tab('queued', 'Queued')}
        {tab('completed', 'Completed')}
      </div>
      <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
        <input aria-label="Search builds" placeholder="Search" defaultValue={q} onBlur={(e) => setSp(n => { const v = e.target.value; if (v) n.set('q', v); else n.delete('q'); n.delete('page'); })} />
        <button onClick={() => nav(`/app/builds/new`)}>New build</button>
      </div>
      {loading && <div>Loading…</div>}
      {error && <div role="alert">{error}</div>}
      {!loading && !error && (
        rows.length ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>#</th><th>Customer</th><th>Updated</th><th>Status</th><th>Total</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.number}</td>
                  <td>{r.customer}</td>
                  <td>{new Date(r.updatedAt).toLocaleString()}</td>
                  <td>{r.status}</td>
                  <td>{r.total.toFixed(2)}</td>
                  <td>
                    <button onClick={() => nav(`/app/builds/${r.id}`)}>View</button>
                    <button onClick={() => onDuplicate(r.id)}>Duplicate</button>
                    <button onClick={() => onDelete(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div>No builds</div>
      )}
    </div>
  );
}
/*
<!-- END RBP GENERATED: admin-builds-v1 -->
*/
