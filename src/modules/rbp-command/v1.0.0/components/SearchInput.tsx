// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
import React from 'react';
export default function SearchInput(props: React.InputHTMLAttributes<HTMLInputElement> & { hint?: string }){
  return (
    <div style={{ position:'relative' }}>
      <input {...props} aria-label={props['aria-label']||'Search commands'} style={{ width:'100%', boxSizing:'border-box', padding:'10px 12px', border:'none', outline:'none', fontSize:14 }} />
      {props.hint && <span aria-hidden style={{ position:'absolute', right:12, top:10, opacity:.6, fontSize:12 }}>{props.hint}</span>}
    </div>
  );
}
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
