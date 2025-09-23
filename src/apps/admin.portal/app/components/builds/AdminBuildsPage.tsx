/*
<!-- BEGIN RBP GENERATED: admin-builds-v1 -->
*/
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useShopHostNavigate } from '../../hooks/useShopHostNavigate';
import { createBuildsApi } from '../../lib/createBuildsApi';
import { toast } from '../../../../../shared/ui/toast';
// <!-- BEGIN RBP GENERATED: ui-polish-v1 -->
import AdminHeader from '../common/AdminHeader';
// <!-- END RBP GENERATED: ui-polish-v1 -->
// <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
import { useLiveRegion } from '../../../../../packages/ui/live-region/LiveRegion';
// <!-- END RBP GENERATED: admin-acceptance-v1 -->

type Build = { id: string; number: number; customer: string; updatedAt: string; status: 'in_progress' | 'queued' | 'completed'; total: number };

export default function AdminBuildsPage({ api }: { api?: ReturnType<typeof createBuildsApi> }) {
  const { search, pathname } = useLocation();
  const nav = useShopHostNavigate();
  const sp = useMemo(() => new URLSearchParams(search), [search]);
  const setSp = (mut: (n: URLSearchParams) => void) => { const n = new URLSearchParams(sp.toString()); mut(n); nav(`${pathname}?${n.toString()}`); };
  const apiImpl = useMemo(() => api || createBuildsApi(), [api]);
  // <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
  const { announce } = useLiveRegion();
  // <!-- END RBP GENERATED: admin-acceptance-v1 -->

  const status = (sp.get('status') as Build['status']) || 'in_progress';
  const q = sp.get('q') || '';
  const page = Number(sp.get('page') || '1');

  const [rows, setRows] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
  const [banner, setBanner] = useState<null | { tone: 'success' | 'info' | 'warning' | 'critical'; content: string }>(null);
  type Slot = { id: string; name: string };
  const [slots, setSlots] = useState<Slot[]>([]);
  // <!-- END RBP GENERATED: admin-acceptance-v1 -->

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
      // <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
      announce('Build deleted');
      // <!-- END RBP GENERATED: admin-acceptance-v1 -->
    } catch (e) {
      setRows(before);
      toast('error', 'Delete failed — rolled back');
      // <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
      setBanner({ tone: 'critical', content: 'Delete failed — changes rolled back' });
      announce('Delete failed. Changes rolled back');
      // <!-- END RBP GENERATED: admin-acceptance-v1 -->
    }
  }

  async function onDuplicate(id: string) {
    // <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
    // Optimistic duplicate: insert placeholder immediately, rollback on failure
    const orig = rows.find(r => r.id === id);
    const placeholder: Build | null = orig ? { ...orig, id: `dup-${id}-${Date.now()}`, number: orig.number, updatedAt: new Date().toISOString() } : null;
    if (placeholder) setRows(r => [placeholder!, ...r]);
    try {
      const created = await (apiImpl as any).duplicate(id);
      toast('success', 'Build duplicated');
      announce('Build duplicated');
      if (created && created.id) {
        setRows(r => r.map(b => b.id === placeholder?.id ? { ...created } : b));
      }
    } catch (e) {
      toast('error', 'Duplicate failed — rolled back');
      setBanner({ tone: 'critical', content: 'Duplicate failed — changes rolled back' });
      announce('Duplicate failed. Changes rolled back');
      if (placeholder) setRows(r => r.filter(b => b.id !== placeholder!.id));
    }
    // <!-- END RBP GENERATED: admin-acceptance-v1 -->
  }

  // <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
  // Slot operations with optimistic updates and precise rollback
  async function commitSlots(next: Slot[], announceMsg: string) {
    const before = slots;
    setSlots(next);
    announce(announceMsg);
    try {
      if ((apiImpl as any)?.updateSlots) {
        await (apiImpl as any).updateSlots(next);
      }
      setBanner(null);
    } catch (e) {
      setSlots(before);
      setBanner({ tone: 'critical', content: 'Slot update failed — rolled back' });
      announce('Slot update failed. Changes rolled back');
    }
  }

  function addSlot(name = `Slot ${slots.length + 1}`) {
    const next = [...slots, { id: `s-${Date.now()}`, name }];
    void commitSlots(next, `Added ${name}`);
  }
  function replaceSlot(index: number, name = `Replaced ${index + 1}`) {
    if (index < 0 || index >= slots.length) return;
    const next = slots.map((s, i) => i === index ? { ...s, name } : s);
    void commitSlots(next, `Replaced slot ${index + 1}`);
  }
  function removeSlot(index: number) {
    if (index < 0 || index >= slots.length) return;
    const removed = slots[index]?.name || `slot ${index + 1}`;
    const next = slots.filter((_, i) => i !== index);
    void commitSlots(next, `Removed ${removed}`);
  }
  function resetSlots() {
    const next: Slot[] = [];
    void commitSlots(next, 'Slots reset');
  }
  function reorderSlots(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= slots.length || to >= slots.length) return;
    const next = [...slots];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    void commitSlots(next, `Moved ${moved.name} to position ${to + 1}`);
  }
  // <!-- END RBP GENERATED: admin-acceptance-v1 -->

  const tab = (val: Build['status'], label: string) => (
    <button
      role="tab"
      aria-selected={status === val}
  onClick={() => setSp(n => { n.set('status', val); n.delete('page'); /* <!-- BEGIN RBP GENERATED: admin-acceptance-v1 --> */ announce(`${label} tab selected`); /* <!-- END RBP GENERATED: admin-acceptance-v1 --> */ })}
      style={{ padding: 6, borderBottom: status === val ? '2px solid black' : '2px solid transparent' }}
    >{label}</button>
  );

  return (
    <div data-testid="admin-builds-ready">
      {/* <!-- BEGIN RBP GENERATED: ui-polish-v1 --> */}
      <AdminHeader
        title="Builds"
        subtitle="Track and manage builds"
        primaryAction={{ label: 'New build', onClick: () => nav(`/app/builds/new`) }}
        /* <!-- BEGIN RBP GENERATED: admin-acceptance-v1 --> */
        banner={banner || undefined as any}
        /* <!-- END RBP GENERATED: admin-acceptance-v1 --> */
      />
      {/* <!-- END RBP GENERATED: ui-polish-v1 --> */}
      <div role="tablist" aria-label="Build status" style={{ display: 'flex', gap: 8 }}>
        {tab('in_progress', 'In progress')}
        {tab('queued', 'Queued')}
        {tab('completed', 'Completed')}
      </div>
      <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
        <input aria-label="Search builds" placeholder="Search" defaultValue={q} onBlur={(e) => setSp(n => { const v = e.target.value; if (v) n.set('q', v); else n.delete('q'); n.delete('page'); })} />
      </div>
      {/* <!-- BEGIN RBP GENERATED: admin-acceptance-v1 --> */}
      <section aria-label="Slots" style={{ background: '#fafafa', padding: 8, borderRadius: 6, marginBottom: 12 }}>
        <h2 style={{ marginTop: 0 }}>Slots</h2>
        <ol data-testid="slots-list">
          {slots.map((s, i) => (
            <li key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{i + 1}. {s.name}</span>
              <div style={{ marginLeft: 'auto', display: 'inline-flex', gap: 6 }}>
                <button onClick={() => replaceSlot(i)}>Replace</button>
                <button onClick={() => removeSlot(i)}>Remove</button>
                <button disabled={i === 0} onClick={() => reorderSlots(i, i - 1)}>Up</button>
                <button disabled={i === slots.length - 1} onClick={() => reorderSlots(i, i + 1)}>Down</button>
              </div>
            </li>
          ))}
        </ol>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => addSlot()}>Add slot</button>
          <button disabled={slots.length === 0} onClick={() => resetSlots()}>Reset</button>
        </div>
      </section>
      {/* <!-- END RBP GENERATED: admin-acceptance-v1 --> */}
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
