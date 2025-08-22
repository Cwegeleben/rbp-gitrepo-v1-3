/*
<!-- BEGIN RBP GENERATED: dev-debug-panel-v1 -->
*/
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TenantContext } from '../TenantContext';
import { DevDebugPanel } from '../app/components/DevDebugPanel';

describe('DevDebugPanel (Admin)', () => {
  it('renders and toggles open', () => {
    render(
      <TenantContext.Provider value={{ shopDomain: 'demo.myshopify.com', plan: 'Dev', flags: { showDevTools: true } }}>
        <DevDebugPanel />
      </TenantContext.Provider>
    );
    const btn = screen.getByRole('button', { name: /developer debug/i });
    fireEvent.click(btn);
    expect(screen.getByText(/Plan \/ Flags/i)).toBeInTheDocument();
  });
});
/*
<!-- END RBP GENERATED: dev-debug-panel-v1 -->
*/
