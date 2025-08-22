/* <!-- BEGIN RBP GENERATED: tenant-admin-audit-proxy --> */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
/* <!-- BEGIN RBP GENERATED: tenant-admin-audit-proxy --> */
import * as proxyMod from '../fetchProxy.server';
import { CatalogPage } from '../CatalogPage';
import { MemoryRouter } from 'react-router-dom';

describe('proxy wrapper enforcement', () => {
  it('uses fetchProxy for /apps/proxy/* requests (no direct fetch)', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
  const wrapperSpy = jest.spyOn(proxyMod, 'fetchProxy');

  wrapperSpy.mockResolvedValueOnce(new Response(JSON.stringify({ items: [], pageInfo: {} }), { status: 200 }));

  render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(wrapperSpy).toHaveBeenCalled());
  expect(fetchSpy).not.toHaveBeenCalled();

  fetchSpy.mockRestore();
  wrapperSpy.mockRestore();
  });
});
/* <!-- END RBP GENERATED: tenant-admin-audit-proxy --> */
/* <!-- END RBP GENERATED: tenant-admin-audit-proxy --> */
