/*
<!-- BEGIN RBP GENERATED: dev-debug-panel-v1 -->
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { TenantContext } from '../TenantContext';

describe('Dev panel gating (Admin)', () => {
  it('does not render when flag is off', () => {
    const { queryByRole } = render(
      <TenantContext.Provider value={{ shopDomain: 'demo.myshopify.com', plan: 'Dev', flags: { showDevTools: false } }}>
        <Dashboard />
      </TenantContext.Provider>
    );
    expect(queryByRole('button', { name: /developer debug/i })).toBeNull();
  });
});
/*
<!-- END RBP GENERATED: dev-debug-panel-v1 -->
*/
