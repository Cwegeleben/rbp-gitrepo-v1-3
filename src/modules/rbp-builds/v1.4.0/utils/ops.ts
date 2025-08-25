/* <!-- BEGIN RBP GENERATED: builds-undo-redo-v1 --> */
export type Slot = { id?: string; slotId?: string; label?: string; part?: any };
export type BuildSnapshot = { id?: string; items: Slot[] };

export type Op =
  | { type:'ASSIGN_PART'; slotId: string; prev?: any; next?: any; label?: string }
  | { type:'REMOVE_PART'; slotId: string; prev?: any; label?: string }
  | { type:'RENAME_SLOT'; slotId: string; prevName: string; nextName: string }
  | { type:'REORDER_SLOT'; slotId: string; from: number; to: number }
  | { type:'ADD_SLOT'; slotSnapshot: Slot }
  | { type:'REMOVE_SLOT'; slotSnapshot: Slot }
  | { type:'CLEAR_BUILD'; prevSnapshot: BuildSnapshot }
  | { type:'RESTORE_BUILD'; prevSnapshot: BuildSnapshot }
  | { type:'REPLACE_BUILD'; prevSnapshot: BuildSnapshot; nextSnapshot: BuildSnapshot; boundary?: true };

export function applyOp(items: Slot[], op: Op): Slot[]{
  const arr = (items||[]).slice();
  switch(op.type){
    case 'ASSIGN_PART': {
      const i = arr.findIndex(x => (x.id||x.slotId) === op.slotId);
      if (i>=0) arr[i] = { ...arr[i], part: op.next };
      return arr;
    }
    case 'RENAME_SLOT': {
      const i = arr.findIndex(x => (x.id||x.slotId) === op.slotId);
      if (i>=0) arr[i] = { ...arr[i], label: op.nextName };
      return arr;
    }
    case 'REORDER_SLOT': {
      const i = arr.findIndex(x => (x.id||x.slotId) === op.slotId);
      const j = op.to;
      if (i>=0 && j>=0 && j<arr.length){ const [it] = arr.splice(i,1); arr.splice(j,0,it); }
      return arr;
    }
    case 'ADD_SLOT': return [...arr, op.slotSnapshot];
    case 'REMOVE_SLOT': return arr.filter(x => (x.id||x.slotId) !== (op.slotSnapshot?.id||op.slotSnapshot?.slotId));
    case 'CLEAR_BUILD': return [];
    case 'RESTORE_BUILD': return (op.prevSnapshot?.items||[]).slice();
    case 'REPLACE_BUILD': return (op.nextSnapshot?.items||[]).slice();
    default: return arr;
  }
}

export function inverseOf(op: Op): Op | null {
  switch(op.type){
    case 'ASSIGN_PART': return { type:'ASSIGN_PART', slotId: op.slotId, prev: op.next, next: op.prev, label: op.label };
    case 'REMOVE_PART': return { type:'ASSIGN_PART', slotId: op.slotId, prev: null, next: op.prev, label: op.label };
    case 'RENAME_SLOT': return { type:'RENAME_SLOT', slotId: op.slotId, prevName: op.nextName, nextName: op.prevName };
    case 'REORDER_SLOT': return { type:'REORDER_SLOT', slotId: op.slotId, from: op.to, to: op.from };
    case 'ADD_SLOT': return { type:'REMOVE_SLOT', slotSnapshot: op.slotSnapshot };
    case 'REMOVE_SLOT': return { type:'ADD_SLOT', slotSnapshot: op.slotSnapshot };
    case 'CLEAR_BUILD': return { type:'RESTORE_BUILD', prevSnapshot: op.prevSnapshot };
    case 'RESTORE_BUILD': return { type:'CLEAR_BUILD', prevSnapshot: op.prevSnapshot };
    case 'REPLACE_BUILD': return { type:'REPLACE_BUILD', prevSnapshot: op.nextSnapshot, nextSnapshot: op.prevSnapshot, boundary: true };
    default: return null;
  }
}

export function squash(prev: Op | undefined, next: Op): Op | undefined{
  if (!prev) return undefined;
  if (prev.type==='RENAME_SLOT' && next.type==='RENAME_SLOT' && prev.slotId===next.slotId){
    return { ...prev, nextName: next.nextName };
  }
  return undefined; // no squash
}

export function createHistoryStack(max = 30){
  const state = { past: [] as Op[], future: [] as Op[], lastTs: 0 };
  function canUndo(){ return state.past.length>0; }
  function canRedo(){ return state.future.length>0; }
  function push(op: Op){
    // naive squash for rename chains
    const last = state.past[state.past.length-1];
    const s = squash(last, op);
    if (s){ state.past[state.past.length-1] = s; state.future = []; return; }
    state.past.push(op); if (state.past.length>max) state.past.shift(); state.future = []; state.lastTs = Date.now();
  }
  function undo(): Op | null { if (!canUndo()) return null; const op = state.past.pop()!; state.future.push(op); return inverseOf(op); }
  function redo(): Op | null { if (!canRedo()) return null; const op = state.future.pop()!; state.past.push(op); return op; }
  function reset(){ state.past = []; state.future = []; state.lastTs = 0; }
  return { push, undo, redo, canUndo, canRedo, reset, _state: state };
}
/* <!-- END RBP GENERATED: builds-undo-redo-v1 --> */
