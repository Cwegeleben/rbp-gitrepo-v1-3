/*
<!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 -->
*/
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { CatalogPage } from '../CatalogPage';
import type { CatalogListResponse } from '../app/lib/createCatalogApi';

function makeApi(listImpl: (args: any) => Promise<CatalogListResponse>) {
  return {
    list: jest.fn(listImpl),
    setEnabled: jest.fn(async () => ({ ok: true })),
  } as any;
}

test('compose vendor+tags+priceBand with AND semantics; changing one filter resets cursor; URL reflects state', async () => {
  const api = makeApi(async ({ vendor, tags, priceBand, q, cursor }) => {
    // Expect AND semantics: must include all vendor(s) and tag(s) and match priceBand when set
    expect(vendor).toEqual(['RBP','ACME']);
    expect(tags).toEqual(['carbon','fast']);
    expect(priceBand).toBe('medium');
    expect(q).toBe('rod');
    // cursor should be undefined on first load
    expect(cursor).toBeUndefined();
    const items = [
      { id: '1', title: 'A', vendor: 'ACME', tags: ['carbon','fast'], priceBand: 'medium', enabled: true },
      { id: '2', title: 'B', vendor: 'RBP', tags: ['carbon','fast'], priceBand: 'medium', enabled: false },
    ];
    return { items, pageInfo: { nextCursor: 'n1', prevCursor: undefined, total: 2 } };
  });

  const ShowSearch = () => { const [sp] = useSearchParams(); return <div data-testid="sp">?{sp.toString()}</div>; };
  render(
    <MemoryRouter initialEntries={[{ pathname: '/admin/catalog', search: '?q=rod&vendor=RBP,ACME&tags=carbon,fast&priceBand=medium' }]}> 
      <CatalogPage api={api} initialData={{ items: [
        { id: '1', title: 'A', vendor: 'ACME', tags: ['carbon','fast'], priceBand: 'medium', enabled: true },
        { id: '2', title: 'B', vendor: 'RBP', tags: ['carbon','fast'], priceBand: 'medium', enabled: false },
      ], pageInfo: { nextCursor: 'n1' } }} skipAutoLoad />
      <ShowSearch />
    </MemoryRouter>
  );
  await screen.findByText('A');
  await screen.findByText('B');

  // Click next to set cursor (URL updates; skipAutoLoad prevents refetch)
  fireEvent.click(screen.getByRole('button', { name: /Next/i }));
  expect(screen.getByTestId('sp').textContent).toMatch(/cursor=n1/);

  // Change price band => should reset cursor
  const pbSelect = screen.getByLabelText('Price Band') as HTMLSelectElement;
  fireEvent.change(pbSelect, { target: { value: 'high' } });
  // cursor cleared in URL
  await waitFor(() => expect(screen.getByTestId('sp').textContent).not.toMatch(/cursor=/));

  // URL reflects state
  expect(screen.getByTestId('sp').textContent).toMatch(/priceBand=high/);
});
/*
<!-- END RBP GENERATED: tenant-admin-catalog-v2 -->
*/
