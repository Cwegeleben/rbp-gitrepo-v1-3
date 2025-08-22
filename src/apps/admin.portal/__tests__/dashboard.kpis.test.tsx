/* <!-- BEGIN RBP GENERATED: tenant-admin-ui-visibility --> */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DashboardKPIs, __testables } from '../app/components/DashboardKPIs';

// Unit test for KPI mapper (green/amber/red)

test('mapPackageStatus maps correctly', () => {
  const { mapPackageStatus } = __testables as any;
  expect(mapPackageStatus({ ok: true, hints: [] })).toEqual({ tone: 'green', subtext: 'OK', ok: true });
  const amber = mapPackageStatus({ ok: true, hints: [{}, {}] });
  expect(amber.tone).toBe('amber');
  expect(amber.ok).toBe(true);
  const red = mapPackageStatus({ ok: false, hints: [] });
  expect(red.tone).toBe('red');
  expect(red.ok).toBe(false);
});

// Light render test with fetch mocks

test('DashboardKPIs renders three tiles', async () => {
  (global as any).fetch = jest.fn((input: RequestInfo) => {
    const url = typeof input === 'string' ? input : (input as Request).url;
    if (url.includes('/apps/proxy/api/builds')) {
      return Promise.resolve(new Response(JSON.stringify({ items: [{ id: 'b1' }], pageInfo: { total: 12 } }), { status: 200 }));
    }
    if (url.includes('/apps/proxy/api/catalog/products')) {
      return Promise.resolve(new Response(JSON.stringify({ items: [{ id: 'p1' }], pageInfo: { total: 34 } }), { status: 200 }));
    }
    if (url.includes('/apps/proxy/api/checkout/package')) {
      return Promise.resolve(new Response(JSON.stringify({ ok: true, meta: { totals: { total: 10 } }, hints: [] }), { status: 200 }));
    }
    return Promise.resolve(new Response('', { status: 404 }));
  });

  render(<DashboardKPIs />);

  await waitFor(() => {
    expect(screen.getByText('Builds')).toBeInTheDocument();
    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.getByText('Package')).toBeInTheDocument();
  });
});
/* <!-- END RBP GENERATED: tenant-admin-ui-visibility --> */
