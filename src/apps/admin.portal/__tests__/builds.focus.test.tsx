/*
<!-- BEGIN RBP GENERATED: tenant-admin-harden -->
*/
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BuildsPage, createBuildsApi } from '../BuildsPage';
import { TenantContext } from '../TenantContext';

function makeApi() {
  return {
    list: jest.fn(async () => ({ items: [{ id: 'b1', title: 'Build 1', itemsCount: 1 }], pageInfo: {} })),
  get: jest.fn(async (_id: string) => ({ id: 'b1', title: 'Build 1', items: [] })),
  patch: jest.fn(async (_id: string, payload: any) => ({ id: 'b1', title: 'Build 1', items: payload?.items ?? [] })),
  duplicate: jest.fn(async (_id: string) => ({ id: 'b1-copy', title: 'Build 1 Copy', items: [] } as any)),
  } as ReturnType<typeof createBuildsApi>;
}

test('focus returns to invoking row after panel close', async () => {
  const api = makeApi();
  render(
    <MemoryRouter initialEntries={["/builds"]}>
      <TenantContext.Provider value={{ features: { builds: { readonly: true } } }}>
        <Routes>
          <Route path="/builds" element={<BuildsPage api={api} />} />
          <Route path="/builds/:id" element={<BuildsPage api={api} />} />
        </Routes>
      </TenantContext.Provider>
    </MemoryRouter>
  );
  // Navigate to detail by clicking link
  const link = (await screen.findByRole('link', { name: /Build 1/i })) as HTMLElement;
  (link as any).focus?.();
  fireEvent.click(link);
  const closeBtn = await screen.findByRole('button', { name: /Close/i });
  fireEvent.click(closeBtn);
  await waitFor(() => expect((globalThis as any).document.activeElement).toBe(link));
});
/*
<!-- END RBP GENERATED: tenant-admin-harden -->
*/
