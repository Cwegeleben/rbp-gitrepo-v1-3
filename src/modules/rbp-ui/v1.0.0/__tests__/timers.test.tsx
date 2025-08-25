// <!-- BEGIN RBP GENERATED: ui-toast-announcer-v1 -->
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';

describe('rbp-ui timers', () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    // @ts-ignore
    await import('../index.js');
  });
  afterEach(() => { jest.useRealTimers(); document.body.innerHTML=''; });

  it('auto-dismiss default (4s)', async () => {
    act(() => { window.dispatchEvent(new CustomEvent('rbp:toast', { detail: { type:'info', message:'Hello' } })); });
    const host = document.getElementById('rbp-ui-host')!;
    expect(host.textContent).toContain('Hello');
    act(() => { jest.advanceTimersByTime(3990); });
    expect(host.textContent).toContain('Hello');
    act(() => { jest.advanceTimersByTime(50); });
    expect(host.textContent || '').not.toContain('Hello');
  });

  it('manual close via button returns focus', async () => {
    const btn = document.createElement('button'); btn.textContent = 'focusme'; document.body.appendChild(btn); btn.focus();
    act(() => { window.dispatchEvent(new CustomEvent('rbp:toast', { detail: { type:'success', message:'Save ok', timeoutMs: 10000 } })); });
    const host = document.getElementById('rbp-ui-host')!;
    const close = host.querySelector('button[aria-label="Close"]') as HTMLButtonElement;
    expect(close).toBeInTheDocument();
    act(() => { close.click(); });
    expect(document.activeElement).toBe(btn);
  });
});
// <!-- END RBP GENERATED: ui-toast-announcer-v1 -->
