/*
<!-- BEGIN RBP GENERATED: tenant-admin-harden -->
*/
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { TenantContext } from "./TenantContext";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ErrorState } from "./ErrorState";
/* <!-- BEGIN RBP GENERATED: tenant-admin-audit-proxy --> */
import { fetchProxy } from "./fetchProxy.server";
/* <!-- END RBP GENERATED: tenant-admin-audit-proxy --> */
import { ui } from "./uiStrings";
/* <!-- BEGIN RBP GENERATED: tenant-admin-builds-qol --> */
import { ConfirmDialog } from './app/components/ConfirmDialog';
import { createBuildsApi as createBuildsApiLib } from './app/lib/createBuildsApi';
/* <!-- END RBP GENERATED: tenant-admin-builds-qol --> */

export type BuildListItem = {
  id: string;
  title?: string;
  createdAt?: string;
  itemsCount?: number;
};

export type BuildDetail = {
  id: string;
  title?: string;
  createdAt?: string;
  items?: Array<{ type?: string; name?: string; qty?: number }>;
};

type BuildsListResponse = {
  items: BuildListItem[];
  pageInfo?: { nextCursor?: string; prevCursor?: string; total?: number };
};

/* <!-- BEGIN RBP GENERATED: tenant-admin-builds-qol --> */
// Re-export the centralized API client; keep prior public surface.
export { createBuildsApi } from './app/lib/createBuildsApi';
/* <!-- END RBP GENERATED: tenant-admin-builds-qol --> */

export const BuildCard: React.FC<{ build: BuildListItem; to: string }> = ({ build, to }) => {
  return (
    <Link to={to} style={{ display: "block", border: "1px solid #ddd", padding: 12, borderRadius: 6, textDecoration: "none", color: "inherit" }}>
      <div style={{ fontWeight: 600 }}>{build.title || `Build ${build.id}`}</div>
      <div style={{ fontSize: 12, color: "#555" }}>{build.createdAt || "—"}</div>
      <div style={{ marginTop: 4 }}>{build.itemsCount ?? 0} items</div>
    </Link>
  );
};

