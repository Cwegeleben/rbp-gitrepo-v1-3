// <!-- BEGIN RBP GENERATED: BuildsQoL -->
import React from 'react';

type Toast = { id: number; kind: 'success'|'error'|'info'; text: string; };

let listeners: ((toasts: Toast[])=>void)[] = [];
let toasts: Toast[] = [];
let idSeq = 1;

export function useToasts() {
  const [list, setList] = React.useState<Toast[]>(toasts);
  React.useEffect(() => {
    const fn = (t: Toast[]) => setList([...t]);
    listeners.push(fn);
    return () => { listeners = listeners.filter(l => l!==fn); };
  }, []);
  return list;
}

function emit(){ listeners.forEach(l => l(toasts)); }

export function pushToast(kind: Toast['kind'], text: string) {
  const id = idSeq++;
  toasts.push({ id, kind, text });
  emit();
  setTimeout(() => { toasts = toasts.filter(t => t.id!==id); emit(); }, 3500);
}

export function ToastHost(){
  const list = useToasts();
  return (
    <div style={{position:'fixed',top:16,right:16,zIndex:9999}}>
      {list.map(t => (
        <div key={t.id} style={{marginBottom:8,padding:10,background:'#fff',border:'1px solid #ddd',boxShadow:'0 2px 6px rgba(0,0,0,0.1)'}}>
          <strong style={{marginRight:6}}>[{t.kind}]</strong>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
// <!-- END RBP GENERATED: BuildsQoL -->
