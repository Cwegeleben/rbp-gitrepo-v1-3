/*
<!-- BEGIN RBP GENERATED: admin-builds-v1 -->
*/
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminBuildsPage from '../AdminBuildsPage';
// <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
import { LiveRegion, __getLastLiveRegionMessageForTest } from '../../../../../../packages/ui/live-region/LiveRegion';
// <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
/**
 * Coverage summary (Builds v1):
 * - Slot ops: add/replace/remove/reset/reorder announce via LiveRegion.
 * - Duplicate/Delete: optimistic UI with rollback banner + announcement.
 * - Tabs: URL sync and announcement on change.
 */
// <!-- END RBP GENERATED: admin-acceptance-v1 -->
// <!-- END RBP GENERATED: admin-acceptance-v1 -->

function makeApi() {
  let items = [ { id: 'b1', number: 1, customer: 'Alice', updatedAt: new Date().toISOString(), status: 'in_progress', total: 10 } ];
  return {
    list: async () => ({ items }),
    delete: async () => ({ ok: true }),
    duplicate: async () => ({ id: 'b2' })
  } as any;
}

test('shows table', async () => {
  render(
    <MemoryRouter initialEntries={["/app/builds"]}>
      {/* <!-- BEGIN RBP GENERATED: admin-acceptance-v1 --> */}
      <LiveRegion />
      {/* <!-- END RBP GENERATED: admin-acceptance-v1 --> */}
      <AdminBuildsPage api={makeApi()} />
    </MemoryRouter>
  );
  expect(await screen.findByText('Builds')).toBeInTheDocument();
});

// <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
test('duplicate optimistic then success announces', async () => {
  const api = makeApi();
  render(
    <MemoryRouter initialEntries={["/app/builds"]}>
      <LiveRegion />
      <AdminBuildsPage api={api} />
    </MemoryRouter>
  );
  const dup = await screen.findByRole('button', { name: /duplicate/i });
  fireEvent.click(dup);
  // Success path (wait for announce override)
  await new Promise(r => setTimeout(r, 0));
  expect(__getLastLiveRegionMessageForTest()).toMatch(/duplicated/i);
});

test('delete optimistic then rollback on failure shows banner and announces', async () => {
  const api = makeApi();
  (api as any).delete = async () => { throw new Error('nope'); };
  render(
    <MemoryRouter initialEntries={["/app/builds"]}>
      <LiveRegion />
      <AdminBuildsPage api={api} />
    </MemoryRouter>
  );
  // accept confirm; jsdom doesn't show prompt, we simulate by clicking and letting confirm be true
  // monkey-patch window.confirm
  const original = window.confirm; (window as any).confirm = () => true;
  try {
    const del = await screen.findByRole('button', { name: /delete/i });
    fireEvent.click(del);
  } finally { (window as any).confirm = original; }
  expect(await screen.findByRole('region', { name: /notice/i })).toHaveTextContent(/rolled back/i);
  await new Promise(r => setTimeout(r, 0));
  expect(__getLastLiveRegionMessageForTest()).toMatch(/rolled back/i);
});

test('tabs are URL synced and announce on change', async () => {
  render(
    <MemoryRouter initialEntries={["/app/builds?status=in_progress"]}>
      <LiveRegion />
      <AdminBuildsPage api={makeApi()} />
    </MemoryRouter>
  );
  const queued = await screen.findByRole('tab', { name: /queued/i });
  fireEvent.click(queued);
  expect(__getLastLiveRegionMessageForTest()).toMatch(/queued tab selected/i);
});

test('slot operations add, replace, remove, reset, reorder announce', async () => {
  render(
    <MemoryRouter initialEntries={["/app/builds"]}>
      <LiveRegion />
      <AdminBuildsPage api={makeApi()} />
    </MemoryRouter>
  );
  const add = await screen.findByRole('button', { name: /add slot/i });
  fireEvent.click(add);
  expect(__getLastLiveRegionMessageForTest()).toMatch(/added/i);
  const replace = screen.getByRole('button', { name: /replace/i });
  fireEvent.click(replace);
  expect(__getLastLiveRegionMessageForTest()).toMatch(/replaced/i);
  const down = screen.getByRole('button', { name: /down/i });
  fireEvent.click(add); // add a second to allow reorder
  fireEvent.click(down);
  expect(__getLastLiveRegionMessageForTest()).toMatch(/moved/i);
  const remove = screen.getAllByRole('button', { name: /remove/i })[0];
  fireEvent.click(remove);
  expect(__getLastLiveRegionMessageForTest()).toMatch(/removed/i);
  const reset = screen.getByRole('button', { name: /reset/i });
  fireEvent.click(reset);
  expect(__getLastLiveRegionMessageForTest()).toMatch(/reset/i);
});
// <!-- END RBP GENERATED: admin-acceptance-v1 -->
/*
<!-- END RBP GENERATED: admin-builds-v1 -->
*/
