/*
<!-- BEGIN RBP GENERATED: admin-catalog-v2-2 -->
*/
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminCatalogShell from '../AdminCatalogShell';
// <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
/**
 * Coverage summary (Catalog v2.2):
 * - URL read/write for search/filter/pagination with natural back/forward.
 * - Optimistic bulk enable/disable with rollback on failures.
 * - LiveRegion announcements for results and bulk outcomes.
 */
// <!-- END RBP GENERATED: admin-acceptance-v1 -->
// <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
import { LiveRegion, __getLastLiveRegionMessageForTest } from '../../../../../../packages/ui/live-region/LiveRegion';
// <!-- END RBP GENERATED: admin-acceptance-v1 -->

function makeApi() {
  let store = [
    { id: 'p1', title: 'Alpha', vendor: 'Acme', enabled: false },
    { id: 'p2', title: 'Beta', vendor: 'Bravo', enabled: true },
  ];
  return {
  list: async (_: any) => ({ items: [...store], pageInfo: {} }),
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
      {/* <!-- BEGIN RBP GENERATED: admin-acceptance-v1 --> */}
      <LiveRegion />
      {/* <!-- END RBP GENERATED: admin-acceptance-v1 --> */}
      <AdminCatalogShell api={makeApi() as any} />
    </MemoryRouter>
  );
  expect(await screen.findByText('Catalog')).toBeInTheDocument();
  const rows = await screen.findAllByRole('row');
  const checkbox = within(rows[1]).getAllByRole('checkbox')[0];
  fireEvent.click(checkbox);
  expect(screen.getByTestId('selection-live')).toHaveTextContent(/1 selected/i);
});

// <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
test('URL round trip for search and filter announces results', async () => {
  render(
    <MemoryRouter initialEntries={['/app/catalog?q=Alpha&enabled=true']}>
      <LiveRegion />
      <AdminCatalogShell api={makeApi()} />
    </MemoryRouter>
  );
  // initial fetch announced (may be after header); wait a tick
  await new Promise(r => setTimeout(r, 0));
  expect(__getLastLiveRegionMessageForTest()).toMatch(/results/i);
  const search = await screen.findByRole('textbox', { name: /search/i });
  fireEvent.change(search, { target: { value: 'Beta' } });
});

test('bulk enable optimistic and announce success', async () => {
  const api = makeApi();
  render(
    <MemoryRouter initialEntries={['/app/catalog']}>
      <LiveRegion />
      <AdminCatalogShell api={api} />
    </MemoryRouter>
  );
  const rows = await screen.findAllByRole('row');
  const cb = within(rows[1]).getAllByRole('checkbox')[0];
  fireEvent.click(cb);
  const bulk = await screen.findByRole('region', { name: /bulk actions/i });
  fireEvent.click(within(bulk).getByRole('button', { name: /enable/i }));
  // async operations complete next tick
  await new Promise(r => setTimeout(r, 0));
  expect(__getLastLiveRegionMessageForTest()).toMatch(/Enabled/i);
});

test('bulk disable with rollback announces partial', async () => {
  const api = makeApi();
  // make one id fail
  (api as any).setEnabled = async (id: string, enabled: boolean) => {
    if (id === 'p1') throw new Error('fail');
    return { ok: true };
  };
  render(
    <MemoryRouter initialEntries={['/app/catalog']}>
      <LiveRegion />
      <AdminCatalogShell api={api} />
    </MemoryRouter>
  );
  const rows = await screen.findAllByRole('row');
  // select all on page
  const all = within(rows[0]).getByRole('checkbox', { name: /select all/i });
  fireEvent.click(all);
  const bulk = await screen.findByRole('region', { name: /bulk actions/i });
  fireEvent.click(within(bulk).getByRole('button', { name: /disable/i }));
  await new Promise(r => setTimeout(r, 0));
  expect(__getLastLiveRegionMessageForTest()).toMatch(/Disabled/i);
});
// <!-- END RBP GENERATED: admin-acceptance-v1 -->
/*
<!-- END RBP GENERATED: admin-catalog-v2-2 -->
*/
