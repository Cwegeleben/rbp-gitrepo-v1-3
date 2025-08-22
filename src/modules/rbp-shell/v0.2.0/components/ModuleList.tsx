/*
<!-- BEGIN RBP GENERATED: storefront-shell-v0-2 -->
*/
import React from 'react';

type Registry = {
  modules?: Record<string, { default?: string; latest?: string; versions?: Record<string, { path: string }> }>;
};

export default function ModuleList({ registry }: { registry?: Registry }) {
  const entries = registry?.modules ? Object.keys(registry.modules).sort() : null;
  const offline = !entries || entries.length === 0;
  const fallback = ['rbp-catalog', 'rbp-builds'];
  const list = offline ? fallback : entries!;
  return (
    <section aria-labelledby="rbp-modules-title" className="rounded-2xl shadow p-4">
      <h2 id="rbp-modules-title" className="text-lg font-semibold mb-2">Modules</h2>
      {offline && (
        <div className="text-sm opacity-70 mb-2" role="note">registry offline (mock)</div>
      )}
      <ul className="list-disc ml-6">
        {list.map((name) => (
          <li key={name} className="py-1">
            <span className="font-medium">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
/*
<!-- END RBP GENERATED: storefront-shell-v0-2 -->
*/
