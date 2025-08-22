/* <!-- BEGIN RBP GENERATED: tenant-admin-storybook --> */
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleCell } from '../../CatalogPage';
import { ui } from '../../uiStrings';

const meta: Meta<typeof ToggleCell> = {
  title: 'Admin/Components/ToggleCell',
  component: ToggleCell,
};
export default meta;

type Story = StoryObj<typeof ToggleCell>;

export const Off: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <ToggleCell checked={checked} onChange={setChecked} />;
  }
};

export const On: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return <ToggleCell checked={checked} onChange={setChecked} />;
  }
};

export const FailsWithRollback: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    const [pending, setPending] = useState(false);
    const [msg, setMsg] = useState('');
    return (
      <div>
        <div aria-live="polite" role="status" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}>{msg}</div>
        <ToggleCell
          checked={checked}
          pending={pending}
          onChange={async (next) => {
            const active = document.activeElement as HTMLElement | null;
            setPending(true);
            setChecked(next);
            await new Promise((r) => setTimeout(r, 250));
            // simulate network error and rollback
            setChecked(!next);
            setPending(false);
            setMsg(ui.catalog.toggleFailed);
            requestAnimationFrame(() => active?.focus());
          }}
        />
      </div>
    );
  }
};
/* <!-- END RBP GENERATED: tenant-admin-storybook --> */
