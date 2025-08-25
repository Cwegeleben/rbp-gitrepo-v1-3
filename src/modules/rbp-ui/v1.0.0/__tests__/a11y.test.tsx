// <!-- BEGIN RBP GENERATED: ui-toast-announcer-v1 -->
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';

describe('rbp-ui a11y', () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    // @ts-ignore
    await import('../index.js');
  });
  afterEach(() => { jest.useRealTimers(); document.body.innerHTML=''; });

  it('announce polite by default and assertive when requested', async () => {
    act(() => { window.dispatchEvent(new CustomEvent('rbp:announce', { detail: { message:'Saved successfully.' } })); });
    const polite = document.getElementById('rbp-announce-polite');
    expect(polite?.textContent).toBe('Saved successfully.');
    act(() => { window.dispatchEvent(new CustomEvent('rbp:announce', { detail: { message:'Error now', politeness:'assertive' } })); });
    const assertive = document.getElementById('rbp-announce-assertive');
    expect(assertive?.textContent).toBe('Error now');
  });

  it('toast is reachable by keyboard and Esc closes', async () => {
    const button = document.createElement('button'); button.textContent = 'origin'; document.body.appendChild(button); button.focus();
    act(() => { window.dispatchEvent(new CustomEvent('rbp:toast', { detail: { type:'warning', message:'Heads up', timeoutMs: 10000 } })); });
    const host = document.getElementById('rbp-ui-host')!;
    const toast = host.querySelector('.rbp-toast') as HTMLElement;
    expect(toast).toBeInTheDocument();
    act(() => { (toast as HTMLElement).focus(); });
    expect(document.activeElement).toBe(toast);
    const evt = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    act(() => { toast.dispatchEvent(evt); });
    expect(document.activeElement).toBe(button);
  });
});
// <!-- END RBP GENERATED: ui-toast-announcer-v1 -->
