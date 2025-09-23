// <!-- BEGIN RBP GENERATED: ui-polish-v1 -->
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdminHeader } from './AdminHeader';
import { LiveRegion } from '../../../../../packages/ui/live-region/LiveRegion';

const meta: Meta<typeof AdminHeader> = {
  title: 'Admin/Common/AdminHeader',
  component: AdminHeader,
};
export default meta;

export const Basic: StoryObj<typeof AdminHeader> = {
  render: () => (
    <div>
      {/* Ensure a single LiveRegion at root for the story */}
      <LiveRegion />
      <AdminHeader
        title="Catalog"
        subtitle="Manage product availability"
        banner={{ tone: 'info', content: 'Changes are saved automatically.' }}
        secondaryActions={[{ label: 'Export', onClick: () => {} }]}
        primaryAction={{ label: 'New product', onClick: () => {} }}
      />
      <p>Body content…</p>
    </div>
  ),
};

export const AnnouncesOnChange: StoryObj<typeof AdminHeader> = {
  render: () => {
    const [title, setTitle] = React.useState('Builds');
    return (
      <div>
        <LiveRegion />
        <AdminHeader
          title={title}
          subtitle="Recent activity"
          primaryAction={{ label: 'Create build', onClick: () => {} }}
          secondaryActions={[{ label: 'Refresh', onClick: () => {} }]}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setTitle('Builds')}>Set Builds</button>
          <button onClick={() => setTitle('Catalog')}>Set Catalog</button>
        </div>
      </div>
    );
  },
  // smoke play to ensure no runtime errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  play: (async () => { await new Promise(r => setTimeout(r, 50)); }) as any,
};
// <!-- END RBP GENERATED: ui-polish-v1 -->
