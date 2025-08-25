/*
<!-- BEGIN RBP GENERATED: registry-health-ui-v1 -->
*/
import React from "react";

export type HealthErrorCode = "WRONG_PREFIX" | "CROSS_ORIGIN" | "MISSING_FILE" | string;

export type VersionHealth = {
  ok: boolean;
  path: string;
  pathPrefixOk: boolean;
  sameOriginOk: boolean;
  fileExists?: boolean;
};

export type ModuleHealth = {
  ok: boolean;
  version?: string | null;
  default?: string | null;
  path?: string | null;
  pathPrefixOk: boolean;
  sameOriginOk: boolean;
  fileExists?: boolean;
  versions?: Record<string, VersionHealth>;
};

export type Health = {
  ok: boolean;
  modules: Record<string, ModuleHealth>;
  errors: Array<{ code: HealthErrorCode; module: string; version?: string; path: string; message?: string }>;
};

function Badge({ ok, label }: { ok: boolean | undefined; label: string }) {
  const cls = ok === true
    ? "bg-green-100 text-green-800 ring-green-200"
    : ok === false
      ? "bg-red-100 text-red-800 ring-red-200"
      : "bg-gray-100 text-gray-800 ring-gray-200";
  const text = ok === true ? `${label}: OK` : ok === false ? `${label}: Bad` : `${label}: ?`;
  return <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] ring-1 ring-inset ${cls}`}>{text}</span>;
}

export default function RegistryHealth({ data, compact }: { data: Health; compact?: boolean }) {
  const modules = Object.entries(data?.modules || {});
  const errCount = data?.errors?.length || 0;

  return (
    <section aria-labelledby="registry-health-title" className="grid gap-3">
      <h2 id="registry-health-title" className="text-base font-semibold">Registry Health</h2>
      {errCount > 0 && (
        <div role="alert" className="rounded border border-red-200 bg-red-50 text-red-900 p-2 text-sm">
          {errCount} issue{errCount === 1 ? "" : "s"} detected.
          <ul className="list-disc ml-5 mt-1">
            {data.errors.map((e, i) => (
              <li key={i}><code>{e.code}</code> {e.module}{e.version ? `@${e.version}` : ""} — <span className="break-all">{e.path}</span></li>
            ))}
          </ul>
        </div>
      )}
      <div className="overflow-auto">
        <table className="min-w-full text-sm" aria-describedby="registry-health-caption">
          <caption id="registry-health-caption" className="sr-only">Module registry health overview</caption>
          <thead>
            <tr className="text-left">
              <th className="px-2 py-1">Module</th>
              <th className="px-2 py-1">Default</th>
              <th className="px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {modules.length === 0 && (
              <tr>
                <td className="px-2 py-2" colSpan={3}>No modules in registry.</td>
              </tr>
            )}
            {modules.map(([name, mh]) => (
              <tr key={name} className="border-t border-slate-200">
                <td className="px-2 py-2 font-mono text-xs">{name}</td>
                <td className="px-2 py-2">{mh.default || mh.version || "—"}</td>
                <td className="px-2 py-2">
                  <div className={`flex flex-wrap gap-1 ${compact ? "" : ""}`}>
                    <Badge ok={mh.pathPrefixOk} label="prefix" />
                    <Badge ok={mh.sameOriginOk} label="origin" />
                    <Badge ok={mh.fileExists} label="file" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
/*
<!-- END RBP GENERATED: registry-health-ui-v1 -->
*/
