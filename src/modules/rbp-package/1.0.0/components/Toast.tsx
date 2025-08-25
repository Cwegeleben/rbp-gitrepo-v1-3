// <!-- BEGIN RBP GENERATED: package-cta-v1 -->
import React, { useEffect, useState } from 'react';

export function ToastHost(){
  return <div id="rbp-toast-host" style={{ position:'fixed', top:16, right:16, zIndex:9999 }} />;
}

export function useToast(){
  const [live, setLive] = useState<HTMLElement | null>(null);
  useEffect(() => {
    let el = document.getElementById('rbp-aria-live');
    if (!el) {
      el = document.createElement('div');
      el.id = 'rbp-aria-live'; el.setAttribute('aria-live','polite'); el.setAttribute('aria-atomic','true');
      Object.assign(el.style, { position:'absolute', width:'1px', height:'1px', overflow:'hidden', clipPath:'inset(50%)' });
      document.body.appendChild(el);
    }
    setLive(el);
  }, []);
  function show(kind: 'success'|'error'|'info', text: string){
    const host = document.getElementById('rbp-toast-host'); if (!host) return;
    const card = document.createElement('div');
    Object.assign(card.style, { marginBottom:'8px', padding:'10px 12px', background:'#fff', border:'1px solid #ddd', boxShadow:'0 2px 6px rgba(0,0,0,0.1)' });
    card.textContent = `[${kind}] ${text}`; host.appendChild(card);
    if (live) live.textContent = text;
    setTimeout(()=>{ if (card.parentElement===host) host.removeChild(card); }, 3000);
  }
  return show;
}
// <!-- END RBP GENERATED: package-cta-v1 -->
