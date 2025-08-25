// <!-- BEGIN RBP GENERATED: builds-gallery-bulk-v1 -->
import React, { useEffect, useRef, useState } from 'react';
import SelectionCheckbox from './SelectionCheckbox.js';

type Build = { id: string; title?: string; items?: any[]; updatedAt?: string; handle?: string };

export default function BuildCard({ build, index, view, checked, onCheck, onOpen, onDuplicate, onDelete, onExport, onShare, onRename }:{
  build: Build; index: number; view: 'grid'|'list'; checked: boolean;
  onCheck: (e: React.ChangeEvent<HTMLInputElement>, withShift: boolean)=>void;
  onOpen:()=>void; onDuplicate:()=>void; onDelete:()=>void; onExport:()=>void; onShare:()=>void; onRename:(title: string)=>void;
}){
  const count = Array.isArray(build.items) ? build.items.reduce((n,it)=> n + Math.max(1, +it.quantity||1), 0) : 0;
  const updated = build.updatedAt ? new Date(build.updatedAt) : null;
  const updatedTxt = updated ? updated.toLocaleString() : '';

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(build.title || 'Untitled');
  const inputRef = useRef<HTMLInputElement|null>(null);
  useEffect(()=>{ if (editing) inputRef.current?.focus(); }, [editing]);

  function save(){ setEditing(false); if ((title||'').trim() !== (build.title||'')) onRename((title||'').trim()||'Untitled'); }
  function cancel(){ setEditing(false); setTitle(build.title||'Untitled'); }

  function titleNode(){
    if (editing) return (
      <div style={{display:'flex',gap:6,alignItems:'center'}}>
        <input ref={inputRef} aria-label="Edit title" value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>{ if (e.key==='Enter') save(); if (e.key==='Escape') cancel(); }} />
        <button onClick={save} aria-label="Save title">Save</button>
        <button onClick={cancel} aria-label="Cancel edit">Cancel</button>
      </div>
    );
    return (
      <div tabIndex={0} style={{fontWeight:600}} onDoubleClick={()=>setEditing(true)} onKeyDown={(e)=>{ if (e.key==='Enter') setEditing(true); }}>
        {build.title || 'Untitled'}
      </div>
    );
  }

  const info = (
    <div>
      {titleNode()}
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

  const checkbox = (
    <SelectionCheckbox ariaLabel={checked ? 'Unselect build' : 'Select build'} checked={checked} onChange={(e:any)=> onCheck(e, (window as any).__rbp_shiftDown===true)} />
  );

  useEffect(()=>{
    function onKey(e: KeyboardEvent){ (window as any).__rbp_shiftDown = e.shiftKey; }
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    return ()=>{ window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey); };
  }, []);

  if (view === 'grid') return (
    <div role="listitem" tabIndex={0} style={{border:'1px solid #eee',borderRadius:8,padding:10,display:'grid',gap:8}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        {checkbox}
        {info}
      </div>
      {actions}
    </div>
  );
  return (
    <div role="listitem" tabIndex={0} style={{display:'flex',alignItems:'center',justifyContent:'space-between',border:'1px solid #eee',borderRadius:8,padding:10,gap:8}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        {checkbox}
        {info}
      </div>
      {actions}
    </div>
  );
}
// <!-- END RBP GENERATED: builds-gallery-bulk-v1 -->
