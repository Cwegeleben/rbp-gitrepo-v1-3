// <!-- BEGIN RBP GENERATED: ui-toast-announcer-v1 -->
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';

describe('rbp-ui events → toast render', () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    // dynamic import mounts automatically
    // @ts-ignore no types for JS entry needed in tests
    await import('../index.js');
  });
  afterEach(() => { jest.useRealTimers(); document.body.innerHTML=''; });

  it('dispatching rbp:toast shows a toast', async () => {
    act(() => {
      window.dispatchEvent(new CustomEvent('rbp:toast', { detail: { type:'success', message:'Saved!' } }));
    });
    const host = document.getElementById('rbp-ui-host');
    expect(host).toBeInTheDocument();
    expect(host?.textContent).toContain('Saved!');
  });

  it('duplicate id updates existing toast', async () => {
    act(() => {
      window.dispatchEvent(new CustomEvent('rbp:toast', { detail: { id:'same', type:'info', message:'Step 1' } }));
    });
    const host = document.getElementById('rbp-ui-host')!;
    expect(host.textContent).toContain('Step 1');
    act(() => {
      window.dispatchEvent(new CustomEvent('rbp:toast', { detail: { id:'same', type:'success', message:'Step 2' } }));
    });
    expect(host.textContent).not.toContain('Step 1');
    expect(host.textContent).toContain('Step 2');
  });
});
// <!-- END RBP GENERATED: ui-toast-announcer-v1 -->
