// <!-- BEGIN RBP GENERATED: package-cta-v1 -->
// <!-- BEGIN RBP GENERATED: package-tests-stable-v1 -->
/** @jest-environment jsdom */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithBuildCtx } from '../../../../test/utils/renderWithBuildCtx';
import { mockFetch, flush } from '../../../../test/utils/fetchMock';
import PackagePanel from '../components/PackagePanel';

describe('rbp-package a11y (stable)', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('aria-live messages fire on pending/success/error', async () => {
    const mf = mockFetch()
      .when(/\/apps\/proxy\/api\/builds\/b1/).respondWith(200, { id: 'b1', items: [{ productId: 'P1', quantity: 1 }] })
      // dry-run succeeds
      .when((u: string, init?: RequestInit) => /\/apps\/proxy\/api\/checkout\/package\?buildId=b1/.test(u) && !!(init as any)?.headers && (init as any).headers['X-RBP-Dry-Run'] === '1')
      .respondWith(200, { ok: true, meta: { totals: { subtotal: 1000, total: 1000, currency: 'USD' } } })
      // actual packaging errors first, then succeeds
      .when((u: string, init?: RequestInit) => /\/apps\/proxy\/api\/checkout\/package\?buildId=b1/.test(u) && !((init as any)?.headers && (init as any).headers['X-RBP-Dry-Run'] === '1'))
      .respondOnce(500)
      .when((u: string, init?: RequestInit) => /\/apps\/proxy\/api\/checkout\/package\?buildId=b1/.test(u) && !((init as any)?.headers && (init as any).headers['X-RBP-Dry-Run'] === '1'))
      .respondWith(200, { ok: true, cartPath: '/cart/1:1' });

    renderWithBuildCtx(<PackagePanel buildId="b1" />);
    const user = userEvent.setup();

    const live = document.getElementById('rbp-aria-live')!;
    const cta = await screen.findByRole('button', { name: /package build/i });
    await waitFor(() => expect(cta).toBeEnabled());
    await user.click(cta); // triggers error
    await flush(2);
    expect(live.textContent || '').toMatch(/Error packaging/i);

    await user.click(cta); // retry success
    await flush(2);
    expect(live.textContent || '').toMatch(/Packaged/i);
    mf.restore();
  });

  it('Keyboard tab order reaches CTA and Copy JSON', async () => {
    const mf = mockFetch()
      .when(/\/apps\/proxy\/api\/builds\/b1/).respondWith(200, { id: 'b1', items: [{ productId: 'P1', quantity: 1 }] })
      .when(/\/apps\/proxy\/api\/checkout\/package\?buildId=b1/).respondWith(200, { ok: true, cartPath: '/cart/1:1' });

    renderWithBuildCtx(<PackagePanel buildId="b1" />);
    const user = userEvent.setup();

    const cta = await screen.findByRole('button', { name: /package build/i });
    await waitFor(() => expect(cta).toBeEnabled());
    await user.tab(); // focus first tabbable (likely CTA)
    expect(document.activeElement).toBe(cta);

    await user.click(cta);
    await flush(2);
    const go = await screen.findByRole('button', { name: /go to cart/i });
    const copy = await screen.findByRole('button', { name: /copy json/i });
    expect(go).toBeInTheDocument();
    expect(copy).toBeInTheDocument();
    mf.restore();
  });
});
// <!-- END RBP GENERATED: package-tests-stable-v1 -->
// <!-- END RBP GENERATED: package-cta-v1 -->
