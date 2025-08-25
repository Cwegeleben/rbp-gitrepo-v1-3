// <!-- BEGIN RBP GENERATED: package-cta-v1 -->
import React from 'react';

export type Hint = { type: string; message?: string; sku?: string };

const FRIENDLY: Record<string, string> = {
  MISSING_VARIANT: "Some parts aren't fully selectable yet",
  NO_PRICE: 'Line prices unavailable; totals may be zero',
};

export default function HintsList({ hints }: { hints?: Hint[] }){
  if (!Array.isArray(hints) || hints.length === 0) return null;
  return (
    <div role="status">
      <div className="font-semibold">Hints</div>
      <ul className="list-disc ml-5">
        {hints.map((h, i) => (
          <li key={i}>
            <span>{FRIENDLY[h.type] || h.type}</span>
            {h.sku && <span>{` (${h.sku})`}</span>}
            {h.message && <span>{`: ${h.message}`}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
// <!-- END RBP GENERATED: package-cta-v1 -->
