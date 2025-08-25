/* <!-- BEGIN RBP GENERATED: builds-undo-redo-v1 --> */
import { useMemo, useRef, useState } from 'react';
import type { Op } from '../utils/ops';
import { inverseOf, squash } from '../utils/ops';

export function useHistoryStack(buildId?: string, max = 30){
  const key = buildId || '@none';
  const pastRef = useRef<Op[]>([]);
  const futureRef = useRef<Op[]>([]);
  const lastRef = useRef<{ t: number; op?: Op }>({ t: 0 });
  const [, setTick] = useState(0);

  function sync(){ setTick(x => x+1); }

  function reset(){ pastRef.current = []; futureRef.current = []; lastRef.current = { t: 0, op: undefined }; sync(); }
  function canUndo(){ return pastRef.current.length>0; }
  function canRedo(){ return futureRef.current.length>0; }
  function push(op: Op){
    const now = Date.now();
    const last = pastRef.current[pastRef.current.length-1];
    const squashed = squash(last, op);
    if (squashed){ pastRef.current[pastRef.current.length-1] = squashed; lastRef.current = { t: now, op: squashed }; futureRef.current = []; sync(); return; }
    pastRef.current.push(op); if (pastRef.current.length>max) pastRef.current.shift(); lastRef.current = { t: now, op }; futureRef.current = []; sync();
  }
  function undo(): Op | null { if (!canUndo()) return null; const op = pastRef.current.pop()!; futureRef.current.push(op); const inv = inverseOf(op); sync(); return inv; }
  function redo(): Op | null { if (!canRedo()) return null; const op = futureRef.current.pop()!; pastRef.current.push(op); sync(); return op; }

  return useMemo(() => ({ key, push, undo, redo, reset, canUndo, canRedo }), [key]);
}
/* <!-- END RBP GENERATED: builds-undo-redo-v1 --> */
