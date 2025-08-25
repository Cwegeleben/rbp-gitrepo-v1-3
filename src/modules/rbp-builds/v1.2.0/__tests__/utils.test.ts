// <!-- BEGIN RBP GENERATED: builds-readiness-v1 -->
import { mapHint, groupBySlot } from '../utils/hintsMap';
import { createReadiness } from '../hooks/useReadiness';
import { startFixSelection } from '../components/FixActions';

describe('readiness utils', () => {
  it('maps hints with severity and groups by slot', () => {
    const mapped = [
      mapHint({ type: 'MISSING_VARIANT', slotId: 's1' }),
      mapHint({ type: 'NO_PRICE', slotId: 's2' }),
      mapHint({ type: 'UNKNOWN_CODE', slotId: 's1' }),
    ];
    expect(mapped[0].severity).toBe('error');
    const by = groupBySlot(mapped);
    expect(by.get('s1')?.length).toBe(2);
    expect(by.get('s2')?.length).toBe(1);
  });

  it('debounces and latest wins; exposes state', async () => {
    jest.useFakeTimers();
    let calls: any[] = [];
    const fetcher = async (url: string, init?: any) => { calls.push({ url, init }); return { hints: [], meta: { totals: { subtotal: 1000, total: 1000, currency: 'USD' } } }; };
    let id = 'b1';
    const ctrl = createReadiness(()=>id, fetcher as any, ()=>{}, 200);
    ctrl.schedule();
    jest.advanceTimersByTime(150);
    // change id before it fires, causing abort
    id = 'b2';
    ctrl.schedule();
    jest.advanceTimersByTime(250);
    await Promise.resolve();
    expect(calls.length).toBe(1);
    expect(calls[0].url).toContain('b2');
    const s = ctrl.getState();
    expect(s.issuesCount).toBe(0);
    expect(s.totals?.total).toBe(1000);
  });

  it('Fix action dispatches event and updates URL', () => {
    const spy = jest.fn();
    window.addEventListener('rbp:start-part-selection', spy);
    // Reset URL
    // @ts-ignore
    delete window.location; // jsdom override
    // @ts-ignore
    window.location = new URL('https://example.com/') as any;

    startFixSelection('Rod','s1');
    expect(spy).toHaveBeenCalled();
    const url = new URL(window.location.href);
    expect(url.searchParams.get('type')).toBe('Rod');
    expect(url.searchParams.get('slot')).toBe('s1');
  });
});
// <!-- END RBP GENERATED: builds-readiness-v1 -->
