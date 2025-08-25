// <!-- BEGIN RBP GENERATED: builds-gallery-bulk-v1 -->
import React, { useEffect } from 'react';
import { useBuildsGallery } from '../hooks/useBuildsGallery.js';
import BuildCard from './BuildCard.js';
import BulkBar from './BulkBar.js';
import SelectionCheckbox from './SelectionCheckbox.js';
import BulkConfirmDialog from './BulkConfirmDialog.js';

export default function Gallery(){
  const g = useBuildsGallery();

  useEffect(()=>{
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

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <SelectionCheckbox
          ariaLabel={g.allSelected ? 'Unselect all builds' : 'Select all builds'}
          checked={g.allSelected}
          indeterminate={g.someSelected && !g.allSelected}
          onChange={g.toggleSelectAll}
        />
        <input aria-label="Search builds" placeholder="Search" value={g.state.q} onChange={(e)=>g.search(e.target.value)} />
        <select aria-label="Sort" value={g.state.sort} onChange={(e)=>g.sort(e.target.value)}>
          <option value="name:asc">Name ↑</option>
          <option value="name:desc">Name ↓</option>
          <option value="updated:desc">Updated ↓</option>
          <option value="updated:asc">Updated ↑</option>
          <option value="items:desc">Items ↓</option>
          <option value="items:asc">Items ↑</option>
        </select>
        <button onClick={g.toggleView} aria-label="Toggle view">{g.state.view === 'grid' ? 'Grid' : 'List'}</button>
      </div>

      {g.error && <div role="alert" style={{color:'#b00',marginTop:8}}>Failed to load builds.</div>}
      {!g.loading && items.length === 0 && (
        <div style={{padding:'24px 8px'}}>
          <div style={{fontWeight:600, marginBottom:6}}>No builds yet</div>
          <div style={{opacity:0.8, marginBottom:8}}>Create your first build to get started.</div>
          <button onClick={g.createNew} aria-label="Create new build">Create New</button>
        </div>
      )}

      {/* Bulk bar */}
      {g.selectedIds.size > 0 && (
        <BulkBar
          count={g.selectedIds.size}
          onClear={g.clearSelection}
          onDuplicate={g.bulkDuplicate}
          onDelete={g.bulkDeleteConfirm}
          onShare={g.bulkShare}
          onExport={g.bulkExport}
        />
      )}

      {g.state.view === 'grid' ? (
        <div role="list" aria-label="Builds" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(240px,1fr))',gap:12,marginTop:12}}>
          {items.map((b: any, index: number) => (
            <BuildCard
              key={b.id}
              build={b}
              index={index}
              view="grid"
              checked={g.selectedIds.has(b.id)}
              onCheck={(e, withShift)=> g.toggleSelect(b, index, withShift)}
              onOpen={()=>g.open(b)}
              onDuplicate={()=>g.duplicate(b)}
              onDelete={()=>g.confirmDelete(b)}
              onExport={()=>g.exportJson(b)}
              onShare={()=>g.share(b)}
              onRename={(title)=>g.renameInline(b, title)}
            />
          ))}
        </div>
      ) : (
        <div role="list" aria-label="Builds" style={{display:'grid',gap:6,marginTop:12}}>
          {items.map((b: any, index: number) => (
            <BuildCard
              key={b.id}
              build={b}
              index={index}
              view="list"
              checked={g.selectedIds.has(b.id)}
              onCheck={(e, withShift)=> g.toggleSelect(b, index, withShift)}
              onOpen={()=>g.open(b)}
              onDuplicate={()=>g.duplicate(b)}
              onDelete={()=>g.confirmDelete(b)}
              onExport={()=>g.exportJson(b)}
              onShare={()=>g.share(b)}
              onRename={(title)=>g.renameInline(b, title)}
            />
          ))}
        </div>
      )}

      <BulkConfirmDialog
        open={!!g.bulkConfirm}
        kind={g.bulkConfirm?.kind||'delete'}
        count={g.selectedIds.size}
        onCancel={g.bulkCancel}
        onConfirm={g.bulkDoDelete}
      />
    </div>
  );
}
// <!-- END RBP GENERATED: builds-gallery-bulk-v1 -->
