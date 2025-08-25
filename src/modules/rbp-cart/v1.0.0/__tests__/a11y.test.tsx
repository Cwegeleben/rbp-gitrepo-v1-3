// <!-- BEGIN RBP GENERATED: cart-drawer-v1 -->
/** @jest-environment jsdom */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithBuildCtx } from '../../../../test/utils/renderWithBuildCtx';
import CartDrawer from '../components/CartDrawer';

describe('rbp-cart a11y', () => {
  it('focus moves into drawer and Esc closes', async () => {
    const data = { items: [{ title: 'P1', qty: 1 }], totals: undefined, hints: [], cartPath: null };
    renderWithBuildCtx(<CartDrawer open={true} status="ready" data={data} raw={data} error={null} onClose={() => { (document.body as any).__closed = true; }} onCopy={()=>{}} onGoToCart={()=>{}} onRetry={()=>{}} />);
    const close = await screen.findByRole('button', { name: /close mini cart/i });
    expect(document.activeElement === close || close.contains(document.activeElement as any)).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect((document.body as any).__closed).toBeTruthy();
  });
});
// <!-- END RBP GENERATED: cart-drawer-v1 -->
