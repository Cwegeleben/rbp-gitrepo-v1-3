// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
import { useEffect, useMemo, useState } from 'react';

export type Action = { id:string; title:string; subtitle?:string; tags?:string[]; group?:string; shortcut?:string; exec:{ type:'event'|'url', value:string, payload?:any } };

const globalStore: { actions: Map<string, Action> } = (typeof window!=='undefined' && (window as any).__RBP_CMD_STORE__) || { actions: new Map() };
if (typeof window!=='undefined') (window as any).__RBP_CMD_STORE__ = globalStore;

export function useCommandRegistry(){
  const [tick, setTick] = useState(0);
  useEffect(()=>{
    const onReg = (e:any)=>{ for (const a of (e?.detail?.actions||[])) if(a?.id&&a?.title) globalStore.actions.set(a.id, a); setTick(t=>t+1); };
    const onUnreg = (e:any)=>{ for (const id of (e?.detail?.ids||[])) globalStore.actions.delete(id); setTick(t=>t+1); };
    window.addEventListener('rbp:cmd:register', onReg as any);
    window.addEventListener('rbp:cmd:unregister', onUnreg as any);
    return ()=>{ window.removeEventListener('rbp:cmd:register', onReg as any); window.removeEventListener('rbp:cmd:unregister', onUnreg as any); };
  }, []);
  return useMemo(()=>({ actions: Array.from(globalStore.actions.values()) }), [tick]);
}

export function execAction(id:string){
  const a = globalStore.actions.get(id);
  if (!a) return false;
  if (a.exec?.type==='event') {
    window.dispatchEvent(new CustomEvent(a.exec.value, { detail: a.exec.payload }));
  } else if (a.exec?.type==='url') {
    const url = a.exec.value;
    const sameOrigin = /^\/?[\w#?=&.-]/.test(url) || url.startsWith(location.origin);
    if (sameOrigin) history.pushState({}, '', url); else window.location.assign(url);
  }
  window.dispatchEvent(new CustomEvent('rbp:cmd:exec', { detail: { id } }));
  return true;
}
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
