/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { BuildsPage, createBuildsApi } from "../BuildsPage";

export default {
  title: "Builds/BuildsPage",
  component: BuildsPage,
};

function mockApi(overrides: Partial<ReturnType<typeof createBuildsApi>> = {}) {
  const api = createBuildsApi(async (input: any) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.startsWith('/apps/proxy/api/builds?')) {
      return new Response(
        JSON.stringify({ items: [], pageInfo: {} }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (url.startsWith('/apps/proxy/api/builds/')) {
      return new Response(JSON.stringify({ id: 'x', title: 'Build X', items: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('{}', { status: 200 });
  });
  return Object.assign({}, api, overrides);
}

export const Empty = () => (
  <MemoryRouter initialEntries={["/builds"]}>
    <Routes>
      <Route path="/builds" element={<BuildsPage api={mockApi()} />} />
    </Routes>
  </MemoryRouter>
);

export const LongList = () => (
  <MemoryRouter initialEntries={["/builds"]}>
    <Routes>
      <Route path="/builds" element={<BuildsPage api={mockApi({
        list: async () => ({
          items: Array.from({ length: 50 }).map((_, i) => ({ id: String(i+1), title: `Build #${i+1}`, itemsCount: Math.floor(Math.random()*10), createdAt: '2025-08-21' })),
          pageInfo: { nextCursor: undefined, prevCursor: undefined }
        })
      })} />} />
    </Routes>
  </MemoryRouter>
);

export const DetailLoads = () => (
  <MemoryRouter initialEntries={["/builds/123"]}>
    <Routes>
      <Route path="/builds/:id" element={<BuildsPage api={mockApi({
        list: async () => ({ items: [{ id: '123', title: 'Build 123', itemsCount: 3 }], pageInfo: {} }),
        get: async () => ({ id: '123', title: 'Build 123', items: [{ name: 'Item A', qty: 1 }, { name: 'Item B', qty: 2 }] })
      })} />} />
    </Routes>
  </MemoryRouter>
);

export const NotFound403 = () => (
  <MemoryRouter initialEntries={["/builds/xyz"]}>
    <Routes>
      <Route path="/builds/:id" element={<BuildsPage api={mockApi({
        list: async () => ({ items: [], pageInfo: {} }),
        get: async () => { const e = new Error('Forbidden') as any; e.status = 403; throw e; }
      })} />} />
    </Routes>
  </MemoryRouter>
);
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
