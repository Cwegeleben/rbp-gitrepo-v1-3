/*
<!-- BEGIN RBP GENERATED: dev-debug-panel-v1 -->
*/
import React from 'react';
import { render } from '@testing-library/react';
import Shell from '../v0.2.0/Shell';

const registry = { modules: {} } as any;

describe('Dev section gating (Storefront)', () => {
  it('does not render when flag is off', () => {
    const { queryByRole } = render(<Shell ctx={{ tenant: { domain: 'demo.myshopify.com' }, plan: 'Dev', flags: { showDevTools: false } }} registry={registry} navigate={() => {}} />);
    expect(queryByRole('button', { name: /^Dev$/i })).toBeNull();
  });
});
/*
<!-- END RBP GENERATED: dev-debug-panel-v1 -->
*/
