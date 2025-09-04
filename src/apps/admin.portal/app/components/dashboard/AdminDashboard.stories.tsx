/*
<!-- BEGIN RBP GENERATED: admin-dashboard-v1 -->
*/
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';

export default {
  title: 'Admin/Dashboard',
  component: AdminDashboard,
};

function withFetch(mock: (url: string, init?: any) => Response | Promise<Response>) {
  (global as any).fetch = (input: RequestInfo, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : (input as Request).url;
    return Promise.resolve(mock(url, init));
  };
}

export const Loading = () => {
  withFetch(() => new Promise<Response>(() => {}));
  return (
    <MemoryRouter initialEntries={["/app?shop=x&host=y&embedded=1"]}>
      <Routes>
        <Route path="/app" element={<AdminDashboard />} />
      </Routes>
    </MemoryRouter>
  );
};

export const Ready = () => {
  withFetch((url) => {
    if (url.includes('/apps/proxy/api/builds?status=in_progress')) {
      return new Response(JSON.stringify({ items: [
        { id: 'b1', title: 'Build 1', customer: 'Alice', updatedAt: '2025-08-24T12:00:00Z', status: 'in_progress', total: 10.5 },
      ] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('/apps/proxy/api/builds')) {
      return new Response(JSON.stringify({ items: [], pageInfo: { total: 7 } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('/apps/proxy/api/catalog/products?enabled=false')) {
      return new Response(JSON.stringify({ count: 3 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('/apps/proxy/api/orders')) {
      return new Response(JSON.stringify({ count: 2 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('/apps/proxy/modules/health')) {
      return new Response(JSON.stringify({ ok: true, modules: {}, errors: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('{}', { status: 200 });
  });
  return (
    <MemoryRouter initialEntries={["/app?shop=x&host=y&embedded=1"]}>
      <Routes>
        <Route path="/app" element={<AdminDashboard />} />
      </Routes>
    </MemoryRouter>
  );
};

export const Error = () => {
  withFetch((url) => new Response('error', { status: 500 }));
  return (
    <MemoryRouter initialEntries={["/app?shop=x&host=y&embedded=1"]}>
      <Routes>
        <Route path="/app" element={<AdminDashboard />} />
      </Routes>
    </MemoryRouter>
  );
};
/*
<!-- END RBP GENERATED: admin-dashboard-v1 -->
*/
