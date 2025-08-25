/* <!-- BEGIN RBP GENERATED: builds-undo-redo-v1 --> */
import { inverseOf, applyOp, type Op } from '../../v1.4.0/utils/ops';

test('assign/remove invert', () => {
  const assign: any = { type:'ASSIGN_PART', slotId:'x', prev: null, next:{ sku:'1' } };
  const inv = inverseOf(assign as Op)!;
  expect(inv.type).toBe('ASSIGN_PART');
  expect((inv as any).prev).toEqual(assign.next);
});

test('remove slot invert', () => {
  const slot = { id:'s1' } as any;
  const op: Op = { type:'REMOVE_SLOT', slotSnapshot: slot } as any;
  const inv = inverseOf(op)!;
  expect(inv.type).toBe('ADD_SLOT');
  const after = applyOp([{ id:'s1' } as any], op);
  expect(after.find(s => s.id==='s1')).toBeFalsy();
});
/* <!-- END RBP GENERATED: builds-undo-redo-v1 --> */
