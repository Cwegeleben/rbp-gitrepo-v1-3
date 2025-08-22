/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { CatalogPage, createCatalogApi } from "../CatalogPage";

export default {
  title: "Catalog/CatalogPage",
  component: CatalogPage,
};

function mockApi(overrides: Partial<ReturnType<typeof createCatalogApi>> = {}) {
  const api = createCatalogApi(async (input: any, init?: any) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.startsWith('/apps/proxy/api/catalog/products')) {
      return new Response(
        JSON.stringify({ items: [], pageInfo: { nextCursor: undefined, prevCursor: undefined } }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response('{}', { status: 200 });
  });
  return Object.assign({}, api, overrides);
}

export const Loading = () => (
  <MemoryRouter initialEntries={["/catalog?q=&vendor=&tags="]}>
    <CatalogPage api={mockApi()} />
  </MemoryRouter>
);

export const Empty = () => (
  <MemoryRouter initialEntries={["/catalog?q=&vendor=&tags="]}>
    <CatalogPage api={mockApi()} />
  </MemoryRouter>
);

export const ErrorState = () => (
  <MemoryRouter initialEntries={["/catalog?q=&vendor=&tags="]}>
    <CatalogPage api={mockApi({
      list: async () => { throw new Error('Boom'); }
    })} />
  </MemoryRouter>
);

export const Filtered = () => (
  <MemoryRouter initialEntries={["/catalog?q=rod&vendor=Acme,Zen&tags=fresh,pro"]}>
    <CatalogPage api={mockApi({
      list: async () => ({
        items: [
          { id: '1', title: 'Rod A', vendor: 'Acme', tags: ['fresh'], priceBand: 'A', enabled: false },
          { id: '2', title: 'Rod B', vendor: 'Zen', tags: ['pro'], priceBand: 'B', enabled: true },
        ],
        pageInfo: { nextCursor: undefined, prevCursor: undefined },
      })
    })} />
  </MemoryRouter>
);

export const ToggleFail = () => (
  <MemoryRouter initialEntries={["/catalog?q=&vendor=&tags="]}>
    <CatalogPage api={mockApi({
      list: async () => ({
        items: [
          { id: '1', title: 'Rod A', vendor: 'Acme', tags: ['fresh'], priceBand: 'A', enabled: false },
        ],
        pageInfo: { nextCursor: undefined, prevCursor: undefined },
      }),
      setEnabled: async () => { throw new Error('nope'); }
    })} />
  </MemoryRouter>
);
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
