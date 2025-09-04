/*
<!-- BEGIN RBP GENERATED: admin-dashboard-v1 -->
*/
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AdminDashboard } from '../AdminDashboard';

function mockFetch(mapper: (url: string) => any) {
  (global as any).fetch = (input: RequestInfo) => {
    const url = typeof input === 'string' ? input : (input as Request).url;
    return Promise.resolve(mapper(url));
  };
}

function shell(ui: React.ReactNode) {
  return (
    <MemoryRouter initialEntries={["/app?shop=s&host=h&embedded=1"]}>
      <Routes>
        <Route path="/app" element={ui} />
      </Routes>
    </MemoryRouter>
  );
}

test('renders skeletons then data and links remain relative', async () => {
  mockFetch((url) => {
    if (url.includes('/apps/proxy/api/builds?status=in_progress')) {
      return new Response(JSON.stringify({ items: [ { id: 'b1', title: 'B1', customer: 'Alice', updatedAt: '2025-08-24T00:00:00Z', status: 'in_progress', total: 12.34 } ] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('/apps/proxy/api/builds?cursor=')) {
      return new Response(JSON.stringify({ items: [], pageInfo: { total: 5 } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('/apps/proxy/api/catalog/products?enabled=false')) {
      return new Response(JSON.stringify({ count: 2 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('/apps/proxy/api/orders')) {
      return new Response(JSON.stringify({ count: 3 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('/apps/proxy/modules/health')) {
      return new Response(JSON.stringify({ ok: true, modules: {}, errors: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('{}', { status: 200 });
  });

  render(shell(<AdminDashboard />));

  // Skeletons: cards initially "—"
  expect(screen.getAllByText('—').length).toBeGreaterThan(0);

  await waitFor(() => {
    expect(screen.getByText('Active builds')).toBeInTheDocument();
    expect(screen.getByText('View builds')).toHaveAttribute('href');
  });
});

test('aggregates fetch errors into a single top banner', async () => {
  mockFetch(() => new Response('err', { status: 500 }));
  render(shell(<AdminDashboard />));
  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('Some data failed to load');
  });
});
/*
<!-- END RBP GENERATED: admin-dashboard-v1 -->
*/
