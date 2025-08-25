// <!-- BEGIN RBP GENERATED: builds-panel-v2 -->
import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useEffect, useRef } from 'react';

// Load the UMD-style file which assigns window.RBP_BUILDS_V2
import '../index.js';

const Demo: React.FC<{ state?: 'default'|'empty'|'loading'|'error'|'keyboard' }>=({ state='default' })=>{
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    // Mock fetch for builds API
    const orig = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (state === 'loading') return new Promise(res => setTimeout(()=>res(new Response(JSON.stringify({ items: [] }), { status: 200 })), 800));
      if (url.endsWith('/apps/proxy/api/builds')) {
        if (state === 'empty') return new Response(JSON.stringify({ items: [] }), { status: 200 });
        return new Response(JSON.stringify({ items: [
          { id: 'a', title: 'Ultralight', items: [{ type: 'Blanks', label: 'Blank A', quantity: 1 }] },
          { id: 'b', title: 'Saltwater', items: [{ type: 'Reel Seat', label: 'Seat X', quantity: 1 }, { type: 'Butt Cap', label: 'Cap Z', quantity: 1 }] }
        ]}), { status: 200 });
      }
      if (url.includes('/apps/proxy/api/builds/a')) {
        return new Response(JSON.stringify({ id: 'a', title: 'Ultralight', items: [{ type: 'Blanks', label: 'Blank A', quantity: 1 }] }), { status: 200 });
      }
      if (url.includes('/apps/proxy/api/builds/b')) {
        return new Response(JSON.stringify({ id: 'b', title: 'Saltwater', items: [{ type: 'Reel Seat', label: 'Seat X', quantity: 1 }, { type: 'Butt Cap', label: 'Cap Z', quantity: 1 }] }), { status: 200 });
      }
      if (url.endsWith('/apps/proxy/api/builds') && init?.method === 'POST') {
        return new Response(JSON.stringify({ id: 'new', title: 'Untitled Build', items: [] }), { status: 200 });
      }
      if (/\/apps\/proxy\/api\/builds\/.+/.test(url) && init?.method === 'PATCH') {
        return new Response('{}', { status: 204 });
      }
      if (state === 'error') return new Response('{}', { status: 500 });
      return orig(input as any, init);
    };
    const m = (window as any).RBP_BUILDS_V2;
    const root = ref.current!;
    const mounted = m?.mount?.(root) || null;
    return () => { try { mounted?.unmount?.(); } catch {} window.fetch = orig; };
  }, [state]);
  return <div ref={ref} style={{ minHeight: 240, border: '1px dashed #ddd', borderRadius: 8, padding: 8 }} />
}

export default { title: 'Storefront/Builds/Panel v2' } as Meta;

export const Default: StoryObj = { render: () => <Demo state="default" /> };
export const Empty: StoryObj = { render: () => <Demo state="empty" /> };
export const Loading: StoryObj = { render: () => <Demo state="loading" /> };
export const ErrorRollback: StoryObj = { render: () => <Demo state="error" /> };
export const KeyboardNav: StoryObj = { render: () => <Demo state="keyboard" /> };
// <!-- END RBP GENERATED: builds-panel-v2 -->
