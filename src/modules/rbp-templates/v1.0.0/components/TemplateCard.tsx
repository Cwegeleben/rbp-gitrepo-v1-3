// <!-- BEGIN RBP GENERATED: builds-templates-v1 -->
import React from 'react';

export type Template = {
  id: string;
  title: string;
  tags?: string[];
  species?: string;
  build?: string;
  notes?: string;
  slots?: Array<{ type?: string; productId?: string; variantId?: string; qty?: number }>;
  image?: string;
};

export default function TemplateCard({ t, onPreview, onUse }:{ t: Template; onPreview:()=>void; onUse:()=>void }){
  const itemsCount = (t.slots||[]).length;
  return (
    <div role="group" aria-label={t.title} style={{border:'1px solid #e5e7eb',borderRadius:8,padding:10,display:'flex',flexDirection:'column',gap:8}}>
      {t.image ? <img src={t.image} alt="" style={{width:'100%',height:140,objectFit:'cover',borderRadius:6}}/> : <div style={{height:140,background:'#f5f5f5',borderRadius:6}} />}
      <div style={{fontWeight:600}}>{t.title}</div>
      <div style={{fontSize:12,opacity:0.8}}>{itemsCount} items</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
        {(t.tags||[]).slice(0,4).map(tag=> <span key={tag} style={{fontSize:11,background:'#f3f4f6',padding:'2px 6px',borderRadius:999}}>{tag}</span>)}
      </div>
      <div style={{marginTop:'auto',display:'flex',gap:8}}>
        <button onClick={onPreview} aria-label={`Preview ${t.title}`}>Preview</button>
        <button onClick={onUse}>Use this template</button>
      </div>
    </div>
  );
}
// <!-- END RBP GENERATED: builds-templates-v1 -->
