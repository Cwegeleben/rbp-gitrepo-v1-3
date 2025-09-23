// <!-- BEGIN RBP GENERATED: hq-skeleton-v0-1 -->
import React from 'react';
import { HQHeader } from './HQHeader';
import type { PricingBook } from '../../../../../apps/hq.api/types/hq';

export const PricingBookView: React.FC<{ book: PricingBook }> = ({ book }) => {
  return (
    <div style={{ background: '#f8f8f8', minHeight: '100%' }}>
      <HQHeader title="Pricing" subtitle={`${book.name} • ${book.currency}`} />
      <div style={{ padding: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Condition</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {book.rules.map((r, idx) => (
              <tr key={idx}>
                <td style={{ padding: 8 }}>{r.condition}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
// <!-- END RBP GENERATED: hq-skeleton-v0-1 -->
