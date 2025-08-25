// <!-- BEGIN RBP GENERATED: builds-gallery-bulk-v1 -->
import React from 'react';
import Gallery from './components/Gallery';
// @ts-ignore Storybook provides runtime types for this module
import { within, userEvent } from '@storybook/test';

export default { title: 'Storefront/Builds Gallery Bulk v1.1.0' };

// shallow stories – component fetches data itself; we mock fetch globally via Storybook preview or here
// Story-local fetch stub with basic routing, method support, and controllable failures
const BASE_ITEMS = [
  { id: 'a', title: 'Alpha', items: [{ quantity: 1 }] },
  { id: 'b', title: 'Beta', items: [{ quantity: 2 }] },
  { id: 'c', title: 'Gamma', items: [{ quantity: 3 }] },
];
(global as any).fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(typeof input === 'string' ? input : (input as any)?.url || '');
  const method = (init?.method || 'GET').toUpperCase();
  // Builds list
  if (url.includes('/apps/proxy/api/builds') && method === 'GET') {
    return { ok: true, json: async () => ({ items: BASE_ITEMS }) } as any;
  }
  // Create build
  if (url.endsWith('/apps/proxy/api/builds') && method === 'POST') {
    const id = 'new-' + Math.random().toString(36).slice(2);
    return { ok: true, json: async () => ({ id, title: 'Untitled Build', items: [] }) } as any;
  }
  // Patch build (rename)
  if (url.match(/\/apps\/proxy\/api\/builds\/.+/) && method === 'PATCH') {
    const shouldFail = (global as any).__RBP_FAIL_PATCH__;
    return shouldFail ? ({ ok: false, json: async () => ({}) } as any) : ({ ok: true, json: async () => ({ ok: true }) } as any);
  }
  // Delete build
  if (url.match(/\/apps\/proxy\/api\/builds\/.+/) && method === 'DELETE') {
    // allow targeted failure via Set<string> of ids
    const id = url.split('/').pop() as string;
    const failFor: Set<string> | undefined = (global as any).__RBP_FAIL_DELETE_FOR__;
    const shouldFail = failFor?.has(id);
    return shouldFail ? ({ ok: false, json: async () => ({}) } as any) : ({ ok: true, json: async () => ({ ok: true }) } as any);
  }
  // Share mint
  if (url.includes('/apps/rbp/api/share/mint')) {
    return { ok: true, json: async () => ({ token: 'TOKEN', expiresAt: new Date(Date.now() + 864e5).toISOString() }) } as any;
  }
  return { ok: true, json: async () => ({}) } as any;
};

export const NoneSelected = () => <Gallery />;

export const SomeSelected = () => <Gallery />;
SomeSelected.play = async ({ canvasElement }: any) => {
  const canvas = within(canvasElement);
  const checks = await canvas.findAllByRole('checkbox', { name: /select build/i });
  await userEvent.click(checks[0]);
  await userEvent.click(checks[1]);
  await canvas.findByText('2 selected');
};

export const AllSelected = () => <Gallery />;
AllSelected.play = async ({ canvasElement }: any) => {
  const canvas = within(canvasElement);
  const selectAll = await canvas.findByRole('checkbox', { name: /select all builds/i });
  await userEvent.click(selectAll);
  await canvas.findByText('3 selected');
};

export const ErrorRollback = () => <Gallery />;
ErrorRollback.play = async ({ canvasElement }: any) => {
  // Fail delete for one id to demonstrate rollback toast/state
  (global as any).__RBP_FAIL_DELETE_FOR__ = new Set(['b']);
  const canvas = within(canvasElement);
  const checks = await canvas.findAllByRole('checkbox', { name: /select build/i });
  await userEvent.click(checks[0]);
  await userEvent.click(checks[1]);
  await userEvent.click(await canvas.findByRole('button', { name: /delete selected/i }));
  // confirm dialog appears
  await userEvent.click(await canvas.findByRole('button', { name: /delete/i }));
  // Expect an error toast message to eventually appear (copy kept generic)
  await canvas.findByText(/Deleted \d+\/\d+|restored/i);
  // cleanup flag for other stories
  (global as any).__RBP_FAIL_DELETE_FOR__ = undefined;
};

export const KeyboardOnly = () => <Gallery />;
KeyboardOnly.play = async ({ canvasElement }: any) => {
  const canvas = within(canvasElement);
  // Move focus through toolbar to first item checkbox and toggle via keyboard
  await userEvent.tab(); // Select all
  await userEvent.tab(); // Search
  await userEvent.tab(); // Sort
  await userEvent.tab(); // Toggle view
  await userEvent.tab(); // First item checkbox
  await userEvent.keyboard(' ');
  await canvas.findByText('1 selected');
};
// <!-- END RBP GENERATED: builds-gallery-bulk-v1 -->
