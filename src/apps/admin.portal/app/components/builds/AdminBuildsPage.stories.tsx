/*
<!-- BEGIN RBP GENERATED: admin-builds-v1 -->
*/
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import AdminBuildsPage from './AdminBuildsPage';
import { http, HttpResponse } from 'msw';
// <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
import { within, userEvent } from '@storybook/test';
import { LiveRegion } from '../../../../../packages/ui/live-region/LiveRegion';
// <!-- END RBP GENERATED: admin-acceptance-v1 -->

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
  render: () => (<>
    {/* <!-- BEGIN RBP GENERATED: admin-acceptance-v1 --> */}
    <LiveRegion />
    {/* <!-- END RBP GENERATED: admin-acceptance-v1 --> */}
    <AdminBuildsPage />
  </>),
  // <!-- BEGIN RBP GENERATED: admin-acceptance-v1 -->
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const duplicate = await canvas.findByRole('button', { name: /duplicate/i });
    await userEvent.click(duplicate);
  }
  // <!-- END RBP GENERATED: admin-acceptance-v1 -->
};

export const Empty: Story = {
  parameters: { msw: { handlers: [ http.get('/apps/proxy/api/builds', () => HttpResponse.json({ items: [] })) ] } },
  render: () => (<>
    {/* <!-- BEGIN RBP GENERATED: admin-acceptance-v1 --> */}
    <LiveRegion />
    {/* <!-- END RBP GENERATED: admin-acceptance-v1 --> */}
    <AdminBuildsPage />
  </>),
};

export const ServerError: Story = {
  parameters: { msw: { handlers: [ http.get('/apps/proxy/api/builds', () => new HttpResponse(null, { status: 500 })) ] } },
  render: () => (<>
    {/* <!-- BEGIN RBP GENERATED: admin-acceptance-v1 --> */}
    <LiveRegion />
    {/* <!-- END RBP GENERATED: admin-acceptance-v1 --> */}
    <AdminBuildsPage />
  </>),
};
/*
<!-- END RBP GENERATED: admin-builds-v1 -->
*/
