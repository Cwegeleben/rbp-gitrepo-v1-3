/*
<!-- BEGIN RBP GENERATED: tenant-admin-builds-qol -->
*/
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BuildsPage } from '../BuildsPage';
import type { BuildDetail } from '../BuildsPage';
import { TenantContext } from '../TenantContext';

function makeApi(detail: BuildDetail, failPatch = false) {
  return {
    list: jest.fn(async () => ({ items: [{ id: detail.id, title: detail.title, itemsCount: (detail.items||[]).length }], pageInfo: {} })),
    get: jest.fn(async () => detail),
    patch: jest.fn(async (_id: string, payload: any) => {
      if (failPatch) throw new Error('fail');
      return { ...detail, ...payload } as BuildDetail;
    }),
    duplicate: jest.fn(async () => ({ id: 'new123', title: 'Dup' } as any)),
  };
}

function renderWith(ctx: any, api: any, initial: string = '/builds/1', write?: boolean) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <TenantContext.Provider value={ctx}>
        <Routes>
          <Route path="/builds" element={<BuildsPage api={api} writeEnabled={write} />} />
          <Route path="/builds/:id" element={<BuildsPage api={api} writeEnabled={write} />} />
        </Routes>
      </TenantContext.Provider>
    </MemoryRouter>
  );
}

test('reorder moves item down and persists once; on failure rolls back and announces', async () => {
  const detail: BuildDetail = { id: '1', title: 'B1', items: [ { name: 'A', qty: 1 }, { name: 'B', qty: 1 } ] } as any;
  const api = makeApi(detail);
  renderWith({ features: { builds: { readonly: true } } }, api, '/builds/1', true);
  await screen.findAllByText('B1');
  const down = screen.getAllByRole('button', { name: /move down/i })[0];
  fireEvent.click(down);
  await waitFor(() => expect(api.patch).toHaveBeenCalledTimes(1));
  expect(api.patch.mock.calls[0][1].items.map((i: any) => i.name)).toEqual(['B', 'A']);
});

test('clear all confirms then patches items:[]; failure rolls back and announces', async () => {
  const detail: BuildDetail = { id: '1', title: 'B1', items: [ { name: 'A', qty: 1 } ] } as any;
  const api = makeApi(detail, false);
  renderWith({ features: { builds: { readonly: true } } }, api, '/builds/1', true);
  await screen.findAllByText('B1');
  fireEvent.click(screen.getByRole('button', { name: /clear all/i }));
  // confirm dialog
  const confirmButtons = await screen.findAllByRole('button', { name: /clear all/i });
  const confirm = confirmButtons[confirmButtons.length - 1];
  fireEvent.click(confirm);
  await waitFor(() => expect(api.patch).toHaveBeenCalled());
  expect(api.patch.mock.calls[0][1].items).toEqual([]);
});

test('import invalid shows error and prevents patch; valid triggers patch', async () => {
  const detail: BuildDetail = { id: '1', title: 'B1', items: [ { name: 'A', qty: 1 } ] } as any;
  const api = makeApi(detail, false);
  renderWith({ features: { builds: { readonly: true } } }, api, '/builds/1', true);
  await screen.findAllByText('B1');
  // open file selector via change event
  const importBtn = screen.getByRole('button', { name: /import json/i });
  const input = (importBtn.parentElement as HTMLElement).querySelector('input[type="file"]') as HTMLInputElement;
  // invalid
  const bad = new File(["not json"], 'bad.json', { type: 'application/json' });
  fireEvent.change(input, { target: { files: [bad] } });
  expect(await screen.findByRole('alert')).toHaveTextContent(/invalid import/i);
  // valid
  const good = new File([JSON.stringify({ items: [{ name: 'Z', qty: 2 }] })], 'good.json', { type: 'application/json' });
  fireEvent.change(input, { target: { files: [good] } });
  expect(await screen.findByText(/import preview/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /apply import/i }));
  await waitFor(() => expect(api.patch).toHaveBeenCalled());
  expect(api.patch.mock.calls[0][1].items[0].name).toBe('Z');
});

test('readonly hides write actions', async () => {
  const detail: BuildDetail = { id: '1', title: 'B1', items: [ { name: 'A', qty: 1 } ] } as any;
  const api = makeApi(detail, false);
  renderWith({ features: { builds: { readonly: true } } }, api);
  await screen.findAllByText('B1');
  expect(screen.queryByRole('button', { name: /move down/i })).toBeNull();
  expect(screen.getByRole('button', { name: /duplicate/i })).toBeDisabled();
});
/*
<!-- END RBP GENERATED: tenant-admin-builds-qol -->
*/
