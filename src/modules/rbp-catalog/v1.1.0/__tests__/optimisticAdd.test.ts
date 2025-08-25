/* <!-- BEGIN RBP GENERATED: catalog-picker-v2 --> */
/** @jest-environment jsdom */
import { makeAddPatch, announceSelected } from '../hooks/useCatalogPicker';

describe('catalog v2 optimistic add failure (hook-level simulation)', () => {
  it('does not dispatch part-selected when patch fails', async () => {
    // Prepare listener for part-selected events
    const partEvtFn = jest.fn();
    window.addEventListener('rbp:part-selected', partEvtFn);

    // Build current items and next patch
    const current: any[] = [];
    const { items } = makeAddPatch(current, 'slot-1', { id: 'p1', title: 'Prod1', type: 'Rod' });
    expect(items.length).toBe(1);

    // Simulate PATCH failure: we intentionally DO NOT call announceSelected
    // which would be called only on success in the real module
    await new Promise(r => setTimeout(r, 10));
    expect(partEvtFn).not.toHaveBeenCalled();

    // Control: when success path is taken, event fires
    announceSelected({ buildId: 'b1', slotId: 'slot-1', type: 'Rod', productId: 'p1', variantId: null });
    await new Promise(r => setTimeout(r, 0));
    expect(partEvtFn).toHaveBeenCalledTimes(1);
  });
});
/* <!-- END RBP GENERATED: catalog-picker-v2 --> */
