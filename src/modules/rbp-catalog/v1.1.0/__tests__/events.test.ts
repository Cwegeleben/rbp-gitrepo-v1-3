/* <!-- BEGIN RBP GENERATED: catalog-picker-v2 --> */
/** @jest-environment jsdom */
import { handleStartSelectionEvent, makeAddPatch, announceSelected } from '../hooks/useCatalogPicker';

describe('catalog v2 events and selection (hooks)', () => {
  it('updates filters from start-selection event', () => {
    const filters = { type: '', slot: '', page: 3 } as any;
    const detail = { type: 'Rod', slotId: 'slot-1' };
    const nf = handleStartSelectionEvent(filters, detail);
    expect(nf).toMatchObject({ type: 'Rod', slot: 'slot-1', page: 1 });
  });

  it('produces item patch and dispatches part-selected event', async () => {
    const items: any[] = [];
    const { items: next } = makeAddPatch(items, 'slot-1', { id: 'p1', title: 'Prod1', type: 'Rod' });
    expect(next.length).toBe(1);
    expect(next[0]).toMatchObject({ productId: 'p1', slotId: 'slot-1', type: 'Rod' });

    const evtPromise = new Promise(resolve => {
      window.addEventListener('rbp:part-selected', (e: any) => resolve(e.detail));
    });
    announceSelected({ buildId: 'b1', slotId: 'slot-1', type: 'Rod', productId: 'p1', variantId: null });
    const detail: any = await evtPromise;
    expect(detail).toEqual({ buildId: 'b1', slotId: 'slot-1', type: 'Rod', productId: 'p1', variantId: null });
  });
});
/* <!-- END RBP GENERATED: catalog-picker-v2 --> */
