// <!-- BEGIN RBP GENERATED: builds-templates-v1 -->
import React, { useMemo, useState } from 'react';
import FilterBar from './FilterBar.js';
import TemplateCard from './TemplateCard.js';
import TemplatePreview from './TemplatePreview.js';
import { useTemplates } from '../hooks/useTemplates.js';
import type { TemplateEntry } from '../utils/manifest.js';

export default function TemplatesGrid(){
  const { state, setState, templates, filtered, error, loading, applyTemplate } = useTemplates();
  const [previewId, setPreviewId] = useState<string | null>(null);
  const active = useMemo(()=>filtered.find((t: TemplateEntry)=>t.id===previewId) || null,[filtered,previewId]);

  return (
    <div className="rbp-templates-v100" style={{fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,sans-serif'}}>
  <div role="status" aria-live="polite" data-rbp-templates-live style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }} />
      <FilterBar state={state} setState={setState} count={filtered.length} />
      {error && <div role="alert">Failed to load templates.</div>}
      {loading && <div role="status" aria-live="polite">Loading…</div>}
      {!loading && !error && filtered.length === 0 && (
        <div aria-live="polite">No templates match.</div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12,marginTop:12}}>
  {filtered.map((t: TemplateEntry) => (
          <TemplateCard key={t.id} t={t} onPreview={()=>setPreviewId(t.id)} onUse={async()=>{ await applyTemplate(t); }} />
        ))}
      </div>
      {active && (
        <TemplatePreview template={active} onClose={()=>setPreviewId(null)} onUse={async()=>{ await applyTemplate(active); setPreviewId(null); }} />
      )}
    </div>
  );
}
// <!-- END RBP GENERATED: builds-templates-v1 -->
