// <!-- BEGIN RBP GENERATED: cart-drawer-v1 -->
import React from 'react';
import { formatTotals } from '../../../rbp-package/1.0.0/utils/formatTotals.js';

const Totals: React.FC<{ totals?: any }> = ({ totals }) => {
  const rows = formatTotals(totals) as Array<[string, string]>;
  if (!rows.length) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Totals</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {rows.map(([k, v]: [string, string], i: number) => (
            <tr key={i}>
              <td style={{ padding: '2px 4px', opacity: 0.8 }}>{k}</td>
              <td style={{ padding: '2px 4px', textAlign: 'right' }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Totals;
// <!-- END RBP GENERATED: cart-drawer-v1 -->
