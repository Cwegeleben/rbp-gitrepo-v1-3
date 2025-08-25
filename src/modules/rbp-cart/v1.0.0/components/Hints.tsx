// <!-- BEGIN RBP GENERATED: cart-drawer-v1 -->
import React from 'react';

const FRIENDLY: Record<string, string> = {
  MISSING_VARIANT: 'Some items are missing variant selections.',
  OUT_OF_STOCK: 'Some items are out of stock.',
};

const Hints: React.FC<{ hints: any[] }> = ({ hints }) => {
  const list = Array.isArray(hints) ? hints : [];
  if (!list.length) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Hints</div>
      <ul style={{ paddingLeft: 18 }}>
        {list.map((h, i) => {
          const code = h?.type || h?.code || 'HINT';
          const msg = h?.message || FRIENDLY[code] || '';
          const sku = h?.sku ? ` (${h.sku})` : '';
          return <li key={i}>{code}{msg ? `: ${msg}` : ''}{sku}</li>;
        })}
      </ul>
    </div>
  );
};

export default Hints;
// <!-- END RBP GENERATED: cart-drawer-v1 -->
