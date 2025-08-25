// <!-- BEGIN RBP GENERATED: builds-templates-v1 -->
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TemplatesGrid from '../components/TemplatesGrid.js';

jest.mock('../manifest.json', () => ({
  __esModule: true,
  default: {
    version: 1,
    templates: [
      { id:'a', title:'Alpha', species:'Bass', build:'Drift', slots:[{type:'x',productId:'p'}] },
      { id:'b', title:'Beta', species:'Salmon & Steelhead', build:'Mooching', slots:[{type:'x',productId:'p'}] }
    ]
  }
}), { virtual: true });

describe('filters & URL', () => {
  it('search updates results and URL', async () => {
    render(React.createElement(TemplatesGrid));
    const input = await screen.findByRole('textbox', { name: /search/i });
    fireEvent.change(input, { target: { value: 'Alpha' } });
    expect(screen.getAllByRole('button', { name: /Use this template/i }).length).toBe(1);
    expect(window.location.search).toContain('q=Alpha');
  });
});
// <!-- END RBP GENERATED: builds-templates-v1 -->
