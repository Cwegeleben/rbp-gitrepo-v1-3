// <!-- BEGIN RBP GENERATED: builds-templates-v1 -->
import React, { useEffect, useRef } from 'react';
import type { TemplateEntry as Template } from '../utils/manifest.js';

export default function TemplatePreview({ template, onClose, onUse }:{ template: Template; onClose:()=>void; onUse:()=>void }){
  const dialogRef = useRef<HTMLDivElement|null>(null);
  useEffect(()=>{
    const prev = document.activeElement as HTMLElement | null;
    const el = dialogRef.current; el?.focus();
    function onKey(e: KeyboardEvent){ if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return ()=>{ window.removeEventListener('keydown', onKey); prev?.focus?.(); };
  },[onClose]);
  const groups = (template.slots||[]).reduce((acc:Record<string, any[]>, s)=>{ const k = s.type || 'Unknown'; (acc[k]=acc[k]||[]).push(s); return acc; },{});
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="tpl-prev-title" style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'grid',placeItems:'center'}}>
      <div ref={dialogRef} tabIndex={-1} style={{background:'white',borderRadius:8,padding:16,width:'min(720px,90vw)',maxHeight:'80vh',overflow:'auto'}}>
        <div id="tpl-prev-title" style={{fontWeight:700,marginBottom:8}}>{template.title}</div>
        <div style={{display:'grid',gap:6,marginBottom:12}}>
          {Object.entries(groups).map(([type, arr])=> (
            <div key={type}>
              <div style={{fontWeight:600,marginBottom:4}}>{type}</div>
              <ul style={{margin:0,paddingLeft:18}}>
                {arr.map((s,i)=> <li key={i} style={{opacity:0.9}}>{s.productId} {s.variantId ? `(${s.variantId})` : ''} {s.qty?`×${s.qty}`:''}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <button onClick={onClose}>Close</button>
          <button onClick={onUse}>Use this template</button>
        </div>
      </div>
    </div>
  );
}
// <!-- END RBP GENERATED: builds-templates-v1 -->
