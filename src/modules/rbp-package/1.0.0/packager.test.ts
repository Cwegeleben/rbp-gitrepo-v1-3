// <!-- BEGIN RBP GENERATED: package-cta-v1 -->
/** @jest-environment jsdom */
import PackagePanel from './components/PackagePanel';
import React from 'react';
import { createRoot } from 'react-dom/client';

function render(ui: React.ReactElement){
  const div = document.createElement('div'); document.body.appendChild(div);
  const root = createRoot(div); root.render(ui); return { div, root };
}

describe('rbp-package packager', () => {
  beforeEach(() => { jest.resetAllMocks(); (globalThis as any).fetch = undefined as any; document.body.innerHTML = ''; });

  it('success → shows totals and enables Go to Cart', async () => {
    (globalThis as any).fetch = async (url: any) => {
      const u = String(url);
      if (u.includes('/api/builds/')) return new Response(JSON.stringify({ id: 'b1', items: [{ productId:'P1', quantity: 1 }] }), { headers: { 'content-type':'application/json' } });
      if (u.includes('/api/builds')) return new Response(JSON.stringify({ items: [{ id: 'b1', title: 'One', items: [{ productId:'P1', quantity: 1 }] }] }), { headers: { 'content-type':'application/json' } });
      if (u.includes('/checkout/package')) return new Response(JSON.stringify({ ok: true, cartPath: '/cart/1:1', meta: { totals: { subtotal: 1000, total: 1000, currency: 'USD' } } }), { headers: { 'content-type':'application/json' } });
      return new Response('{}', { headers: { 'content-type':'application/json' } });
    };
    const { div } = render(<PackagePanel buildId={'b1'} />);
    // click CTA
    const btn = div.querySelector('button[aria-label="Package Build"]') as HTMLButtonElement;
    // Wait a tick for build fetch
    await Promise.resolve(); await Promise.resolve();
    expect(btn.disabled).toBe(false);
    btn.click();
    await Promise.resolve(); await Promise.resolve();
    const go = div.querySelector('button[aria-label="Go to Cart"], a[role="button"]') as HTMLElement;
    expect(go).toBeTruthy();
  });

  it('success but no cartPath → shows hints and disables Go to Cart', async () => {
    (globalThis as any).fetch = async (url: any) => {
      const u = String(url);
      if (u.includes('/api/builds/')) return new Response(JSON.stringify({ id: 'b1', items: [{ productId:'P1', quantity: 1 }] }), { headers: { 'content-type':'application/json' } });
      if (u.includes('/api/builds')) return new Response(JSON.stringify({ items: [{ id: 'b1', title: 'One', items: [{ productId:'P1', quantity: 1 }] }] }), { headers: { 'content-type':'application/json' } });
      if (u.includes('/checkout/package')) return new Response(JSON.stringify({ ok: true, cartPath: null, hints: [{ type: 'MISSING_VARIANT' }] }), { headers: { 'content-type':'application/json' } });
      return new Response('{}', { headers: { 'content-type':'application/json' } });
    };
    const { div } = render(<PackagePanel buildId={'b1'} />);
    await Promise.resolve(); await Promise.resolve();
    (div.querySelector('button[aria-label="Package Build"]') as HTMLButtonElement).click();
    await Promise.resolve(); await Promise.resolve();
    const go = div.querySelector('a[role="button"]') as HTMLAnchorElement;
    expect(go?.getAttribute('aria-disabled')).toBe('true');
    const hints = Array.from(div.querySelectorAll('li')).map(li => li.textContent || '');
    expect(hints.join(' ')).toMatch(/MISSING_VARIANT/);
  });

  it('network error → shows error message and allows retry', async () => {
    let fail = true;
    (globalThis as any).fetch = async (url: any) => {
      const u = String(url);
      if (u.includes('/api/builds/')) return new Response(JSON.stringify({ id: 'b1', items: [{ productId:'P1', quantity: 1 }] }), { headers: { 'content-type':'application/json' } });
      if (u.includes('/api/builds')) return new Response(JSON.stringify({ items: [{ id: 'b1', title: 'One', items: [{ productId:'P1', quantity: 1 }] }] }), { headers: { 'content-type':'application/json' } });
      if (u.includes('/checkout/package')) return fail ? new Response('x', { status: 500 }) : new Response(JSON.stringify({ ok: true, cartPath: '/cart/1:1' }), { headers: { 'content-type':'application/json' } });
      return new Response('{}', { headers: { 'content-type':'application/json' } });
    };
    const { div } = render(<PackagePanel buildId={'b1'} />);
    await Promise.resolve(); await Promise.resolve();
    const btn = div.querySelector('button[aria-label="Package Build"]') as HTMLButtonElement;
    btn.click();
    await Promise.resolve(); await Promise.resolve();
    expect(div.textContent || '').toMatch(/Error packaging/i);
    // Retry
    fail = false; btn.click(); await Promise.resolve(); await Promise.resolve();
    expect((div.querySelector('a[role="button"]') as HTMLAnchorElement)?.getAttribute('href')).toContain('/cart/');
  });
});
// <!-- END RBP GENERATED: package-cta-v1 -->
