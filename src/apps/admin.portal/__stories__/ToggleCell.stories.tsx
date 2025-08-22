import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { ToggleCell } from '../CatalogPage';

const meta: Meta<typeof ToggleCell> = {
  title: 'Admin/ToggleCell',
  component: ToggleCell,
  args: { checked: false, pending: false },
  argTypes: {
    onChange: { action: 'changed' },
  }
};
export default meta;

type Story = StoryObj<typeof ToggleCell>;

export const Default: Story = {};
export const Pending: Story = { args: { pending: true } };
export const Checked: Story = { args: { checked: true } };

// Interactive demo with rollback + aria-live feedback
export const FailureRollback: Story = {
  render: () => {
    function Demo({ fail = true }) {
      const [on, setOn] = useState(false);
      const [pending, setPending] = useState(false);
      const [msg, setMsg] = useState('');
      return (
        <div>
          <ToggleCell
            checked={on}
            pending={pending}
            onChange={async (next) => {
              setPending(true);
              setMsg('Saving…');
              const prev = on;
              setOn(next);
              await new Promise((r) => setTimeout(r, 300));
              if (fail) {
                setOn(prev);
                setMsg('Failed to save. Reverted.');
              } else {
                setMsg('Saved');
              }
              setPending(false);
            }}
          />
          <div role="status" aria-live="polite" style={{ marginTop: 8 }}>{msg}</div>
        </div>
      );
    }
    return <Demo />;
  }
};
