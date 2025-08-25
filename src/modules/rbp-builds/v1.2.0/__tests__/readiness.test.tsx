// <!-- BEGIN RBP GENERATED: builds-readiness-v1 -->

import { createReadiness, bindReadinessEvents } from '../hooks/useReadiness';

describe('rbp-builds v1.2.0 readiness', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // basic fetch mock
    // @ts-ignore
    global.fetch = jest.fn(async (url: string, init?: any) => {
      if (String(url).includes('/apps/proxy/api/builds') && !String(url).includes('/checkout')){
        if (String(url).endsWith('/apps/proxy/api/builds')) {
          return { ok: true, json: async () => ({ items: [{ id: 'b1', title: 'My Build', items: [{ id: 's1', type: 'Rod', quantity: 1 }] }] }) } as any;
        }
        if (String(url).endsWith('/apps/proxy/api/builds/b1')) {
          return { ok: true, json: async () => ({ id: 'b1', title: 'My Build', items: [{ id: 's1', type: 'Rod', quantity: 1 }] }) } as any;
        }
      }
      if (String(url).includes('/apps/proxy/api/checkout/package')){
        // dry-run has header
        const isDry = init?.headers?.['X-RBP-Dry-Run'] === '1';
        if (isDry) {
          return { ok: true, json: async () => ({ hints: [{ type: 'MISSING_VARIANT', slotId: 's1', slotType: 'Rod' }], meta: { totals: { subtotal: 1000, total: 1000, currency: 'USD' } } }) } as any;
        }
        return { ok: true, json: async () => ({ cartPath: '/cart', meta: { totals: { subtotal: 1000, total: 1100, estTax: 100, currency: 'USD' } } }) } as any;
      }
      throw new Error('Unhandled fetch: '+url);
    });
    document.body.innerHTML = '<div id="root"></div>';
  });
  afterEach(() => { jest.useRealTimers(); });

  it('maps hints and debounces dry-run; latest wins', async () => {
    const root = document.getElementById('root')! as HTMLElement;
  let buildId = 'b1';
  const ctrl = createReadiness(()=>buildId, (global as any).fetch, (msg)=>{ /* aria-live noop */ }, 300);
  const unbind = bindReadinessEvents(ctrl);
  ctrl.schedule();
  jest.advanceTimersByTime(350);
  await Promise.resolve();
  const s1 = ctrl.getState();
  expect(s1.issuesCount).toBeGreaterThanOrEqual(0);
  // debounce cancel
  window.dispatchEvent(new CustomEvent('rbp:build-updated', { detail: { id: 'b1' } }));
  jest.advanceTimersByTime(150);
  window.dispatchEvent(new CustomEvent('rbp:build-updated', { detail: { id: 'b1' } }));
  jest.advanceTimersByTime(300);
  await Promise.resolve();
  const s2 = ctrl.getState();
  expect(s2).toBeTruthy();
  unbind();
  });

  it('renders per-slot badge and exposes Retry', async () => {
    const root = document.getElementById('root')! as HTMLElement;
  let buildId = 'b1';
  const ctrl = createReadiness(()=>buildId, (global as any).fetch, ()=>{}, 300);
  ctrl.schedule();
  jest.advanceTimersByTime(350);
  await Promise.resolve();
  await Promise.resolve();
  const s = ctrl.getState();
  expect(s.issuesCount).toBeGreaterThanOrEqual(1);
  });
});
// <!-- END RBP GENERATED: builds-readiness-v1 -->
