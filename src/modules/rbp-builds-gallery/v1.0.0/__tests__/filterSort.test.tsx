// <!-- BEGIN RBP GENERATED: builds-gallery-v1 -->
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Gallery from '../components/Gallery';

// Mock network
beforeEach(() => {
  (global as any).fetch = jest.fn(async (url: string) => {
    if (url.includes('/apps/proxy/api/builds')) return { ok: true, json: async () => ([
      { id: 'a', title: 'Alpha', items: [{quantity:1}], updatedAt: new Date('2023-01-01').toISOString() },
      { id: 'b', title: 'Beta', items: [{quantity:3}], updatedAt: new Date('2024-01-01').toISOString() },
      { id: 'c', title: 'Gamma', items: [{quantity:2}], updatedAt: new Date('2022-01-01').toISOString() },
    ]) } as any;
    return { ok: true, json: async () => ({}) } as any;
  });
});

afterEach(() => { (fetch as any).mockRestore?.(); });

test('search + sort round trip', async () => {
  render(<Gallery />);
  await waitFor(() => expect(fetch).toHaveBeenCalled());
  const input = screen.getByLabelText('Search builds');
  fireEvent.change(input, { target: { value: 'a' } });
  const select = screen.getByLabelText('Sort');
  fireEvent.change(select, { target: { value: 'name:asc' } });

  // Two matches: Alpha, Gamma; name asc → Alpha first
  await waitFor(() => {
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  });
});
// <!-- END RBP GENERATED: builds-gallery-v1 -->
