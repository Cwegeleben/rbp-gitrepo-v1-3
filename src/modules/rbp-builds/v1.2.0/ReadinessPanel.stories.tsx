// <!-- BEGIN RBP GENERATED: builds-readiness-v1 -->
const meta = {
  title: 'Storefront/Builds/Readiness v1.2.0',
};
export default meta;

function mountInto(el: HTMLElement, fetchImpl: any){
  // @ts-ignore
  window.fetch = fetchImpl;
  const mount = require('./index.js').default as (el: HTMLElement)=>any;
  return mount(el as any);
}

function root() {
  const el = document.createElement('div'); el.style.padding = '16px'; el.id = 'story-root'; return el;
}

export const AllGood = {
  render: () => {
    const el = root();
    mountInto(el, async (url: string, init?: any) => {
      if (String(url).endsWith('/apps/proxy/api/builds')) return { ok: true, json: async () => ({ items: [{ id:'b1', title:'Build', items:[{ id:'slot-1', type:'Rod', quantity:1 }] }] }) } as any;
      if (String(url).endsWith('/apps/proxy/api/builds/b1')) return { ok: true, json: async () => ({ id:'b1', title:'Build', items:[{ id:'slot-1', type:'Rod', quantity:1 }] }) } as any;
      if (String(url).includes('/checkout/package')) { if (init?.headers?.['X-RBP-Dry-Run']==='1') return { ok:true, json: async()=>({ hints: [], meta: { totals: { subtotal: 1000, total: 1100, estTax: 100, currency:'USD' } } }) } as any; return { ok:true, json: async()=>({ cartPath: '/cart' }) } as any; }
      throw new Error('unhandled');
    });
    return el;
  }
} as any;

export const MissingVariant = {
  render: () => {
    const el = root();
    mountInto(el, async (url: string, init?: any) => {
      if (String(url).endsWith('/apps/proxy/api/builds')) return { ok: true, json: async () => ({ items: [{ id:'b1', title:'Build', items:[{ id:'slot-1', type:'Rod', quantity:1 }] }] }) } as any;
      if (String(url).endsWith('/apps/proxy/api/builds/b1')) return { ok: true, json: async () => ({ id:'b1', title:'Build', items:[{ id:'slot-1', type:'Rod', quantity:1 }] }) } as any;
      if (String(url).includes('/checkout/package')) { if (init?.headers?.['X-RBP-Dry-Run']==='1') return { ok:true, json: async()=>({ hints: [{ type:'MISSING_VARIANT', slotId:'slot-1', slotType:'Rod' }], meta: { totals: { subtotal: 1000, total: 1000, currency:'USD' } } }) } as any; return { ok:true, json: async()=>({ cartPath: null }) } as any; }
      throw new Error('unhandled');
    });
    return el;
  }
} as any;

export const NoPrice = {
  render: () => {
    const el = root();
    mountInto(el, async (url: string, init?: any) => {
      if (String(url).endsWith('/apps/proxy/api/builds')) return { ok: true, json: async () => ({ items: [{ id:'b1', title:'Build', items:[{ id:'slot-1', type:'Rod', quantity:1 }] }] }) } as any;
      if (String(url).endsWith('/apps/proxy/api/builds/b1')) return { ok: true, json: async () => ({ id:'b1', title:'Build', items:[{ id:'slot-1', type:'Rod', quantity:1 }] }) } as any;
      if (String(url).includes('/checkout/package')) { if (init?.headers?.['X-RBP-Dry-Run']==='1') return { ok:true, json: async()=>({ hints: [{ type:'NO_PRICE', slotId:'slot-1', slotType:'Rod' }] }) } as any; return { ok:true, json: async()=>({ cartPath: null }) } as any; }
      throw new Error('unhandled');
    });
    return el;
  }
} as any;

export const MixedIssues = {
  render: () => {
    const el = root();
    mountInto(el, async (url: string, init?: any) => {
      if (String(url).endsWith('/apps/proxy/api/builds')) return { ok: true, json: async () => ({ items: [{ id:'b1', title:'Build', items:[{ id:'s1', type:'Rod', quantity:1 }, { id:'s2', type:'Reel', quantity:1 }] }] }) } as any;
      if (String(url).endsWith('/apps/proxy/api/builds/b1')) return { ok: true, json: async () => ({ id:'b1', title:'Build', items:[{ id:'s1', type:'Rod', quantity:1 }, { id:'s2', type:'Reel', quantity:1 }] }) } as any;
      if (String(url).includes('/checkout/package')) { if (init?.headers?.['X-RBP-Dry-Run']==='1') return { ok:true, json: async()=>({ hints: [{ type:'MISSING_VARIANT', slotId:'s1', slotType:'Rod' },{ type:'NO_PRICE', slotId:'s2', slotType:'Reel' }] }) } as any; return { ok:true, json: async()=>({ cartPath: null }) } as any; }
      throw new Error('unhandled');
    });
    return el;
  }
} as any;

export const NetworkError = {
  render: () => {
    const el = root();
    mountInto(el, async (url: string, init?: any) => {
      if (String(url).endsWith('/apps/proxy/api/builds')) return { ok: true, json: async () => ({ items: [{ id:'b1', title:'Build', items:[{ id:'slot-1', type:'Rod', quantity:1 }] }] }) } as any;
      if (String(url).endsWith('/apps/proxy/api/builds/b1')) return { ok: true, json: async () => ({ id:'b1', title:'Build', items:[{ id:'slot-1', type:'Rod', quantity:1 }] }) } as any;
      if (String(url).includes('/checkout/package')) { if (init?.headers?.['X-RBP-Dry-Run']==='1') throw new Error('fail'); return { ok:true, json: async()=>({ cartPath: null }) } as any; }
      throw new Error('unhandled');
    });
    return el;
  }
} as any;
// <!-- END RBP GENERATED: builds-readiness-v1 -->
