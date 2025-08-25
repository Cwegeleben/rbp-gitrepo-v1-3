// <!-- BEGIN RBP GENERATED: builds-templates-v1 -->
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import TemplatesGrid from '../components/TemplatesGrid.js';

// Mock manifest import by jest automock of dynamic import
jest.mock('../manifest.json', () => ({
  __esModule: true,
  default: {
    version: 1,
    templates: [ { id:'t1', title:'Template One', slots:[{ type:'Reel Seat', productId:'p1' }] } ]
  }
}), { virtual: true });

describe('apply template', () => {
  beforeEach(()=>{ (global as any).fetch = jest.fn(async ()=>({ ok:true, json: async ()=>({ id: 'new123' }) })); });
  afterEach(()=>{ jest.resetAllMocks(); });

  it('creates a new build and fires rbp:active-build', async () => {
    const onActive = jest.fn();
    window.addEventListener('rbp:active-build', (e:any)=> onActive(e.detail?.id));
    render(React.createElement(TemplatesGrid));
    const btn = await screen.findByRole('button', { name: /Use this template/i });
    fireEvent.click(btn);
    await waitFor(()=> expect((global as any).fetch).toHaveBeenCalled());
    expect(onActive).toHaveBeenCalledWith('new123');
  });
});
// <!-- END RBP GENERATED: builds-templates-v1 -->
