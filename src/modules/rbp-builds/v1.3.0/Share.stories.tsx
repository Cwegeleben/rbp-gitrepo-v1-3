// <!-- BEGIN RBP GENERATED: builds-share-links-v1 -->
const meta = { title: 'Storefront/Builds/Share v1.3.0' } as any;
export default meta;

function mountInto(el: HTMLElement, fetchImpl: any){
  // @ts-ignore
  window.fetch = fetchImpl;
  const mount = require('./index.js').default as (el: HTMLElement)=>any;
  return mount(el as any);
}

function root(){ const el = document.createElement('div'); el.style.padding='16px'; return el; }

export const Default = { render: () => { const el = root(); mountInto(el, async (url: string) => {
  if (url.endsWith('/apps/proxy/api/builds')) return { ok:true, json: async()=>({ items:[{ id:'b1', title:'Demo', items:[] }] }) } as any;
  if (url.endsWith('/apps/proxy/api/builds/b1')) return { ok:true, json: async()=>({ id:'b1', title:'Demo', items:[] }) } as any;
  if (url.includes('/apps/rbp/api/share/mint')) return { ok:true, json: async()=>({ token:'UNSIGNED.b1', expiresAt: new Date(Date.now()+7*864e5).toISOString() }) } as any;
  throw new Error('unhandled');
}); return el; } } as any;
// <!-- END RBP GENERATED: builds-share-links-v1 -->
