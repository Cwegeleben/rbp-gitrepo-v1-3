// <!-- BEGIN RBP GENERATED: cart-drawer-v1 -->
import React from 'react';

type Item = { title: string; qty: number; vendor?: string };
const ItemsList: React.FC<{ items: Item[] }> = ({ items }) => {
  if (!items?.length) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Items</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
        {items.map((it, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #eee', borderRadius: 6, padding: '6px 8px' }}>
            <div>
              <div style={{ fontWeight: 500 }}>{it.title}</div>
              {it.vendor && <div style={{ opacity: 0.7, fontSize: 12 }}>{it.vendor}</div>}
            </div>
            <div aria-label={`Quantity ${it.qty}`} style={{ fontVariantNumeric: 'tabular-nums' }}>x{it.qty}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsList;
// <!-- END RBP GENERATED: cart-drawer-v1 -->
