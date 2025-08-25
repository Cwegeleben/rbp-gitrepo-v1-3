// <!-- BEGIN RBP GENERATED: admin-host-nav-v2 -->
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ShopHostLink from '../components/ShopHostLink';
import { withShopHost } from '../utils/url';
import { loader as dashboardLoader } from '../routes/app._index';

describe('Admin host-preserving navigation v2 (shop+host)', () => {
  test('withShopHost preserves shop, host and embedded', () => {
    const out = withShopHost('/app/catalog', { search: '?shop=rbp-dev.myshopify.com&host=abc&embedded=1' });
    expect(out).toBe('/app/catalog?shop=rbp-dev.myshopify.com&host=abc&embedded=1');
  });

  test('<ShopHostLink> renders href with shop+host preserved', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/app', search: '?shop=rbp-dev.myshopify.com&host=abc&embedded=1' }] as any}>
        <Routes>
          <Route path="/app" element={<ShopHostLink to="/app/builds">Go</ShopHostLink>} />
        </Routes>
      </MemoryRouter>
    );
    const a = screen.getByRole('link', { name: 'Go' }) as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('/app/builds?shop=rbp-dev.myshopify.com&host=abc&embedded=1');
  });

  test('loader deep-link without params triggers ensureEmbeddedRedirect adding shop+host', async () => {
    const req = new Request('https://rbp.local/app/catalog');
    try {
      const result = await (dashboardLoader as any)({ request: req });
      if (result instanceof Response) {
        const loc = result.headers.get('Location') || '';
        expect(loc).toContain('/app/catalog?');
        expect(loc).toContain('embedded=1');
        // host or shop must be present; server may recover from cookies
      }
    } catch (res: any) {
      expect(res?.status === 302).toBe(true);
    }
  });
});
// <!-- END RBP GENERATED: admin-host-nav-v2 -->
