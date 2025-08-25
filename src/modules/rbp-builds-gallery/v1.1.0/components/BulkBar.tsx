// <!-- BEGIN RBP GENERATED: builds-gallery-bulk-v1 -->
import React from 'react';

export default function BulkBar({ count, onClear, onDuplicate, onDelete, onShare, onExport }:{ count: number; onClear:()=>void; onDuplicate:()=>void; onDelete:()=>void; onShare:()=>void; onExport:()=>void }){
  return (
    <div style={{position:'sticky',top:0,background:'#fff',borderBottom:'1px solid #eee',padding:'8px 0',marginTop:8,display:'flex',alignItems:'center',gap:8}}>
      <div style={{fontWeight:600}}>{count} selected</div>
      <button onClick={onDuplicate} aria-label="Duplicate selected">Duplicate</button>
      <button onClick={onDelete} aria-label="Delete selected" style={{color:'#b00'}}>Delete</button>
      <button onClick={onShare} aria-label="Share selected">Share</button>
      <button onClick={onExport} aria-label="Export selected">Export JSON</button>
      <div style={{flex:1}} />
      <button onClick={onClear} aria-label="Clear selection">Clear</button>
    </div>
  );
}
// <!-- END RBP GENERATED: builds-gallery-bulk-v1 -->
