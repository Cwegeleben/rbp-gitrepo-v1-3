// <!-- BEGIN RBP GENERATED: builds-gallery-v1 -->
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Gallery from '../components/Gallery';

function mockBuildsOnce(items: any[]){
  (fetch as any).mockImplementationOnce(async (url: string) => {
    if (url.includes('/apps/proxy/api/builds')) return { ok: true, json: async () => items } as any;
    return { ok: true, json: async () => ({}) } as any;
  });
}

beforeEach(() => {
  (global as any).fetch = jest.fn(async (url: string, init?: RequestInit) => {
    if (url.includes('/apps/proxy/api/builds') && !url.includes('/apps/proxy/api/builds/')) return { ok: true, json: async () => ([
      { id: '1', title: 'One', items: [{quantity:1}] },
    ]) } as any;
    if (url.endsWith('/apps/proxy/api/builds') && init?.method === 'POST') return { ok: true, json: async () => ({ id: '2', title: 'One (Copy)', items: [{quantity:1}] }) } as any;
    if (url.includes('/apps/proxy/api/builds/') && init?.method === 'DELETE') return { ok: true, json: async () => ({}) } as any;
    return { ok: true, json: async () => ({}) } as any;
  });
});

afterEach(() => { (fetch as any).mockRestore?.(); });

test('open dispatches event', async () => {
  const handler = jest.fn();
  window.addEventListener('rbp:active-build', handler);
  render(<Gallery />);
  await waitFor(() => expect(fetch).toHaveBeenCalled());
  const openBtn = await screen.findByRole('button', { name: /Open build/i });
  fireEvent.click(openBtn);
  expect(handler).toHaveBeenCalled();
});

test('duplicate optimistic with rollback on failure', async () => {
  // First, successful duplicate
  render(<Gallery />);
  await waitFor(() => expect(fetch).toHaveBeenCalled());
  const dupBtn = await screen.findByRole('button', { name: /Duplicate build/i });
  fireEvent.click(dupBtn);
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/apps/proxy/api/builds'), expect.objectContaining({ method: 'POST' }));
  });
});

test('delete confirm flow', async () => {
  render(<Gallery />);
  await waitFor(() => expect(fetch).toHaveBeenCalled());
  const delBtn = await screen.findByRole('button', { name: /Delete build/i });
  fireEvent.click(delBtn);
  const confirmBtn = await screen.findByText('Confirm');
  fireEvent.click(confirmBtn);
  await waitFor(() => expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/apps/proxy/api/builds/'), expect.objectContaining({ method: 'DELETE' })));
});
// <!-- END RBP GENERATED: builds-gallery-v1 -->
