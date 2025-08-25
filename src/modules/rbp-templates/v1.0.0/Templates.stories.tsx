// <!-- BEGIN RBP GENERATED: builds-templates-v1 -->
import React from 'react';
// @ts-nocheck
import TemplatesGrid from './components/TemplatesGrid.js';
export default { title: 'Storefront/Templates', component: TemplatesGrid } as any;
type Story = any;

function mockManifest(templates: any){
  jest.resetModules();
  jest.doMock('./manifest.json', () => ({ __esModule: true, default: { version: 1, templates } }), { virtual: true });
}

export const Default: Story = { render: () => { mockManifest(new Array(10).fill(0).map((_,i)=>({ id: 't'+i, title: `Template ${i+1}`, species: i%2? 'Bass':'Salmon & Steelhead', build: i%3? 'Mooching':'Drift', slots:[{type:'x',productId:'p'}] }))); return React.createElement(TemplatesGrid); } } as any;
export const Many: Story = { render: () => { mockManifest(new Array(20).fill(0).map((_,i)=>({ id: 'm'+i, title:`Many ${i}`, slots:[{type:'x',productId:'p'}] }))); return React.createElement(TemplatesGrid); } } as any;
export const Empty: Story = { render: () => { mockManifest([]); return React.createElement(TemplatesGrid); } } as any;
export const Error: Story = { render: () => { jest.resetModules(); jest.doMock('./manifest.json', ()=>{ throw new Error('bad'); }, { virtual: true }); return React.createElement(TemplatesGrid); } } as any;
export const KeyboardOnly: Story = { render: () => { mockManifest([{ id:'k', title:'Keyboard Only', slots:[{type:'x',productId:'p'}] }]); return React.createElement(TemplatesGrid); } } as any;
// <!-- END RBP GENERATED: builds-templates-v1 -->
