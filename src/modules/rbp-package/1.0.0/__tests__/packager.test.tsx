// <!-- BEGIN RBP GENERATED: package-cta-v1 -->
// <!-- BEGIN RBP GENERATED: package-tests-stable-v1 -->
/** @jest-environment jsdom */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithBuildCtx } from '../../../../test/utils/renderWithBuildCtx';
import { mockFetch, flush } from '../../../../test/utils/fetchMock';
import PackagePanel from '../components/PackagePanel';

describe('rbp-package packager (stable)', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('success → shows totals and enables Go to Cart', async () => {
    const mf = mockFetch()
      .when(/\/apps\/proxy\/api\/builds\/b1/).respondWith(200, { id: 'b1', items: [{ productId: 'P1', quantity: 1 }] })
      .when((u: string, init?: RequestInit) => /\/apps\/proxy\/api\/checkout\/package\?buildId=b1/.test(u) && !!(init as any)?.headers && (init as any).headers['X-RBP-Dry-Run'] === '1')
      .respondWith(200, { ok: true, meta: { totals: { subtotal: 1000, total: 1000, currency: 'USD' } } })
      .when((u: string, init?: RequestInit) => /\/apps\/proxy\/api\/checkout\/package\?buildId=b1/.test(u) && !((init as any)?.headers && (init as any).headers['X-RBP-Dry-Run'] === '1'))
      .respondWith(200, { ok: true, cartPath: '/cart/1:1', meta: { totals: { subtotal: 1000, total: 1000, currency: 'USD' } } });

    const onGo = jest.fn();
    renderWithBuildCtx(<PackagePanel buildId="b1" onGoToCart={onGo} />);
    const user = userEvent.setup();

    const cta = await screen.findByRole('button', { name: /package build/i });
    await waitFor(() => expect(cta).toBeEnabled());
    await user.click(cta);
    await flush(2);

    const go = await screen.findByRole('button', { name: /go to cart/i });
    expect(go).toBeEnabled();
    await user.click(go);
    expect(onGo).toHaveBeenCalledWith(expect.stringContaining('/cart/'));
    mf.restore();
  });

  it('success but no cartPath → shows hints and disables Go to Cart', async () => {
    const mf = mockFetch()
      .when(/\/apps\/proxy\/api\/builds\/b1/).respondWith(200, { id: 'b1', items: [{ productId: 'P1', quantity: 1 }] })
      .when((u: string, init?: RequestInit) => /\/apps\/proxy\/api\/checkout\/package\?buildId=b1/.test(u) && !!(init as any)?.headers && (init as any).headers['X-RBP-Dry-Run'] === '1')
      .respondWith(200, { ok: true, meta: { totals: { subtotal: 1000, total: 1000, currency: 'USD' } } })
      .when((u: string, init?: RequestInit) => /\/apps\/proxy\/api\/checkout\/package\?buildId=b1/.test(u) && !((init as any)?.headers && (init as any).headers['X-RBP-Dry-Run'] === '1'))
      .respondWith(200, { ok: true, cartPath: null, hints: [{ type: 'MISSING_VARIANT' }] });

    renderWithBuildCtx(<PackagePanel buildId="b1" />);
    const user = userEvent.setup();

    const cta = await screen.findByRole('button', { name: /package build/i });
    await waitFor(() => expect(cta).toBeEnabled());
    await user.click(cta);
    await flush(2);

    const go = await screen.findByRole('button', { name: /go to cart/i });
    expect(go).toBeDisabled();
    expect(screen.getByText(/MISSING_VARIANT/i)).toBeInTheDocument();
    mf.restore();
  });

  it('network error → shows error message and allows retry', async () => {
    const mf = mockFetch()
      .when(/\/apps\/proxy\/api\/builds\/b1/).respondWith(200, { id: 'b1', items: [{ productId: 'P1', quantity: 1 }] })
      .when((u: string, init?: RequestInit) => /\/apps\/proxy\/api\/checkout\/package\?buildId=b1/.test(u) && !!(init as any)?.headers && (init as any).headers['X-RBP-Dry-Run'] === '1')
      .respondWith(200, { ok: true })
      .when((u: string, init?: RequestInit) => /\/apps\/proxy\/api\/checkout\/package\?buildId=b1/.test(u) && !((init as any)?.headers && (init as any).headers['X-RBP-Dry-Run'] === '1'))
      .respondOnce(500)
      .when((u: string, init?: RequestInit) => /\/apps\/proxy\/api\/checkout\/package\?buildId=b1/.test(u) && !((init as any)?.headers && (init as any).headers['X-RBP-Dry-Run'] === '1'))
      .respondWith(200, { ok: true, cartPath: '/cart/1:1' });

    renderWithBuildCtx(<PackagePanel buildId="b1" />);
    const user = userEvent.setup();

    const cta = await screen.findByRole('button', { name: /package build/i });
    await waitFor(() => expect(cta).toBeEnabled());
    // first click -> 500
  await user.click(cta);
  await flush(2);
  // We use the aria-live div for error confirmation to avoid ambiguity
  const live = document.getElementById('rbp-aria-live');
  expect(live?.textContent || '').toMatch(/Error packaging/i);
    // second click -> 200
    await user.click(cta);
    await flush(2);
  const go = await screen.findByRole('button', { name: /go to cart/i });
    expect(go).toBeEnabled();
    mf.restore();
  });
});
// <!-- END RBP GENERATED: package-tests-stable-v1 -->
// <!-- END RBP GENERATED: package-cta-v1 -->