export const BuildDetailPanel: React.FC<{
  detail?: BuildDetail;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  /* <!-- BEGIN RBP GENERATED: tenant-admin-builds-qol --> */
  id?: string;
  canWrite?: boolean; // when false, hide/disable write actions
  onPatch?: (payload: Partial<BuildDetail>) => Promise<BuildDetail>;
  onDuplicate?: () => Promise<{ id: string } | BuildDetail>;
  /* <!-- END RBP GENERATED: tenant-admin-builds-qol --> */
}> = ({ detail, loading, error, onClose, /* tenant-admin-builds-qol */ id, canWrite = false, onPatch, onDuplicate }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  /* <!-- BEGIN RBP GENERATED: tenant-admin-builds-qol --> */
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [localItems, setLocalItems] = useState<Array<{ type?: string; name?: string; qty?: number }>>(detail?.items || []);
  const [confirmClear, setConfirmClear] = useState(false);
  const [importErr, setImportErr] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<Array<{ type?: string; name?: string; qty?: number }> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => { setLocalItems(detail?.items || []); }, [detail?.items]);
  function move(idx: number, delta: number) {
    const next = [...localItems];
    const ni = idx + delta;
    if (ni < 0 || ni >= next.length) return;
    const tmp = next[idx];
    next[idx] = next[ni];
    next[ni] = tmp;
    setLocalItems(next);
    // Persist immediately per acceptance (optimistic with rollback on failure)
    void persistItems(next);
  }
  async function persistItems(nextItems: typeof localItems) {
    if (!onPatch) return;
    const prev = localItems;
    setLocalItems(nextItems);
  setStatusMsg(ui.common.loading || '');
    try {
      await onPatch({ items: nextItems });
      setStatusMsg(ui.builds.saved);
    } catch {
      setLocalItems(prev);
      setStatusMsg(ui.builds.saveFailed);
    }
  }
  function validateImported(obj: any): Array<{ type?: string; name?: string; qty?: number }> {
    if (!obj || typeof obj !== 'object') throw new Error('Invalid');
    const items = obj.items;
    if (!Array.isArray(items)) throw new Error('Invalid');
    for (const it of items) {
      if (!it || typeof it !== 'object') throw new Error('Invalid');
      if (it.qty != null && Number(it.qty) < 1) throw new Error('Invalid');
    }
    return items as any[];
  }
  function onExport() {
    if (!detail) return;
    try {
      const data = JSON.stringify({ id: detail.id, title: detail.title, items: localItems }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `build-${detail.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMsg(ui.builds.saved);
    } catch { setStatusMsg(ui.builds.saveFailed); }
  }
  async function onImportFile(file: File) {
    setImportErr(null);
    try {
  const text = typeof (file as any).text === 'function' ? await (file as any).text() : await new Response(file).text();
      const parsed = JSON.parse(text);
      const items = validateImported(parsed);
      setImportPreview(items);
    } catch {
      setImportErr(ui.builds.importInvalid);
      setImportPreview(null);
    }
  }
  /* <!-- END RBP GENERATED: tenant-admin-builds-qol --> */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const root = panelRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <aside aria-labelledby="build-panel-title" style={{ width: 360, borderLeft: "1px solid #eee", padding: 16 }}>
      <div ref={panelRef}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 id="build-panel-title" style={{ margin: 0 }}>{ui.builds.detailTitle}</h3>
          <button onClick={onClose} aria-label={ui.common.close}>{ui.common.close}</button>
        </div>
        <div role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}>
          {loading ? ui.common.loading : statusMsg}
        </div>
        {loading && <LoadingSkeleton rows={6} />}
        {error && <ErrorState message={error} />}
        {!loading && !error && detail && (
          <div>
            <div style={{ fontWeight: 600, marginTop: 8 }}>{detail.title || `Build ${detail.id}`}</div>
            <div style={{ fontSize: 12, color: "#555" }}>{detail.createdAt || "—"}</div>
            {/* <!-- BEGIN RBP GENERATED: tenant-admin-builds-qol --> */}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Items</div>
              <ul>
                {localItems.map((it, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ flex: 1 }}>
                      {it.type ? `[${it.type}] ` : ""}
                      {it.name || "Item"} × {it.qty ?? 1}
                    </span>
                    {canWrite && (
                      <span style={{ display: 'inline-flex', gap: 4 }}>
                        <button aria-label={ui.builds.moveUp} disabled={i === 0} onClick={() => move(i, -1)}>{"↑"}</button>
                        <button aria-label={ui.builds.moveDown} disabled={i === localItems.length - 1} onClick={() => move(i, +1)}>{"↓"}</button>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {canWrite && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button onClick={() => setConfirmClear(true)}>{ui.builds.clearAll}</button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <button onClick={onExport}>{ui.builds.exportJson}</button>
              {canWrite ? (
                <>
                  <button onClick={() => fileInputRef.current?.click()}>{ui.builds.importJson}</button>
                  <input ref={fileInputRef} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={(e) => {
                    const input = e.target as HTMLInputElement;
                    const f = input.files?.[0] || null;
                    if (f) onImportFile(f);
                  }} />
                  <button onClick={async () => {
                    if (!onDuplicate) return;
                    try {
                      setStatusMsg('');
                      const res = await onDuplicate();
                      setStatusMsg(ui.builds.saved);
                    } catch (e: any) {
                      if (e?.code === 'ENOTIMPL') setStatusMsg(ui.builds.duplicateUnavailable);
                      else setStatusMsg(ui.builds.saveFailed);
                    }
                  }}>{ui.builds.duplicate}</button>
                </>
              ) : (
                <button disabled title={ui.builds.duplicateUnavailable}>{ui.builds.duplicate}</button>
              )}
            </div>

            {confirmClear && (
              <ConfirmDialog
                title={ui.builds.confirmClearTitle}
                message={ui.builds.confirmClearMsg}
                confirmLabel={ui.builds.clearAll}
                cancelLabel={ui.builds.importCancel}
                onCancel={() => setConfirmClear(false)}
                onConfirm={async () => {
                  setConfirmClear(false);
                  await persistItems([]);
                }}
              />
            )}

            {importErr && <div role="alert" style={{ color: 'crimson', marginTop: 8 }}>{importErr}</div>}
            {importPreview && canWrite && (
              <div style={{ marginTop: 8 }}>
                <h4 style={{ margin: '4px 0' }}>{ui.builds.importPreviewTitle}</h4>
                <ul>
                  {importPreview.map((it, i) => (
                    <li key={i}>{it.name || 'Item'} × {it.qty ?? 1}</li>
                  ))}
                </ul>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setImportPreview(null)}>{ui.builds.importCancel}</button>
                  <button onClick={async () => { await persistItems(importPreview); setImportPreview(null); }}>{ui.builds.importApply}</button>
                </div>
              </div>
            )}
            {/* <!-- END RBP GENERATED: tenant-admin-builds-qol --> */}
          </div>
        )}
      </div>
    </aside>
  );
};

export const BuildsPage: React.FC<{ api?: ReturnType<typeof createBuildsApiLib>; /* <!-- BEGIN RBP GENERATED: tenant-admin-builds-qol --> */ writeEnabled?: boolean /* <!-- END RBP GENERATED: tenant-admin-builds-qol --> */ }> = ({ api, writeEnabled }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") || "";
  const cursor = sp.get("cursor") || undefined;

  const ctx = useContext(TenantContext);
  const readonly = ctx?.features?.builds?.readonly === true;
  const allowed = readonly === true;
  /* <!-- BEGIN RBP GENERATED: tenant-admin-builds-qol --> */
  const canWrite = writeEnabled != null ? writeEnabled : !readonly;
  /* <!-- END RBP GENERATED: tenant-admin-builds-qol --> */

  const apiImpl = useMemo(() => api || createBuildsApiLib(), [api]);

  const [list, setList] = useState<BuildsListResponse | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState<string | null>(null);

  const [detail, setDetail] = useState<BuildDetail | undefined>();
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!allowed) return;
    let alive = true;
    (async () => {
      setLoadingList(true);
      setErrorList(null);
      try {
        const res = await apiImpl.list({ q, cursor });
        if (!alive) return;
        setList(res);
      } catch (e: any) {
        if (!alive) return;
        setErrorList(e?.message || "Failed to load builds");
      } finally {
        if (alive) setLoadingList(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [allowed, apiImpl, q, cursor]);

  useEffect(() => {
    if (!allowed) return;
    let alive = true;
    if (id) {
      (async () => {
        setLoadingDetail(true);
        setErrorDetail(null);
        try {
          const d = await apiImpl.get(id);
          if (!alive) return;
          setDetail(d);
        } catch (e: any) {
          if (!alive) return;
          const status = e?.status;
          if (status === 404) setErrorDetail(ui.builds.notFound);
          else if (status === 403) setErrorDetail(ui.builds.forbidden);
          else setErrorDetail(e?.message || "Failed to load detail");
        } finally {
          if (alive) setLoadingDetail(false);
        }
      })();
    } else {
      setDetail(undefined);
      setErrorDetail(null);
    }
    return () => { alive = false; };
  }, [allowed, apiImpl, id]);

  const onSearch = (nextQ: string) => {
    const next = new URLSearchParams(sp.toString());
    next.set("q", nextQ);
    next.delete("cursor");
    setSp(next);
  };
  const onPage = (nextCursor?: string) => {
    const next = new URLSearchParams(sp.toString());
    if (nextCursor) next.set("cursor", nextCursor);
    else next.delete("cursor");
    setSp(next);
  };

  if (!allowed) {
    return <div>{ui.builds.notAvailable}</div>;
  }

  return (
    <div style={{ display: "flex", alignItems: "stretch" }}>
      <div style={{ flex: 1, paddingRight: 12 }}>
        <h1>{ui.builds.title}</h1>
        <div style={{ margin: "12px 0" }}>
          <input aria-label="Search builds" placeholder="Search" defaultValue={q} onBlur={(e) => onSearch(e.target.value)} />
        </div>
        <div role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}>
          {loadingList ? ui.common.loading : ''}
        </div>
        {loadingList && <LoadingSkeleton rows={6} />}
        {errorList && <ErrorState message={errorList} />}
        {!loadingList && !errorList && (
          list && list.items.length > 0 ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {list.items.map((b) => (
                  <BuildCard key={b.id} build={b} to={`/builds/${b.id}?${sp.toString()}`} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                <button disabled={!list.pageInfo?.prevCursor} onClick={() => onPage(list.pageInfo?.prevCursor)} aria-label={ui.common.prev}>{ui.common.prev}</button>
                <button disabled={!list.pageInfo?.nextCursor} onClick={() => onPage(list.pageInfo?.nextCursor)} aria-label={ui.common.next}>{ui.common.next}</button>
              </div>
            </>
          ) : (
            <div>{ui.builds.empty}</div>
          )
        )}
      </div>
      {id && (
        <BuildDetailPanel
          detail={detail}
          loading={loadingDetail}
          error={errorDetail}
          /* <!-- BEGIN RBP GENERATED: tenant-admin-builds-qol --> */
          id={id}
          canWrite={canWrite}
          onPatch={async (payload) => {
            if (!id) throw new Error('no-id');
            const updated = await apiImpl.patch(id, payload as any);
            setDetail(updated);
            return updated;
          }}
          onDuplicate={async () => {
            if (!id) throw new Error('no-id');
            const dup = await apiImpl.duplicate(id);
            const newId = (dup as any).id || id;
            navigate(`/builds/${newId}?${sp.toString()}`);
            return dup as any;
          }}
          /* <!-- END RBP GENERATED: tenant-admin-builds-qol --> */
          onClose={() => {
            const focusEl = document.activeElement as HTMLElement | null;
            navigate(`/builds?${sp.toString()}`);
            // restore focus back to list
            requestAnimationFrame(() => {
              if (focusEl && focusEl instanceof HTMLElement) focusEl.focus();
            });
          }}
        />
      )}
    </div>
  );
};
/*
<!-- END RBP GENERATED: tenant-admin-harden -->
*/
