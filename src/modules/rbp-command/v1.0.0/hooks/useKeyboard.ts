// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
import { useEffect } from 'react';

function isTyping(el:Element|null){
  if(!el) return false; const tag=(el as any).tagName?.toLowerCase?.(); return tag==='input'||tag==='textarea'||(el as any).isContentEditable;
}

export function useKeyboard({ onOpen, onClose, isOpen }:{ onOpen:()=>void; onClose:()=>void; isOpen:()=>boolean; }){
  useEffect(()=>{
    function onKey(e:KeyboardEvent){
      if (isTyping(document.activeElement)) return;
      const metaK = (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && (e.key?.toLowerCase?.()==='k');
      if (metaK){ e.preventDefault(); e.stopPropagation(); onOpen(); return; }
      if (isOpen() && e.key==='Escape'){ e.preventDefault(); e.stopPropagation(); onClose(); return; }
    }
    window.addEventListener('keydown', onKey, { capture:true });
    return ()=>window.removeEventListener('keydown', onKey, { capture:true } as any);
  }, [onOpen, onClose, isOpen]);
}
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
