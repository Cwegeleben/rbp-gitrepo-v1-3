// <!-- BEGIN RBP GENERATED: BuildsQoL -->
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { getRegistryFlag } from "../../../shared/sdk/client";
import { ToastHost, pushToast } from "../../../shared/ui/toast";
import { duplicateBuild, reorderItems, clearBuild, exportBuildJson, importBuildFromJson, isQoLEnabled } from "./actions";

function useRegistryFlag() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
  getRegistryFlag('builds.qol.v1').then(v => setEnabled(!!v));
  }, []);
  return enabled;
}

function validateImport(obj: any): obj is { items: any[]; name?: string; id?: string } {
  return obj && typeof obj === "object" && Array.isArray(obj.items);
}

export default function BuildsQoLPanel({ build, setActiveBuild, refreshBuilds }: { build: any; setActiveBuild: (id: string) => void; refreshBuilds: () => void }) {
  const enabled = useRegistryFlag();
  const [pending, setPending] = useState(false);
  const [localItems, setLocalItems] = useState<any[]|null>(null);
  useEffect(()=>{ setLocalItems(null); }, [build?.id]);

  if (!enabled) return null;
  if (!build) return null;

  async function duplicate() {
    setPending(true);
    await duplicateBuild(build, { toast: pushToast, setActiveBuild, refresh: refreshBuilds });
    setPending(false);
  }

  async function clear() {
    setPending(true);
    const before = (build?.items||[]).slice();
    await clearBuild(build, { toast: pushToast, onLocalUpdate: (items)=>setLocalItems(items), onRollback: ()=>setLocalItems(before), refresh: refreshBuilds, confirm: ()=>window.confirm("Clear all items from this build?") });
    setPending(false);
  }

  async function reorder(idx: number, dir: "up" | "down") {
    setPending(true);
    const before = (build?.items||[]).slice();
    await reorderItems(build, idx, dir, { toast: pushToast, onLocalUpdate: (items)=>setLocalItems(items), onRollback: ()=>setLocalItems(before), refresh: refreshBuilds });
    setPending(false);
  }

  function exportBuild() {
    exportBuildJson(build, { toast: pushToast, download: (filename, data) => { const a = document.createElement('a'); const blob = new Blob([data], { type: 'application/json' }); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href); } });
  }

  async function importBuild(file: File) {
    setPending(true);
    const txt = await file.text();
    await importBuildFromJson(txt, { toast: pushToast, setActiveBuild, refresh: refreshBuilds });
    setPending(false);
  }

  return (
    <div style={{ margin: "16px 0", padding: 12, border: "1px solid #eee", background: "#fafbfc", borderRadius: 6 }}>
      <ToastHost />
      <div style={{ fontWeight: "bold", marginBottom: 8 }}>Builds QoL</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={duplicate} disabled={pending}>Duplicate</button>
        <button onClick={clear} disabled={pending}>Clear</button>
        <button onClick={exportBuild} disabled={pending}>Export</button>
        <label style={{ display: "inline-block" }}>
          <input type="file" accept="application/json" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) importBuild(f); e.target.value = ""; }} />
          <span style={{ cursor: "pointer", padding: "6px 12px", border: "1px solid #ccc", borderRadius: 4, background: "#fff" }}>Import</span>
        </label>
      </div>
      <div style={{ marginTop: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
    {(localItems ?? build.items)?.map((item: any, idx: number) => (
              <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                <td>{item.label || item.productId}</td>
                <td>{item.quantity}</td>
                <td>
      <button disabled={pending || idx === 0} onClick={() => reorder(idx, "up")}>↑</button>
      <button disabled={pending || idx === (localItems ?? build.items).length - 1} onClick={() => reorder(idx, "down")}>↓</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// <!-- END RBP GENERATED: BuildsQoL -->
