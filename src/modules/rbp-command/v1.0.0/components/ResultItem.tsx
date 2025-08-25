// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
import React from 'react';

export default function ResultItem({ title, subtitle, tags, group, shortcut, active, onClick }:{ title:string; subtitle?:string; tags?:string[]; group?:string; shortcut?:string; active?:boolean; onClick?:()=>void; }){
  return (
    <div role="option" aria-selected={!!active} style={{ padding:'10px 12px', cursor:'pointer', background:active?'#f3f4f6':undefined }} onClick={onClick}>
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <strong>{title}</strong>
        {shortcut && <kbd style={{ background:'#111', color:'#fff', borderRadius:6, padding:'2px 6px', fontSize:11 }}>{shortcut}</kbd>}
      </div>
      {(subtitle||group||tags?.length) && (
        <div style={{fontSize:12, opacity:.8}}>
          {subtitle}
          {group && <span> · {group}</span>}
          {tags?.length ? <span> · {tags.join(', ')}</span> : null}
        </div>
      )}
    </div>
  );
}
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
