// <!-- BEGIN RBP GENERATED: catalog-picker-v2 -->
import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useEffect, useRef } from 'react';
import '../index.js';

const Demo: React.FC<{ state?: 'default'|'deeplink'|'loading'|'error'|'keyboard' }>=({ state='default' })=>{
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const orig = window.fetch;
    window.fetch = async (input: any, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/apps/proxy/api/catalog/search')) {
        if (state === 'loading') return new Promise(res => setTimeout(()=>res(new Response(JSON.stringify({ items: [] }), { status: 200 })), 600));
        if (state === 'error') return new Response('{}', { status: 500 });
        return new Response(JSON.stringify({ items: [
          { id: 'p1', title: 'Reel Seat A', vendor: 'Acme', price: 10.5, tags: ['tag1'], type: 'Reel Seat' },
          { id: 'p2', title: 'Blank B', vendor: 'BoatCo', price: 99, tags: ['tagX'], type: 'Blanks' }
        ], pageInfo: { hasNext: false, hasPrev: false } }), { status: 200 });
      }
      if (url.endsWith('/apps/proxy/api/builds') && !init) {
        return new Response(JSON.stringify([{ id: 'b1', title: 'Active Build' }]), { status: 200 });
      }
      if (url.includes('/apps/proxy/api/builds/b1') && !init) {
        return new Response(JSON.stringify({ id: 'b1', title: 'Active Build', items: [] }), { status: 200 });
      }
      if (url.includes('/apps/proxy/api/builds/b1') && init?.method === 'PATCH') {
        if (state === 'error') return new Response('{}', { status: 500 });
        return new Response('{}', { status: 204 });
      }
      return orig(input, init);
    };
  const root = ref.current!;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mount = require('../index.js').default as (el: HTMLElement)=>any;
  const mounted = typeof mount === 'function' ? mount(root) : null;
    if (state === 'deeplink') {
      const url = new URL(window.location.href);
      url.searchParams.set('type','Reel Seat');
      url.searchParams.set('slot','abc123');
      window.history.replaceState({},'',url.toString());
      window.dispatchEvent(new CustomEvent('rbp:start-part-selection', { detail: { type: 'Reel Seat', slotId: 'abc123' } }));
    }
    return () => { try { mounted?.unmount?.(); } catch {} window.fetch = orig; };
  }, [state]);
  return <div ref={ref} style={{ minHeight: 280, border: '1px dashed #ddd', borderRadius: 8, padding: 8 }} />
}

export default { title: 'Storefront/Catalog/Picker v2' } as Meta;
export const Default: StoryObj = { render: () => <Demo state="default" /> };
export const DeepLinked: StoryObj = { render: () => <Demo state="deeplink" /> };
export const Loading: StoryObj = { render: () => <Demo state="loading" /> };
export const ErrorRollback: StoryObj = { render: () => <Demo state="error" /> };
export const KeyboardOnly: StoryObj = { render: () => <Demo state="keyboard" /> };
// <!-- END RBP GENERATED: catalog-picker-v2 -->
