// <!-- BEGIN RBP GENERATED: builds-share-links-v1 -->
const meta = { title: 'Storefront/Share/Preview v1.0.0' } as any;
export default meta;

function mountInto(el: HTMLElement, fetchImpl: any, url: string){
  // @ts-ignore
  window.fetch = fetchImpl;
  Object.defineProperty(window, 'location', { value: new URL(url) });
  const mount = require('./index.js').default as (el: HTMLElement)=>any;
  return mount(el as any);
}

function root(){ const el = document.createElement('div'); el.style.padding='16px'; return el; }

export const Valid = { render: () => { const el = root(); mountInto(el, async (u: string) => {
  if (u.includes('/apps/rbp/api/share/resolve')) return { ok:true, json: async()=>({ build: { id:'b1', name:'Shared', items:[{ title:'Rod', quantity:1 }] } }) } as any;
  throw new Error('unhandled');
}, 'https://example.com/app?share=T'); return el; } } as any;

export const Invalid = { render: () => { const el = root(); mountInto(el, async () => { const r = new Response('bad', { status: 401 }); (r as any).ok = false; throw r; }, 'https://example.com/app?share=T'); return el; } } as any;

export const Expired = { render: () => { const el = root(); mountInto(el, async () => { const r = new Response('expired', { status: 410 }); (r as any).ok = false; throw r; }, 'https://example.com/app?share=T'); return el; } } as any;
// <!-- END RBP GENERATED: builds-share-links-v1 -->
