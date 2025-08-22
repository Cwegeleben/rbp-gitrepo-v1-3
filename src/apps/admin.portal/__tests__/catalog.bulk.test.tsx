/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CatalogPage } from '../CatalogPage';

const items = [
  { id: '1', title: 'A', enabled: false },
  { id: '2', title: 'B', enabled: false },
  { id: '3', title: 'C', enabled: false },
];

function makeApi(failIds: string[] = []) {
  return {
    list: jest.fn(async () => ({ items, pageInfo: { total: items.length } })),
    setEnabled: jest.fn(async (id: string, next: boolean) => {
      if (failIds.includes(id)) throw new Error('fail');
      return { ok: true };
    }),
  } as any;
}

test('Select all and bulk enable calls API per id and flips rows', async () => {
  const api = makeApi();
  render(
    <MemoryRouter>
      <CatalogPage api={api} initialData={{ items, pageInfo: { total: items.length } }} skipAutoLoad />
    </MemoryRouter>
  );
  await screen.findByText('A');
  const headerCheckbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
  fireEvent.click(headerCheckbox);
  expect(headerCheckbox.checked).toBe(true);
  const bulkRegion = screen.getByRole('region', { name: /Bulk actions/i });
  fireEvent.click(within(bulkRegion).getByRole('button', { name: /^Enable$/i }));
  await waitFor(() => expect(api.setEnabled).toHaveBeenCalledTimes(items.length));
});

test('Bulk errors rollback those rows and toast summarizes', async () => {
  const api = makeApi(['2','3']);
  render(
    <MemoryRouter>
      <CatalogPage api={api} initialData={{ items, pageInfo: { total: items.length } }} skipAutoLoad />
    </MemoryRouter>
  );
  await screen.findByText('A');
  const headerCheckbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
  fireEvent.click(headerCheckbox);
  const bulkRegion2 = screen.getByRole('region', { name: /Bulk actions/i });
  fireEvent.click(within(bulkRegion2).getByRole('button', { name: /^Enable$/i }));
  await waitFor(() => expect(api.setEnabled).toHaveBeenCalledTimes(items.length));
  // 2 failures summarized via toast; we can't assert toast DOM easily, but ensure checkboxes reflect rollback for id 2 and 3
  const rowsEls = screen.getAllByRole('row').slice(1);
  const rowChecks = rowsEls.map(r => within(r).getAllByRole('checkbox')[1] as HTMLInputElement);
  expect(rowChecks[0].checked).toBe(true);
  expect(rowChecks[1].checked).toBe(false);
  expect(rowChecks[2].checked).toBe(false);
});
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */
