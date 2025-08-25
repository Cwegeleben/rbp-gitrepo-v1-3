// <!-- BEGIN RBP GENERATED: builds-gallery-bulk-v1 -->
import React, { useEffect, useRef } from 'react';

export default function BulkConfirmDialog({ open, kind, count, onConfirm, onCancel }:{ open: boolean; kind: 'delete'; count: number; onConfirm:()=>void; onCancel:()=>void }){
  const ref = useRef<HTMLDivElement|null>(null);
  useEffect(()=>{
    if (open) ref.current?.querySelector('button')?.focus();
    function onKey(e: KeyboardEvent){ if (!open) return; if (e.key === 'Escape') onCancel(); if (e.key === 'Enter') onConfirm(); }
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [open]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="bulk-confirm-title" style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.3)',display:'grid',placeItems:'center',zIndex:9999}}>
      <div ref={ref} style={{background:'#fff',padding:16,borderRadius:8,minWidth:320}}>
        <div id="bulk-confirm-title" style={{fontWeight:600,marginBottom:6}}>Delete {count} builds?</div>
        <div style={{marginBottom:12}}>This action can’t be undone.</div>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} autoFocus>Confirm</button>
        </div>
      </div>
    </div>
  );
}
// <!-- END RBP GENERATED: builds-gallery-bulk-v1 -->
