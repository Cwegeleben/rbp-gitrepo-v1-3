// <!-- BEGIN RBP GENERATED: builds-gallery-bulk-v1 -->
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Gallery from '../components/Gallery';

Object.assign(navigator, { clipboard: { writeText: jest.fn() } });
// jsdom lacks URL.createObjectURL in some environments
// @ts-ignore
if (!URL.createObjectURL) URL.createObjectURL = jest.fn(() => 'blob:mock');
// @ts-ignore
if (!URL.revokeObjectURL) URL.revokeObjectURL = jest.fn();

jest.mock('../../../../shared/sdk/client', () => ({
  apiGet: jest.fn(async (p:string) => {
    if (p.startsWith('/apps/rbp/api/share/mint')) return { token: 'TOKEN', expiresAt: new Date(Date.now()+864e5).toISOString() };
    return { items: [ { id: 'a', title: 'Alpha', items: [] } ] };
  }),
  apiSend: jest.fn(async ()=>({})),
  safeApiSend: jest.fn(async ()=>({ ok: true }))
}));

test('bulk share copies links when no listener', async () => {
  render(<Gallery />);
  const checks = await screen.findAllByRole('checkbox', { name: /select build/i });
  fireEvent.click(checks[0]);
  fireEvent.click(screen.getByRole('button', { name: /share selected/i }));
  await waitFor(() => expect((navigator as any).clipboard.writeText).toHaveBeenCalled());
});

test('bulk export downloads a JSON file', async () => {
  const click = jest.fn();
  const orig = document.createElement;
  // mock anchor creation to intercept click
  // @ts-ignore
  document.createElement = (tag: string) => {
    const el = orig.call(document, tag);
    if (tag === 'a') (el as any).click = click;
    return el;
  };
  render(<Gallery />);
  const checks = await screen.findAllByRole('checkbox', { name: /select build/i });
  fireEvent.click(checks[0]);
  fireEvent.click(screen.getByRole('button', { name: /export json/i }));
  expect(click).toHaveBeenCalled();
  // restore
  document.createElement = orig as any;
});
// <!-- END RBP GENERATED: builds-gallery-bulk-v1 -->
