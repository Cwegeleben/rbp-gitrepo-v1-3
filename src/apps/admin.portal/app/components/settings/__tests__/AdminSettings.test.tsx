/*
<!-- BEGIN RBP GENERATED: admin-settings-v1 -->
*/
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminSettings from '../AdminSettings';

function renderWithRouter(el: React.ReactElement, url = '/app/settings?shop=rbp-dev.myshopify.com&host=abc&embedded=1') {
  return render(<MemoryRouter initialEntries={[url]}>{el}</MemoryRouter>);
}

test('renders context and doctor link', async () => {
  renderWithRouter(<AdminSettings loadCtx={async () => ({ shopDomain: 'rbp-dev.myshopify.com', features: { proxy: { hmacVerified: true } } })} />);
  expect(await screen.findByText('Settings')).toBeInTheDocument();
  expect(screen.getByLabelText('Shop domain')).toHaveValue('rbp-dev.myshopify.com');
  const link = screen.getByRole('link', { name: /doctor/i });
  expect((link as HTMLAnchorElement).getAttribute('href')).toMatch(/\/app\/doctor\?(.+&)?embedded=1/);
});

test('flags persist in localStorage', async () => {
  renderWithRouter(<AdminSettings loadCtx={async () => ({ shopDomain: 'rbp-dev.myshopify.com' })} />);
  const toggle = screen.getByLabelText('newCatalog') as HTMLInputElement;
  fireEvent.click(toggle);
  expect(localStorage.getItem('rbp.flags.newCatalog')).toBe('1');
  // toggle off
  fireEvent.click(toggle);
  expect(localStorage.getItem('rbp.flags.newCatalog')).toBeNull();
});

test('shows error banner on ctx failure', async () => {
  renderWithRouter(<AdminSettings loadCtx={async () => null} />);
  expect(await screen.findByRole('alert')).toHaveTextContent(/failed to load access context/i);
});
/*
<!-- END RBP GENERATED: admin-settings-v1 -->
*/
