// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
import React from 'react';

type Action = { id:string; title:string; subtitle?:string; tags?:string[]; group?:string; shortcut?:string };

export default function ResultsList({ items, active, onHover, onClick }:{ items:Action[]; active:number; onHover:(i:number)=>void; onClick:(id:string)=>void; }){
  return (
    <ul role="listbox" aria-label="Command results" style={{ listStyle:'none', margin:0, padding:0, maxHeight:320, overflow:'auto' }}>
      {items.length===0 && <li style={{ padding:'14px 12px', opacity:.7 }}>No results</li>}
      {items.map((a,i)=> (
        <li key={a.id} role="option" aria-selected={i===active} style={{ padding:'10px 12px', cursor:'pointer', background:i===active?'#f3f4f6':undefined }} onMouseEnter={()=>onHover(i)} onClick={()=>onClick(a.id)}>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <strong>{a.title}</strong>
            {a.shortcut && <kbd style={{ background:'#111', color:'#fff', borderRadius:6, padding:'2px 6px', fontSize:11 }}>{a.shortcut}</kbd>}
          </div>
          {(a.subtitle||a.group||a.tags?.length) && (
            <div style={{fontSize:12, opacity:.8}}>
              {a.subtitle}
              {a.group && <span> · {a.group}</span>}
              {a.tags?.length ? <span> · {a.tags.join(', ')}</span> : null}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
