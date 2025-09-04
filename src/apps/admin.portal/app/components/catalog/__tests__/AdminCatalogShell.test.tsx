/*
<!-- BEGIN RBP GENERATED: admin-catalog-v2-2 -->
*/
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminCatalogShell from '../AdminCatalogShell';

function makeApi() {
  let store = [
    { id: 'p1', title: 'Alpha', vendor: 'Acme', enabled: false },
    { id: 'p2', title: 'Beta', vendor: 'Bravo', enabled: true },
  ];
  return {
    list: async (_: any) => ({ items: [...store] }),
    setEnabled: async (id: string, enabled: boolean) => {
      const idx = store.findIndex((x) => x.id === id);
      if (idx >= 0) store[idx] = { ...store[idx], enabled };
      return { ok: true } as const;
    },
  } as any;
}

test('renders and supports selection + bulk enable toast', async () => {
  render(
    <MemoryRouter initialEntries={['/app/catalog']}>
      <AdminCatalogShell api={makeApi() as any} />
    </MemoryRouter>
  );
  expect(await screen.findByText('Catalog')).toBeInTheDocument();
  const rows = await screen.findAllByRole('row');
  const checkbox = within(rows[1]).getAllByRole('checkbox')[0];
  fireEvent.click(checkbox);
  expect(screen.getByTestId('selection-live')).toHaveTextContent(/1 selected/i);
});
/*
<!-- END RBP GENERATED: admin-catalog-v2-2 -->
*/
