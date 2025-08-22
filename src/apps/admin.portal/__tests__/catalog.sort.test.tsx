/* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2-1 --> */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { CatalogPage } from '../CatalogPage';

const items = [
  { id: '1', title: 'Alpha', vendor: 'Zeta', priceBand: 2, enabled: true },
  { id: '2', title: 'Beta', vendor: 'Alpha', priceBand: 1, enabled: false },
  { id: '3', title: 'Gamma', vendor: 'Alpha', priceBand: 3, enabled: true },
];

function makeApi() {
  return { list: jest.fn(async () => ({ items, pageInfo: { total: items.length } })), setEnabled: jest.fn(async () => ({ ok: true })) } as any;
}

const ShowSearch = () => { const [sp] = useSearchParams(); return <div data-testid="sp">?{sp.toString()}</div>; };

test('Vendor header toggles asc/desc; aria-sort updates; URL reflects sort', async () => {
  const api = makeApi();
  render(
    <MemoryRouter initialEntries={[{ pathname: '/admin/catalog' }] }>
      <CatalogPage api={api} initialData={{ items, pageInfo: { total: items.length } }} skipAutoLoad />
      <ShowSearch />
    </MemoryRouter>
  );
  // initial sort defaults to vendor asc
  const vendorBtn = screen.getByRole('button', { name: /Sort by Vendor/i });
  expect((vendorBtn.closest('th') as HTMLElement).getAttribute('aria-sort')).toBe('ascending');
  // click to desc
  fireEvent.click(vendorBtn);
  expect((vendorBtn.closest('th') as HTMLElement).getAttribute('aria-sort')).toBe('descending');
  expect(screen.getByTestId('sp').textContent).toMatch(/sort=vendor%3Adesc/);
  // click to asc again
  fireEvent.click(vendorBtn);
  expect((vendorBtn.closest('th') as HTMLElement).getAttribute('aria-sort')).toBe('ascending');
  expect(screen.getByTestId('sp').textContent).toMatch(/sort=vendor%3Aasc/);
});

/* stability: vendor -> title -> priceBand -> enabled */
 test('Sort stability chain is respected', async () => {
  const api = makeApi();
  render(
    <MemoryRouter initialEntries={[{ pathname: '/admin/catalog' }] }>
      <CatalogPage api={api} initialData={{ items, pageInfo: { total: items.length } }} skipAutoLoad />
    </MemoryRouter>
  );
  // sorted vendor asc puts Alpha vendors before Zeta, but among Alpha, title asc
  const rows = screen.getAllByRole('row');
  // header + 3 rows
  expect(rows.length).toBeGreaterThan(1);
  const bodyRows = rows.slice(1);
  const titles = bodyRows.map(r => r.querySelector('td:nth-child(2)')?.textContent || '');
  expect(titles[0]).toBe('Beta'); // Alpha vendor with Beta title before Gamma
});
/* <!-- END RBP GENERATED: tenant-admin-catalog-v2-1 --> */
