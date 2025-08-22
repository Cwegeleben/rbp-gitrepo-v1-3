// <!-- BEGIN RBP GENERATED: rbp-shell-mvp -->
import React from "react";

export default function Header({ title, tenant, plan, devTools }: { title: string; tenant?: string; plan?: string; devTools?: boolean }) {
  return (
    <header className="flex items-center justify-between rounded-2xl shadow p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center gap-2">
        {tenant && <span className="px-2 py-1 rounded-lg ring-1 ring-inset" aria-label={`Tenant ${tenant}`}>{tenant}</span>}
        {plan && <span className="px-2 py-1 rounded-lg ring-1 ring-inset" aria-label={`Plan ${plan}`}>{plan}</span>}
        {devTools && <span className="px-2 py-1 rounded-lg ring-1 ring-inset" aria-label="Developer Tools">Dev Tools</span>}
      </div>
    </header>
  );
}
// <!-- END RBP GENERATED: rbp-shell-mvp -->
