// <!-- BEGIN RBP GENERATED: rbp-shell-mvp -->
import React from "react";

type Tile = { id: "rbp-catalog" | "rbp-builds"; label: string };

export default function Tiles({ tiles, onClick, isEnabled }: { tiles: readonly Tile[]; onClick: (id: Tile["id"]) => void; isEnabled: (id: Tile["id"]) => boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:col-span-2">
      {tiles.map((t) => {
        const enabled = isEnabled(t.id);
        return (
          <button
            key={t.id}
            className="rounded-2xl shadow p-6 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
            aria-label={t.label}
            disabled={!enabled}
            onClick={() => enabled && onClick(t.id)}
            title={enabled ? t.label : "Module unavailable"}
          >
            <div className="text-lg font-semibold">{t.label}</div>
            <div className="opacity-80 text-sm">Open {t.label.toLowerCase()} tools</div>
          </button>
        );
      })}
    </div>
  );
}
// <!-- END RBP GENERATED: rbp-shell-mvp -->
