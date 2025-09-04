/*
<!-- BEGIN RBP GENERATED: admin-builds-v1 -->
*/
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import AdminBuildsPage from './AdminBuildsPage';
import { http, HttpResponse } from 'msw';

const meta: Meta<typeof AdminBuildsPage> = {
  title: 'Admin/Builds/AdminBuildsPage',
  component: AdminBuildsPage,
};
export default meta;

type Story = StoryObj<typeof AdminBuildsPage>;

export const Populated: Story = {
  parameters: { msw: { handlers: [
    http.get('/apps/proxy/api/builds', () => {
      return HttpResponse.json({ items: [
        { id: 'b1', number: 101, customer: 'Alice', updatedAt: new Date().toISOString(), status: 'in_progress', total: 120 },
        { id: 'b2', number: 102, customer: 'Bob', updatedAt: new Date().toISOString(), status: 'in_progress', total: 90 },
      ] });
    }),
  ] } },
  render: () => <AdminBuildsPage />,
};

export const Empty: Story = {
  parameters: { msw: { handlers: [ http.get('/apps/proxy/api/builds', () => HttpResponse.json({ items: [] })) ] } },
  render: () => <AdminBuildsPage />,
};

export const ServerError: Story = {
  parameters: { msw: { handlers: [ http.get('/apps/proxy/api/builds', () => new HttpResponse(null, { status: 500 })) ] } },
  render: () => <AdminBuildsPage />,
};
/*
<!-- END RBP GENERATED: admin-builds-v1 -->
*/
