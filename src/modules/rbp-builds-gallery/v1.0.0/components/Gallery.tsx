// <!-- BEGIN RBP GENERATED: builds-gallery-v1 -->
import React, { useEffect } from 'react';
import { useBuildsGallery } from '../hooks/useBuildsGallery.js';
import FilterBar from './FilterBar.js';
import BuildCard from './BuildCard.js';
import ConfirmDialog from './ConfirmDialog.js';

export default function Gallery(){
  const g = useBuildsGallery();

  useEffect(()=>{
    // keep compatibility listeners to refresh when other modules update
    function onUpdated(e: any){ if (e?.detail?.id) g.refresh(); }
    window.addEventListener('rbp:build-updated', onUpdated);
    window.addEventListener('rbp:part-selected', onUpdated);
    return ()=>{
      window.removeEventListener('rbp:build-updated', onUpdated);
      window.removeEventListener('rbp:part-selected', onUpdated);
    };
  }, [g.refresh]);

  const items = g.filteredSorted();

  return (
    <div style={{fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,sans-serif'}}>
  <div aria-live="polite" style={{position:'absolute',width:1,height:1,overflow:'hidden',clipPath:'inset(50%)'}} />
      <FilterBar state={g.state} setState={g.setState} onSearch={g.search} onSort={g.sort} onViewToggle={g.toggleView} />
      {g.error && <div role="alert" style={{color:'#b00',marginTop:8}}>Failed to load builds.</div>}
      {!g.loading && items.length === 0 && (
        <div style={{padding:'24px 8px'}}>
          <div style={{fontWeight:600, marginBottom:6}}>No builds yet</div>
          <div style={{opacity:0.8, marginBottom:8}}>Create your first build to get started.</div>
          <button onClick={g.createNew} aria-label="Create new build">Create New</button>
        </div>
      )}
      {g.state.view === 'grid' ? (
        <div role="list" aria-label="Builds" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(240px,1fr))',gap:12,marginTop:12}}>
          {items.map((b: any) => (
            <BuildCard key={b.id} build={b} view="grid" onOpen={()=>g.open(b)} onDuplicate={()=>g.duplicate(b)} onDelete={()=>g.confirmDelete(b)} onExport={()=>g.exportJson(b)} onShare={()=>g.share(b)} />
          ))}
        </div>
      ) : (
        <div role="list" aria-label="Builds" style={{display:'grid',gap:6,marginTop:12}}>
          {items.map((b: any) => (
            <BuildCard key={b.id} build={b} view="list" onOpen={()=>g.open(b)} onDuplicate={()=>g.duplicate(b)} onDelete={()=>g.confirmDelete(b)} onExport={()=>g.exportJson(b)} onShare={()=>g.share(b)} />
          ))}
        </div>
      )}
      <ConfirmDialog
        open={!!g.confirm}
        title="Delete build?"
        message={g.confirm ? `This will delete “${g.confirm.title}”. You can’t undo this.` : ''}
        onCancel={g.cancelConfirm}
        onConfirm={g.doDelete}
      />
    </div>
  );
}
// <!-- END RBP GENERATED: builds-gallery-v1 -->
