// <!-- BEGIN RBP GENERATED: builds-gallery-bulk-v1 -->
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Gallery from '../components/Gallery';

let fail = false;
jest.mock('../../../../shared/sdk/client', () => ({
  apiGet: jest.fn(async () => ({ items: [ { id: 'a', title: 'Alpha', items: [] } ] })),
  apiSend: jest.fn(async (p,m,body)=> { if (m==='PATCH' && fail) throw new Error('fail'); return { ...(body||{}), id: 'a' }; }),
  safeApiSend: jest.fn(async (p,m,body)=> ({ ok: !fail }))
}));

test('inline rename optimistic then rollback on failure', async () => {
  render(<Gallery />);
  const title = await screen.findByText('Alpha');
  fireEvent.keyDown(title, { key: 'Enter' });
  const input = await screen.findByRole('textbox', { name: /edit title/i });
  fireEvent.change(input, { target: { value: 'New Name' } });
  fireEvent.click(screen.getByRole('button', { name: /save title/i }));
  await screen.findByText('New Name');
  // now fail next update and try again
  fail = true;
  fireEvent.keyDown(screen.getByText('New Name'), { key: 'Enter' });
  const input2 = await screen.findByRole('textbox', { name: /edit title/i });
  fireEvent.change(input2, { target: { value: 'Bad Name' } });
  fireEvent.click(screen.getByRole('button', { name: /save title/i }));
  await waitFor(()=> expect(screen.getByText('New Name')).toBeInTheDocument());
});
// <!-- END RBP GENERATED: builds-gallery-bulk-v1 -->
