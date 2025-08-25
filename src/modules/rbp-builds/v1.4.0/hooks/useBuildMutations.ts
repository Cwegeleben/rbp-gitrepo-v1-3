/* <!-- BEGIN RBP GENERATED: builds-undo-redo-v1 --> */
import { useCallback } from 'react';
import type { Op, Slot } from '../utils/ops';

export function useBuildMutations(buildId?: string){
  const id = buildId;
  const api = {
    async patchItems(items: Slot[]){
      if (!id) return;
      const r = await fetch(`/apps/proxy/api/builds/${id}`, { method: 'PATCH', headers: { 'content-type':'application/json' }, body: JSON.stringify({ items }) });
      if (!r.ok) throw new Error(`PATCH ${id} failed`);
    }
  };

  const rename = useCallback((slotId: string, prevName: string, nextName: string): Op => ({ type:'RENAME_SLOT', slotId, prevName, nextName }), []);
  const reorder = useCallback((slotId: string, from: number, to: number): Op => ({ type:'REORDER_SLOT', slotId, from, to }), []);
  const addSlot = useCallback((slot: Slot): Op => ({ type:'ADD_SLOT', slotSnapshot: slot }), []);
  const removeSlot = useCallback((slot: Slot): Op => ({ type:'REMOVE_SLOT', slotSnapshot: slot }), []);
  const clear = useCallback((prevItems: Slot[], idHint?: string): Op => ({ type:'CLEAR_BUILD', prevSnapshot: { id: idHint||id, items: prevItems } }), [id]);

  return { api, rename, reorder, addSlot, removeSlot, clear };
}
/* <!-- END RBP GENERATED: builds-undo-redo-v1 --> */
