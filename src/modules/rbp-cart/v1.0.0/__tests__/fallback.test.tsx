// <!-- BEGIN RBP GENERATED: cart-drawer-v1 -->
// @ts-nocheck
/** @jest-environment jsdom */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockFetch, flush } from '../../../../test/utils/fetchMock';

describe('rbp-cart CTA mode', () => {
  beforeEach(() => { document.body.innerHTML = '<div id="root"></div>'; });
  afterEach(() => { document.body.innerHTML = ''; });

  it('Package & View Cart → success with cartPath enables Go to Cart', async () => {
    const mf = mockFetch()
      .when(/\/apps\/proxy\/api\/builds$/).respondWith(200, { items: [{ id: 'b1' }] })
      .when(/\/apps\/proxy\/api\/checkout\/package$/).respondWith(200, { ok: true, cartPath: '/cart/1:1', meta: { totals: { subtotal: 1000, total: 1000, currency: 'USD' } }, items: [{ title: 'P1', quantity: 1 }] });

    const root = document.getElementById('root')!;
    const mod = await import('../index.js');
    const { unmount } = mod.default(root, {});

    const user = userEvent.setup();
    const cta = await screen.findByRole('button', { name: /package & view cart/i });
    await user.click(cta);
    await flush(1);

    const go = await screen.findByRole('button', { name: /go to cart/i });
    expect(go).toBeEnabled();
    unmount(); mf.restore();
  });
});
// <!-- END RBP GENERATED: cart-drawer-v1 -->
