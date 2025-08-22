/*
<!-- BEGIN RBP GENERATED: dev-debug-panel-v1 -->
*/
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DevSection from '../v0.2.0/components/DevSection';

describe('DevSection (Storefront)', () => {
  it('shows HMAC hint on error', () => {
    render(<DevSection ctx={{ tenant: { domain: '' }, plan: 'Dev', flags: { showDevTools: true } }} error={{ code: 'HMAC' }} />);
    const btn = screen.getByRole('button', { name: /dev/i });
    fireEvent.click(btn);
    expect(screen.getByText(/signed URL/i)).toBeInTheDocument();
  });
});
/*
<!-- END RBP GENERATED: dev-debug-panel-v1 -->
*/
