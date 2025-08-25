// <!-- BEGIN RBP GENERATED: cart-drawer-v1 -->
/** @jest-environment jsdom */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithBuildCtx } from '../../../../test/utils/renderWithBuildCtx';
import CartDrawer from '../components/CartDrawer';

function renderOpen(data: any){
  return renderWithBuildCtx(
    <CartDrawer open={true} status="ready" data={data} raw={data} error={null} onClose={()=>{}} onCopy={()=>{}} onGoToCart={()=>{}} onRetry={()=>{}} />
  );
}

describe('rbp-cart events', () => {
  it('opens drawer and shows items + totals when provided data', async () => {
    const data = { items: [{ title: 'P1', qty: 1 }], totals: { subtotal: 1000, total: 1000, currency: 'USD' }, hints: [], cartPath: '/cart' };
    renderOpen(data);
    expect(await screen.findByText(/Totals/i)).toBeInTheDocument();
    expect(screen.getByText('P1')).toBeInTheDocument();
    const go = screen.getByRole('button', { name: /go to cart/i });
    expect(go).toBeEnabled();
  });
});
// <!-- END RBP GENERATED: cart-drawer-v1 -->
