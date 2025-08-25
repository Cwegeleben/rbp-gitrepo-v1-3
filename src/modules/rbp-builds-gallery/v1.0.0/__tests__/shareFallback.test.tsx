// <!-- BEGIN RBP GENERATED: builds-gallery-v1 -->
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Gallery from '../components/Gallery';

beforeEach(() => {
  (global as any).fetch = jest.fn(async (url: string) => {
    if (url.includes('/apps/proxy/api/builds')) return { ok: true, json: async () => ([{ id: '1', title: 'One', items: [] }]) } as any;
    if (url.includes('/apps/rbp/api/share/mint')) return { ok: true, json: async () => ({ token: 'UNSIGNED.1', expiresAt: new Date(Date.now()+7*864e5).toISOString() }) } as any;
    return { ok: true, json: async () => ({}) } as any;
  });
});

afterEach(() => { (fetch as any).mockRestore?.(); });

test('emits rbp:share:open or falls back to mint', async () => {
  const handler = jest.fn();
  // Don't add a listener to force fallback
  render(<Gallery />);
  await waitFor(() => expect(fetch).toHaveBeenCalled());
  const shareBtn = await screen.findByRole('button', { name: /Share build/i });
  await navigator.clipboard?.writeText('');
  fireEvent.click(shareBtn);
  await waitFor(() => expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/apps/rbp/api/share/mint'), expect.anything()));
});
// <!-- END RBP GENERATED: builds-gallery-v1 -->
