// <!-- BEGIN RBP GENERATED: rbp-shell-mvp -->
import React from "react";

export default function StatusPanel({ accessOk, registryOk, timestamp }: { accessOk: boolean; registryOk: boolean; timestamp: string }) {
  const Item = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className="flex items-center gap-2">
      <span className="inline-block w-2 h-2 rounded-full ring-1 ring-inset" aria-hidden />
      <span className="text-sm">{label}: {ok ? "OK" : "Missing"}</span>
    </div>
  );
  return (
    <aside className="rounded-2xl shadow p-4" aria-label="Status">
      <div className="font-semibold mb-2">Status</div>
      <div className="grid gap-2">
        <Item ok={accessOk} label="Access Context" />
        <Item ok={registryOk} label="Module Registry" />
      </div>
      <div className="mt-3 opacity-80 text-xs" aria-label="Timestamp">{timestamp}</div>
    </aside>
  );
}
// <!-- END RBP GENERATED: rbp-shell-mvp -->
