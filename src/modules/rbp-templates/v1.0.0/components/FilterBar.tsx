// <!-- BEGIN RBP GENERATED: builds-templates-v1 -->
import React from 'react';

export type FilterState = { q: string; species: string; build: string; sort: 'title'|'recency'; view: 'grid'|'list' };

export default function FilterBar({ state, setState, count }:{ state: FilterState; setState: (p:Partial<FilterState>)=>void; count: number }){
  return (
    <div style={{display:'flex',gap:8,alignItems:'center'}}>
      <input aria-label="Search templates" placeholder="Search" value={state.q} onChange={(e)=>setState({ q: e.target.value })} />
      <select aria-label="Species" value={state.species} onChange={(e)=>setState({ species: e.target.value })}>
        <option value="">All species</option>
        <option value="Salmon & Steelhead">Salmon & Steelhead</option>
        <option value="Bass">Bass</option>
      </select>
      <select aria-label="Build" value={state.build} onChange={(e)=>setState({ build: e.target.value })}>
        <option value="">All builds</option>
        <option value="Mooching">Mooching</option>
        <option value="Drift">Drift</option>
      </select>
      <select aria-label="Sort" value={state.sort} onChange={(e)=>setState({ sort: e.target.value as any })}>
        <option value="title">Title</option>
        <option value="recency">Recency</option>
      </select>
      <button onClick={()=>setState({ view: state.view === 'grid' ? 'list' : 'grid' })} aria-label="Toggle view">{state.view === 'grid' ? 'Grid' : 'List'}</button>
      <div aria-live="polite" style={{marginLeft:'auto',opacity:0.7}}>{count} results</div>
    </div>
  );
}
// <!-- END RBP GENERATED: builds-templates-v1 -->
