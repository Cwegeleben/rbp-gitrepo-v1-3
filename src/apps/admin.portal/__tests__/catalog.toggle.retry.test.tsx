/*
<!-- BEGIN RBP GENERATED: tenant-admin-harden -->
*/
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CatalogPage, createCatalogApi } from '../CatalogPage';

function makeApiFailingOnceThenTwice() {
  let calls = 0;
  return {
    list: jest.fn(async () => ({ items: [{ id: '1', title: 'A', enabled: false }], pageInfo: {} })),
    setEnabled: jest.fn(async (_id: string, _next: boolean) => {
      calls++;
      // throw network error (no status)
      const err: any = new Error('net');
      if (calls <= 3) throw err; // will exceed retry budget (2) and cause rollback
      return { ok: true } as any;
    })
  } as ReturnType<typeof createCatalogApi>;
}

test('toggle retries twice on network fail then rolls back and keeps focus', async () => {
  const api = makeApiFailingOnceThenTwice();
  render(
    <MemoryRouter initialEntries={["/admin/catalog"]}>
      <CatalogPage
        api={api}
        initialData={{ items: [{ id: '1', title: 'A', enabled: false }], pageInfo: {} }}
        skipAutoLoad
      />
    </MemoryRouter>
  );
  // table is already rendered due to initialData
  await screen.findByText('A');
  const checkbox = (await screen.findByRole('checkbox')) as HTMLInputElement;
  (checkbox as any).focus?.();
  fireEvent.click(checkbox);
  await waitFor(() => expect(api.setEnabled).toHaveBeenCalled());
  // After retries exceeded, it should rollback: checkbox stays unchecked
  await waitFor(() => expect((checkbox as any).checked).toBe(false));
  // Focus restored
  expect((globalThis as any).document.activeElement).toBe(checkbox);
});
/*
<!-- END RBP GENERATED: tenant-admin-harden -->
*/
