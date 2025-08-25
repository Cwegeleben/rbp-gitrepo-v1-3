// <!-- BEGIN RBP GENERATED: ui-toast-announcer-v1 -->
import React from 'react';

export default function Toast({ type='info', message='Message', onClose }: { type?: 'success'|'error'|'info'|'warning'; message?: string; onClose?: ()=>void }){
  const colors = {
    success: { border: '#bbf7d0', bg: '#f0fdf4', fg: '#14532d' },
    error: { border: '#fecaca', bg: '#fef2f2', fg: '#7f1d1d' },
    warning: { border: '#fde68a', bg: '#fffbeb', fg: '#78350f' },
    info: { border: '#dbeafe', bg: '#eff6ff', fg: '#1e3a8a' },
  }[type];
  return (
    <div role="group" aria-label={`${type} notification`} tabIndex={0} style={{ pointerEvents:'auto', display:'grid', gridTemplateColumns:'auto 1fr auto', gap:10, alignItems:'center', minWidth:260, maxWidth:360, padding:'10px 12px 14px', border:`1px solid ${colors.border}`, background: colors.bg, color: colors.fg, borderRadius:12, boxShadow:'0 6px 16px rgba(0,0,0,0.08)' }}>
      <div aria-hidden style={{ fontSize:18, lineHeight:'18px' }}>{ type==='success' ? '✓' : (type==='error'?'⚠':(type==='warning'?'⚠':'ℹ')) }</div>
      <div>{message}</div>
      <button aria-label="Close" onClick={onClose} style={{ border:'none', background:'transparent', color: colors.fg, fontSize:16, cursor:'pointer', padding:'2px 6px', borderRadius:6 }}>×</button>
      <div style={{ gridColumn:'1 / span 3', height:3, marginTop:8 }} />
    </div>
  );
}
// <!-- END RBP GENERATED: ui-toast-announcer-v1 -->
