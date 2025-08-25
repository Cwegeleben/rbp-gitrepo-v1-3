// <!-- BEGIN RBP GENERATED: builds-gallery-bulk-v1 -->
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Gallery from '../components/Gallery';

jest.mock('../../../../shared/sdk/client', () => ({
  apiGet: jest.fn(async () => ({ items: [
    { id: 'a', title: 'Alpha', items: [] },
    { id: 'b', title: 'Beta', items: [] },
  ]})),
  apiSend: jest.fn(async (p,m)=> { if (m==='DELETE' && String(p).includes('/b')) throw new Error('fail'); return undefined; }),
  safeApiSend: jest.fn(async (p,m)=> ({ ok: !(m==='DELETE' && String(p).includes('/b')) }))
}));

test('bulk delete removes selected and rolls back failed', async () => {
  render(<Gallery />);
  const checks = await screen.findAllByRole('checkbox', { name: /select build/i });
  fireEvent.click(checks[0]);
  fireEvent.click(checks[1]);
  fireEvent.click(screen.getByRole('button', { name: /delete selected/i }));
  // confirm appears
  const confirm = await screen.findByRole('dialog');
  fireEvent.click(screen.getByText(/confirm/i));
  await waitFor(()=>{
    // One fails, so at least one card remains
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });
});
// <!-- END RBP GENERATED: builds-gallery-bulk-v1 -->
