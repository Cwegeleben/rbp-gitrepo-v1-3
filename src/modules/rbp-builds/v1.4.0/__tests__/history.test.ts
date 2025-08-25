/* <!-- BEGIN RBP GENERATED: builds-undo-redo-v1 --> */
import { inverseOf, applyOp, type Op } from '../../v1.4.0/utils/ops';

function make(items: any[]): any[]{ return items.map(x => ({ ...x })); }

test('inverseOf basic', () => {
  const op: Op = { type:'RENAME_SLOT', slotId:'a', prevName:'x', nextName:'y' };
  const inv = inverseOf(op)!;
  expect(inv).toEqual({ type:'RENAME_SLOT', slotId:'a', prevName:'y', nextName:'x' });
});

test('applyOp rename and reorder', () => {
  const items = make([{ id:'a', label:'A' }, { id:'b', label:'B' }]);
  const r1 = applyOp(items, { type:'RENAME_SLOT', slotId:'a', prevName:'A', nextName:'AA' });
  expect(r1[0].label).toBe('AA');
  const r2 = applyOp(r1, { type:'REORDER_SLOT', slotId:'a', from:0, to:1 });
  expect(r2[1].id).toBe('a');
});

test('clear and restore', () => {
  const before = make([{ id:'a' }]);
  const cleared = applyOp(before, { type:'CLEAR_BUILD', prevSnapshot: { items: before } });
  expect(cleared).toHaveLength(0);
  const restored = applyOp(cleared, { type:'RESTORE_BUILD', prevSnapshot: { items: before } });
  expect(restored).toHaveLength(1);
});
/* <!-- END RBP GENERATED: builds-undo-redo-v1 --> */
