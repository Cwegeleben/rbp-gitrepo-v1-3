/* <!-- BEGIN RBP GENERATED: tenant-admin-ui-visibility --> */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BuildDetailPanel } from '../BuildsPage';

// Patch global fetch to return a dry-run response
beforeEach(() => {
  (global as any).fetch = jest.fn((input: RequestInfo, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : (input as Request).url;
    if (url.includes('/apps/proxy/api/checkout/package')) {
      // Validate header present
      const hdr = (init?.headers as any) || {};
      if (!hdr['X-RBP-Dry-Run'] && !hdr['x-rbp-dry-run']) return Promise.resolve(new Response('', { status: 400 }));
      return Promise.resolve(new Response(JSON.stringify({ ok: true, meta: { totals: { subtotal: 10, estTax: 0.8, total: 10.8 } }, hints: [{ type: 'MISSING_VARIANT', sku: 'SKU-1' }] }), { status: 200 }));
    }
    return Promise.resolve(new Response('', { status: 404 }));
  });
});

test('Preview button loads dry-run and shows totals + hints', async () => {
  render(<BuildDetailPanel onClose={() => {}} id={'b1'} loading={false} error={null} detail={{ id: 'b1', title: 'B1', items: [] }} />);
  const btn = screen.getByText('Preview package');
  fireEvent.click(btn);
  await waitFor(() => {
    expect(screen.getByText('Package Summary')).toBeInTheDocument();
  });
  // live region updated
  await waitFor(() => {
    expect(document.body.textContent || '').toContain('Loaded preview');
  });
  expect(screen.getByText('Subtotal')).toBeInTheDocument();
  expect(screen.getByText('Est. tax')).toBeInTheDocument();
  expect(screen.getByText('Total')).toBeInTheDocument();
  expect(screen.getByText('Hints')).toBeInTheDocument();
});

/* <!-- END RBP GENERATED: tenant-admin-ui-visibility --> */
