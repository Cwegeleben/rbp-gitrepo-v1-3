// <!-- BEGIN RBP GENERATED: builds-gallery-bulk-v1 -->
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Gallery from '../components/Gallery';

jest.mock('../../../../shared/sdk/client', () => ({
  apiGet: jest.fn(async () => ({ items: [
    { id: 'a', title: 'Alpha', items: [] },
    { id: 'b', title: 'Beta', items: [] },
    { id: 'c', title: 'Gamma', items: [] },
  ]})),
  apiSend: jest.fn(),
  safeApiSend: jest.fn(async ()=>({ ok: true }))
}));

test('multi-select: single, range, select all, clear', async () => {
  render(<Gallery />);
  // wait for list items
  await screen.findByText('Alpha');
  // select first item checkbox (not header)
  const itemChecks = screen.getAllByRole('checkbox', { name: /select build/i });
  fireEvent.click(itemChecks[0]);
  expect(await screen.findByText('1 selected')).toBeInTheDocument();
  // shift range to third
  (window as any).__rbp_shiftDown = true;
  fireEvent.click(itemChecks[2]);
  (window as any).__rbp_shiftDown = false;
  expect(await screen.findByText('3 selected')).toBeInTheDocument();
  // toggle header select-all off then on
  const header = screen.getByRole('checkbox', { name: /select all builds/i });
  fireEvent.click(header); // unselect all
  expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
  fireEvent.click(header); // select all currently filtered
  expect(await screen.findByText('3 selected')).toBeInTheDocument();
  // clear
  fireEvent.click(screen.getByRole('button', { name: /clear/i }));
  expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
});
// <!-- END RBP GENERATED: builds-gallery-bulk-v1 -->
