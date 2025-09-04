/*
<!-- BEGIN RBP GENERATED: admin-settings-v1 -->
*/
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import AdminSettings from './AdminSettings';

const meta: Meta<typeof AdminSettings> = {
  title: 'Admin/Settings',
  component: AdminSettings,
};
export default meta;

type Story = StoryObj<typeof AdminSettings>;

const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
  <MemoryRouter initialEntries={["/app/settings?shop=rbp-dev.myshopify.com&host=abc&embedded=1"]}>
    {children}
  </MemoryRouter>
);

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <AdminSettings {...args} loadCtx={async () => ({ shopDomain: 'rbp-dev.myshopify.com', features: { proxy: { hmacVerified: true } } })} />
    </Wrapper>
  ),
};

export const FlagsToggled: Story = {
  render: () => (
    <Wrapper>
      <AdminSettings loadCtx={async () => ({ shopDomain: 'rbp-dev.myshopify.com', features: { proxy: { hmacVerified: true } } })} />
    </Wrapper>
  ),
  play: async () => {
    // Seed some flags to demonstrate persistence visually
    localStorage.setItem('rbp.flags.newCatalog', '1');
    localStorage.setItem('rbp.flags.debugToasts', '1');
  }
};

export const ContextError: Story = {
  render: () => (
    <Wrapper>
      <AdminSettings loadCtx={async () => null} />
    </Wrapper>
  ),
};
/*
<!-- END RBP GENERATED: admin-settings-v1 -->
*/
