// <!-- BEGIN RBP GENERATED: admin-host-nav-v2 -->
import React from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { useShopHostSubmit } from '../hooks/useShopHostSubmit';

function Harness() {
  const submit = useShopHostSubmit();
  const { search } = useLocation();
  React.useEffect(() => {
    const params = new URLSearchParams();
    submit(params, {
      method: 'get',
      submit: (body: URLSearchParams) => {
        const out = body.toString();
        const el = document.getElementById('out')!;
        el.textContent = out;
      },
    });
  }, []);
  return <div data-testid="loc">{search}<span id="out" /></div>;
}

describe('useShopHostSubmit (GET)', () => {
  test('appends shop, host, and embedded=1', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/app/builds', search: '?shop=rbp-dev.myshopify.com&host=abc&embedded=1' }] as any}>
        <Harness />
      </MemoryRouter>
    );
    const out = (document.getElementById('out') as HTMLElement).textContent || '';
    expect(out).toContain('shop=rbp-dev.myshopify.com');
    expect(out).toContain('host=abc');
    expect(out).toContain('embedded=1');
  });
});
// <!-- END RBP GENERATED: admin-host-nav-v2 -->
