// <!-- BEGIN RBP GENERATED: package-cta-v1 -->
import React, { useEffect } from 'react';
import PackagePanel from './components/PackagePanel';
export default {
  title: 'Storefront/PackagePanel',
  component: PackagePanel,
};

function mockFetch(handler: (url: string, init?: RequestInit) => any){
  (globalThis as any).fetch = async (input: any, init?: any) => {
    const url = typeof input === 'string' ? input : input?.toString?.() || '';
    const res = await handler(url, init);
    return new Response(JSON.stringify(res), { headers: { 'content-type': 'application/json' } });
  };
}

export const EmptyBuild = {
  render: () => {
    useEffect(() => {
      mockFetch((url) => {
        if (url.includes('/api/builds/')) return { id: 'b1', items: [] };
        if (url.includes('/api/builds')) return { items: [{ id: 'b1', title: 'Empty', items: [] }] };
        if (url.includes('/checkout/package')) return { ok: true, hints: [{ type: 'NO_PRICE' }], meta: { totals: { subtotal: 0, total: 0, currency: 'USD' } } };
        return {};
      });
    }, []);
    return <PackagePanel buildId={'b1'} onCopy={()=>{}} onGoToCart={()=>{}} />;
  }
};

export const SuccessWithCart = {
  render: () => {
    useEffect(() => {
      mockFetch((url) => {
        if (url.includes('/api/builds/')) return { id: 'b1', items: [{ productId:'P1', quantity: 1 }] };
        if (url.includes('/api/builds')) return { items: [{ id: 'b1', title: 'One Item', items: [{ productId:'P1', quantity: 1 }] }] };
        if (url.includes('/checkout/package')) return { ok: true, cartPath: '/cart/1:1', meta: { totals: { subtotal: 1000, total: 1000, currency: 'USD' } }, hints: [] };
        return {};
      });
    }, []);
    return <PackagePanel buildId={'b1'} onCopy={()=>{}} onGoToCart={()=>{}} />;
  }
};

export const SuccessNoCartWithHints = {
  render: () => {
    useEffect(() => {
      mockFetch((url) => {
        if (url.includes('/api/builds/')) return { id: 'b1', items: [{ productId:'P1', quantity: 1 }] };
        if (url.includes('/api/builds')) return { items: [{ id: 'b1', title: 'One Item', items: [{ productId:'P1', quantity: 1 }] }] };
        if (url.includes('/checkout/package')) return { ok: true, cartPath: null, meta: { totals: { subtotal: 0, total: 0, currency: 'USD' } }, hints: [{ type: 'MISSING_VARIANT', sku: 'SKU1' }] };
        return {};
      });
    }, []);
    return <PackagePanel buildId={'b1'} onCopy={()=>{}} onGoToCart={()=>{}} />;
  }
};

export const NetworkError = {
  render: () => {
    useEffect(() => {
      (globalThis as any).fetch = async (input: any) => {
        const url = typeof input === 'string' ? input : input?.toString?.() || '';
        if (url.includes('/api/builds/')) return new Response(JSON.stringify({ id: 'b1', items: [{ productId:'P1', quantity: 1 }] }), { headers: { 'content-type': 'application/json' } });
        if (url.includes('/api/builds')) return new Response(JSON.stringify({ items: [{ id: 'b1', title: 'One Item', items: [{ productId:'P1', quantity: 1 }] }] }), { headers: { 'content-type': 'application/json' } });
        if (url.includes('/checkout/package')) return new Response('fail', { status: 500 });
        return new Response('{}', { headers: { 'content-type':'application/json' } });
      };
    }, []);
    return <PackagePanel buildId={'b1'} onCopy={()=>{}} onGoToCart={()=>{}} />;
  }
};

export const KeyboardOnly = {
  render: () => {
    useEffect(() => {
      mockFetch((url) => {
        if (url.includes('/api/builds/')) return { id: 'b1', items: [{ productId:'P1', quantity: 1 }] };
        if (url.includes('/api/builds')) return { items: [{ id: 'b1', title: 'One Item', items: [{ productId:'P1', quantity: 1 }] }] };
        if (url.includes('/checkout/package')) return { ok: true, cartPath: '/cart/1:1', meta: { totals: { subtotal: 1000, total: 1000, currency: 'USD' } }, hints: [] };
        return {};
      });
    }, []);
    return <div>
      <p>Use Tab/Enter to navigate CTA and actions.</p>
      <PackagePanel buildId={'b1'} onCopy={()=>{}} onGoToCart={()=>{}} />
    </div>;
  }
};
// <!-- END RBP GENERATED: package-cta-v1 -->
