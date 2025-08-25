// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
import React from 'react';

type Action = {
  id: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  group?: string;
  shortcut?: string;
  exec: { type: 'event'|'url', value: string, payload?: any };
};

export default function CommandPalette({ open, actions, onClose, onExec }:{ open:boolean; actions:Action[]; onClose:()=>void; onExec:(id:string)=>void; }){
  const [q, setQ] = React.useState('');
  const [idx, setIdx] = React.useState(0);
  const list = React.useMemo(()=>filter(actions, q), [actions, q]);
  React.useEffect(()=>{ if (!open) { setQ(''); setIdx(0); } }, [open]);
  React.useEffect(()=>{
    function onKey(e:KeyboardEvent){
      if (!open) return;
      if (e.key==='Escape'){ e.preventDefault(); onClose(); }
      else if (e.key==='ArrowDown'){ e.preventDefault(); setIdx(i=>Math.min(i+1, list.length-1)); }
      else if (e.key==='ArrowUp'){ e.preventDefault(); setIdx(i=>Math.max(i-1, 0)); }
      else if (e.key==='Enter'){ e.preventDefault(); const a=list[idx]; if(a){ onExec(a.id); onClose(); }}
    }
    window.addEventListener('keydown', onKey, { capture:true });
    return ()=>window.removeEventListener('keydown', onKey, { capture:true } as any);
  }, [open, list, idx, onClose, onExec]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="rbp-cmd-title" style={backdrop}>
      <div style={panel} onClick={e=>e.stopPropagation()}>
        <h2 id="rbp-cmd-title" style={{fontSize:14, fontWeight:600, margin:0, padding:'8px 12px'}}>Command Palette</h2>
        <input
          autoFocus
          aria-label="Search commands"
          placeholder="Type a command..."
          value={q}
          onChange={e=>setQ(e.target.value)}
          style={input}
        />
        <ul role="listbox" aria-label="Command results" style={listStyle}>
          {list.length===0 && <li style={empty}>No results</li>}
          {list.map((a,i)=> (
            <li key={a.id} role="option" aria-selected={i===idx} style={{...item, ...(i===idx?selItem:{} )}} onMouseEnter={()=>setIdx(i)} onClick={()=>{ onExec(a.id); onClose(); }}>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <strong>{a.title}</strong>
                {a.shortcut && <kbd style={kbd}>{a.shortcut}</kbd>}
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
        <div style={footer}>Esc to close · Enter to run · ↑↓ to navigate</div>
      </div>
    </div>
  );
}

function filter(actions:Action[], q:string){
  if (!q) return actions.slice(0, 50);
  const t = q.trim().toLowerCase();
  return actions
    .map(a=>({ a, s: score(a, t) }))
    .filter(x=>x.s>0)
    .sort((x,y)=>y.s-x.s)
    .map(x=>x.a)
    .slice(0, 50);
}
function score(a:Action, t:string){
  let s = 0;
  const tx = (a.title||'')+ ' ' + (a.subtitle||'') + ' ' + (a.group||'') + ' ' + (a.tags||[]).join(' ');
  const l = tx.toLowerCase();
  if (l.includes(t)) s += 10;
  if ((a.title||'').toLowerCase().includes(t)) s += 10;
  if ((a.subtitle||'').toLowerCase().includes(t)) s += 5;
  if ((a.tags||[]).some(tag=>tag.toLowerCase().includes(t))) s += 3;
  return s;
}

const backdrop:React.CSSProperties = { position:'fixed', inset:0, background:'rgba(0,0,0,.35)', display:'grid', placeItems:'start center', paddingTop:'15vh', zIndex:2147483001 };
const panel:React.CSSProperties = { width:560, maxWidth:'95vw', background:'white', color:'#111', borderRadius:12, boxShadow:'0 10px 30px rgba(0,0,0,.25)', overflow:'hidden', pointerEvents:'auto', fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,sans-serif' };
const input:React.CSSProperties = { width:'100%', boxSizing:'border-box', padding:'10px 12px', border:'none', borderTop:'1px solid #eee', borderBottom:'1px solid #eee', outline:'none', fontSize:14 };
const listStyle:React.CSSProperties = { listStyle:'none', margin:0, padding:0, maxHeight:320, overflow:'auto' };
const item:React.CSSProperties = { padding:'10px 12px', cursor:'pointer' };
const selItem:React.CSSProperties = { background:'#f3f4f6' };
const footer:React.CSSProperties = { fontSize:12, opacity:.8, padding:'8px 12px', borderTop:'1px solid #eee' };
const kbd:React.CSSProperties = { background:'#111', color:'#fff', borderRadius:6, padding:'2px 6px', fontSize:11 };
const empty:React.CSSProperties = { padding:'14px 12px', opacity:.7 };
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
