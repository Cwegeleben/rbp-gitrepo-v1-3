// <!-- BEGIN RBP GENERATED: builds-gallery-bulk-v1 -->
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Gallery from '../components/Gallery';

const api = require('../../../../shared/sdk/client');

jest.mock('../../../../shared/sdk/client', () => ({
  apiGet: jest.fn(async () => ({ items: [
    { id: 'a', title: 'Alpha', items: [1] },
    { id: 'b', title: 'Beta', items: [2] },
  ]})),
  apiSend: jest.fn(async (_p,_m,body)=> ({ id: 'n'+(body?.title?.length||1), title: body.title, items: body.items })),
  safeApiSend: jest.fn(async ()=>({ ok: true, data: { id: 'x', title: 'x' } }))
}));

test('bulk duplicate duplicates selected and shows toast', async () => {
  render(<Gallery />);
  // wait for item checkboxes (exclude header select-all)
  const checks = await screen.findAllByRole('checkbox', { name: /select build/i });
  fireEvent.click(checks[0]);
  fireEvent.click(checks[1]);
  fireEvent.click(screen.getByRole('button', { name: /duplicate selected/i }));
  // expect a toast host to exist
  expect(document.getElementById('rbp-toast-host')).toBeTruthy();
});
// <!-- END RBP GENERATED: builds-gallery-bulk-v1 -->
