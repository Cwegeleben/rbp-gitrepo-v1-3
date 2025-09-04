/*
<!-- BEGIN RBP GENERATED: admin-builds-v1 -->
*/
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminBuildsPage from '../AdminBuildsPage';

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
      <AdminBuildsPage api={makeApi()} />
    </MemoryRouter>
  );
  expect(await screen.findByText('Builds')).toBeInTheDocument();
});
/*
<!-- END RBP GENERATED: admin-builds-v1 -->
*/
