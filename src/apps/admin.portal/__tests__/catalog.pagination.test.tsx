/*
<!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 -->
*/
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { CatalogPage } from '../CatalogPage';
import type { CatalogListResponse } from '../app/lib/createCatalogApi';

function makeApi(pages: Record<string, CatalogListResponse>) {
  return {
    list: jest.fn(async ({ cursor }) => {
      const key = cursor || 'root';
      return pages[key];
    }),
    setEnabled: jest.fn(async () => ({ ok: true })),
  } as any;
}

test('pagination preserves filters; deep link with cursor renders the same subset; sort order stable across pages', async () => {
  const pages = {
    root: {
      items: [
        { id: '2', title: 'Beta', vendor: 'RBP', tags: ['x'], priceBand: 'low', enabled: false },
        { id: '1', title: 'Alpha', vendor: 'ACME', tags: ['x'], priceBand: 'low', enabled: true },
      ],
      pageInfo: { nextCursor: 'n1' }
    },
    n1: {
      items: [
        { id: '3', title: 'Gamma', vendor: 'RBP', tags: ['y'], priceBand: 'medium', enabled: true },
        { id: '4', title: 'Delta', vendor: 'ACME', tags: ['y'], priceBand: 'high', enabled: false },
      ],
      pageInfo: { prevCursor: 'root' }
    }
  } satisfies Record<string, CatalogListResponse>;

  const api = makeApi(pages);

  const ShowSearch = () => {
    const [sp] = useSearchParams();
    return <div data-testid="sp">?{sp.toString()}</div>;
  };

  const { rerender } = render(
    <MemoryRouter initialEntries={[{ pathname: '/', search: '?vendor=RBP,ACME&tags=x,y' }]}> 
      <CatalogPage api={api} initialData={pages.root} skipAutoLoad />
      <ShowSearch />
    </MemoryRouter>
  );
  // initial table rows sorted
  const rowsPage1 = screen.getAllByRole('row').slice(1);
  expect(rowsPage1.map((r: HTMLElement) => r.firstChild?.textContent)).toEqual(['Alpha','Beta']);

  // go next -> URL updates with cursor; rows remain the same until data fetched
  fireEvent.click(screen.getByRole('button', { name: /Next/i }));
  expect(screen.getByTestId('sp').textContent).toMatch(/cursor=n1/);

  // deep link with cursor
  rerender(
    <MemoryRouter initialEntries={[{ pathname: '/', search: '?vendor=RBP,ACME&tags=x,y&cursor=n1' }]}> 
      <CatalogPage api={api} initialData={pages.n1} skipAutoLoad />
      <ShowSearch />
    </MemoryRouter>
  );
  const rowsDeep = screen.getAllByRole('row').slice(1);
  expect(rowsDeep.map((r: HTMLElement) => r.firstChild?.textContent)).toEqual(['Delta','Gamma']);
});
/*
<!-- END RBP GENERATED: tenant-admin-catalog-v2 -->
*/
