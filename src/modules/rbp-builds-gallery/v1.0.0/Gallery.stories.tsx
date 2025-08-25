// <!-- BEGIN RBP GENERATED: builds-gallery-v1 -->
import React from 'react';
import Gallery from './components/Gallery';

export default { title: 'Storefront/Builds Gallery v1' };

function mock(fetchImpl: any){
  // @ts-ignore
  global.fetch = fetchImpl;
}

export const Default = () => {
  mock(async (url: string) => {
    if (url.includes('/apps/proxy/api/builds')) return { ok: true, json: async () => ([
      { id: '1', title: 'Weekender', items: [{quantity:1},{quantity:2}], updatedAt: new Date().toISOString() },
      { id: '2', title: 'Daily Driver', items: [{quantity:3}], updatedAt: new Date(Date.now()-864e5).toISOString() },
    ]) } as any;
    if (url.includes('/apps/rbp/api/share/mint')) return { ok: true, json: async () => ({ token:'UNSIGNED.1', expiresAt: new Date(Date.now()+7*864e5).toISOString() }) } as any;
    return { ok:true, json: async()=>({}) } as any;
  });
  return <Gallery />;
};

export const ManyItems = () => {
  mock(async (url: string) => {
    if (url.includes('/apps/proxy/api/builds')) {
      const many = Array.from({ length: 24 }, (_,i) => ({ id: String(i+1), title: `Build ${i+1}`, items: Array.from({length:(i%5)+1},()=>({quantity:1})), updatedAt: new Date(Date.now()-i*36e5).toISOString() }));
      return { ok: true, json: async () => many } as any;
    }
    return { ok: true, json: async () => ({}) } as any;
  });
  return <Gallery />;
};

export const Empty = () => {
  mock(async (url: string) => {
    if (url.includes('/apps/proxy/api/builds')) return { ok: true, json: async () => ([]) } as any;
    return { ok: true, json: async () => ({}) } as any;
  });
  return <Gallery />;
};

export const Error = () => {
  mock(async (url: string) => {
    if (url.includes('/apps/proxy/api/builds')) return { ok: false, json: async () => ({ error: 'x' }) } as any;
    return { ok: true, json: async () => ({}) } as any;
  });
  return <Gallery />;
};

export const KeyboardOnly = () => {
  mock(async (url: string) => {
    if (url.includes('/apps/proxy/api/builds')) return { ok: true, json: async () => ([{ id: '1', title:'Only', items: [] }]) } as any;
    return { ok: true, json: async () => ({}) } as any;
  });
  return <Gallery />;
};
// <!-- END RBP GENERATED: builds-gallery-v1 -->
