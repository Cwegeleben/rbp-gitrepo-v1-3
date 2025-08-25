/* <!-- BEGIN RBP GENERATED: builds-undo-redo-v1 --> */
import { createHistoryStack } from '../utils/ops';

test('branch cutting after undo clears redo', () => {
  const h = createHistoryStack(5);
  h.push({ type:'RENAME_SLOT', slotId:'a', prevName:'A', nextName:'B' } as any);
  h.push({ type:'RENAME_SLOT', slotId:'a', prevName:'B', nextName:'C' } as any);
  expect(h.canUndo()).toBe(true);
  h.undo(); // to B
  expect(h.canRedo()).toBe(true);
  h.push({ type:'RENAME_SLOT', slotId:'a', prevName:'B', nextName:'BB' } as any);
  expect(h.canRedo()).toBe(false);
});

test('bounded length drops oldest', () => {
  const h = createHistoryStack(3);
  h.push({ type:'RENAME_SLOT', slotId:'a', prevName:'', nextName:'1' } as any);
  h.push({ type:'RENAME_SLOT', slotId:'b', prevName:'', nextName:'2' } as any);
  h.push({ type:'RENAME_SLOT', slotId:'c', prevName:'', nextName:'3' } as any);
  h.push({ type:'RENAME_SLOT', slotId:'d', prevName:'', nextName:'4' } as any);
  // only last 3 remain
  expect((h as any)._state.past).toHaveLength(3);
});
/* <!-- END RBP GENERATED: builds-undo-redo-v1 --> */
