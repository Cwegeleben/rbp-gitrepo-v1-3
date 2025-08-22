/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Nav } from '../Nav';
import { MemoryRouter } from 'react-router-dom';
import { TenantContext } from '../TenantContext';

test('nav hides Builds when readonly is false', () => {
  const ctx = { features: { builds: { readonly: false }, catalog: { v2: true }, settings: { readonly: true } } };
  render(
    <MemoryRouter initialEntries={["/"]}>
      <TenantContext.Provider value={ctx}>
        <Nav ctx={ctx} />
      </TenantContext.Provider>
    </MemoryRouter>
  );
  expect(screen.queryByText('Builds')).toBeNull();
  expect(screen.getByText('Catalog')).toBeInTheDocument();
  expect(screen.getByText('Settings')).toBeInTheDocument();
});
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
