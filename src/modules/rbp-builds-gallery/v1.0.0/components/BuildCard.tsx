// <!-- BEGIN RBP GENERATED: builds-gallery-v1 -->
import React from 'react';

type Build = { id: string; title?: string; items?: any[]; updatedAt?: string; handle?: string };

export default function BuildCard({ build, view, onOpen, onDuplicate, onDelete, onExport, onShare }:{ build: Build; view: 'grid'|'list'; onOpen:()=>void; onDuplicate:()=>void; onDelete:()=>void; onExport:()=>void; onShare:()=>void }){
  const count = Array.isArray(build.items) ? build.items.reduce((n,it)=> n + Math.max(1, +it.quantity||1), 0) : 0;
  const updated = build.updatedAt ? new Date(build.updatedAt) : null;
  const updatedTxt = updated ? updated.toLocaleString() : '';
  const common = (
    <div>
      <div style={{fontWeight:600}}>{build.title || 'Untitled'}</div>
      <div style={{fontSize:12,opacity:0.8}}>{count} items{updatedTxt ? ` • ${updatedTxt}` : ''}</div>
    </div>
  );
  const actions = (
    <div style={{display:'flex',gap:6}}>
      <button onClick={onOpen} aria-label="Open build">Open</button>
      <button onClick={onDuplicate} aria-label="Duplicate build">Duplicate</button>
      <button onClick={onDelete} aria-label="Delete build" style={{color:'#b00'}}>Delete</button>
      <button onClick={onExport} aria-label="Export JSON">Export</button>
      <button onClick={onShare} aria-label="Share build">Share</button>
    </div>
  );
  if (view === 'grid') return (
    <div role="listitem" tabIndex={0} style={{border:'1px solid #eee',borderRadius:8,padding:10,display:'grid',gap:8}}>
      {common}
      {actions}
    </div>
  );
  return (
    <div role="listitem" tabIndex={0} style={{display:'flex',alignItems:'center',justifyContent:'space-between',border:'1px solid #eee',borderRadius:8,padding:10}}>
      {common}
      {actions}
    </div>
  );
}
// <!-- END RBP GENERATED: builds-gallery-v1 -->
