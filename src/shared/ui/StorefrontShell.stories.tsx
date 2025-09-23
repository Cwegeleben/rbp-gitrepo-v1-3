// <!-- BEGIN RBP GENERATED: storefront-shell-registry-v1-0 -->
import React, { useEffect, useRef } from 'react';
import type { StorybookConfig } from '@storybook/react-vite';

declare global { interface Window { RBP: any } }

function ShellMountDemo() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // simulate mock shell available
    window.RBP = window.RBP || {};
    window.RBP.shell = window.RBP.shell || {
      mount(host: HTMLElement) { const el = document.createElement('div'); el.id='rbp-mock-shell'; el.textContent='Mock Shell'; host.appendChild(el); },
      unmount() { const el = document.getElementById('rbp-mock-shell'); el?.remove(); }
    };
    if (ref.current) window.RBP.shell.mount(ref.current);
    return () => { try { window.RBP.shell.unmount(); } catch {} };
  }, []);
  return <div ref={ref} style={{ padding: 16, border: '1px dashed #bbb' }} />;
}

export default { title: 'Storefront/ShellMount', component: ShellMountDemo } as any;
export const Default = {} as any;
// <!-- END RBP GENERATED: storefront-shell-registry-v1-0 -->
