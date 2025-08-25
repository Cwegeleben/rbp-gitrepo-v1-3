// <!-- BEGIN RBP GENERATED: ui-toast-announcer-v1 -->
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta = {
  title: 'RBP/UI Host',
};
export default meta;

type S = StoryObj;

export const Default: S = {
  render(){ return <div>UI Host mounted. Use play to fire events.</div>; },
  async play(){
    await import('./index.js');
    window.dispatchEvent(new CustomEvent('rbp:toast', { detail: { type:'success', message:'Saved!' } }));
    window.dispatchEvent(new CustomEvent('rbp:announce', { detail: { message:'Saved successfully.' } }));
  }
};

export const ManyToasts: S = {
  render(){ return <div>Many toasts</div>; },
  async play(){
    await import('./index.js');
    const kinds = ['info','success','warning','error'] as const;
    kinds.forEach((k,i) => { setTimeout(()=>window.dispatchEvent(new CustomEvent('rbp:toast', { detail: { type:k, message:`#${i+1} ${k}` } })), i*200); });
  }
};

export const ErrorToast: S = {
  render(){ return <div>Error toast (8s)</div>; },
  async play(){
    await import('./index.js');
    window.dispatchEvent(new CustomEvent('rbp:toast', { detail: { type:'error', message:'Something failed', timeoutMs: 8000 } }));
  }
};

export const AssertiveAnnounce: S = {
  render(){ return <div>Assertive announce</div>; },
  async play(){
    await import('./index.js');
    window.dispatchEvent(new CustomEvent('rbp:announce', { detail: { message:'Critical error', politeness:'assertive' } }));
  }
};

export const KeyboardOnly: S = {
  render(){ return <div><button id="origin">Origin</button><p>Tab to the toast and press Esc to close.</p></div>; },
  async play(){
    await import('./index.js');
    const origin = document.getElementById('origin') as HTMLButtonElement; origin?.focus();
    window.dispatchEvent(new CustomEvent('rbp:toast', { detail: { type:'info', message:'Focusable toast', timeoutMs: 10000 } }));
  }
};
// <!-- END RBP GENERATED: ui-toast-announcer-v1 -->
