// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
// @ts-nocheck
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'RBP/Command Palette',
};
export default meta;
type Story = StoryObj;

const Boot: React.FC = () => { React.useEffect(()=>{ /* @ts-ignore */ import('./index.js'); }, []); return <div />; };

export const Default: Story = { render: () => <Boot />, play: async () => {
  window.dispatchEvent(new Event('rbp:cmd:open'));
} };

export const WithExternalActions: Story = { render: () => <Boot />, play: async () => {
  window.dispatchEvent(new CustomEvent('rbp:cmd:register', { detail: { actions: [
    { id:'ext-1', title:'External Hello', tags:['ext'], exec:{ type:'event', value:'ext:hello' } }
  ] } }));
  window.dispatchEvent(new Event('rbp:cmd:open'));
} };

export const ErrorBoundary: Story = { render: () => <Boot />, play: async () => {
  window.dispatchEvent(new Event('rbp:cmd:open'));
} };

export const KeyboardOnly: Story = { render: () => <Boot /> };

export const ManyResults: Story = { render: () => <Boot />, play: async () => {
  const many = Array.from({ length: 100 }, (_,i)=>({ id:`m-${i}`, title:`Action ${i}`, exec:{ type:'event', value:'noop' } }));
  window.dispatchEvent(new CustomEvent('rbp:cmd:register', { detail: { actions: many } }));
  window.dispatchEvent(new Event('rbp:cmd:open'));
} };
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
