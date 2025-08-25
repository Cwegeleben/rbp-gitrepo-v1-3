// <!-- BEGIN RBP GENERATED: builds-gallery-v1 -->
import React from 'react';

type State = { q: string; sort: string; view: 'grid'|'list' };

export default function FilterBar({ state, setState, onSearch, onSort, onViewToggle }:{ state: State; setState: (p:Partial<State>)=>void; onSearch:(q:string)=>void; onSort:(s:string)=>void; onViewToggle:()=>void }){
  return (
    <div style={{display:'flex',gap:8,alignItems:'center'}}>
      <input aria-label="Search builds" placeholder="Search" value={state.q} onChange={(e)=>onSearch(e.target.value)} />
      <select aria-label="Sort" value={state.sort} onChange={(e)=>onSort(e.target.value)}>
        <option value="name:asc">Name ↑</option>
        <option value="name:desc">Name ↓</option>
        <option value="updated:desc">Updated ↓</option>
        <option value="updated:asc">Updated ↑</option>
        <option value="items:desc">Items ↓</option>
        <option value="items:asc">Items ↑</option>
      </select>
      <button onClick={onViewToggle} aria-label="Toggle view">{state.view === 'grid' ? 'Grid' : 'List'}</button>
    </div>
  );
}
// <!-- END RBP GENERATED: builds-gallery-v1 -->
