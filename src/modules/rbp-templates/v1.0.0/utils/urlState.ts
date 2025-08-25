// <!-- BEGIN RBP GENERATED: builds-templates-v1 -->
export function getUrlState(){
  try {
    const u = new URL(window.location.href);
    return {
      q: u.searchParams.get('q') || '',
      species: u.searchParams.get('species') || '',
      build: u.searchParams.get('build') || '',
      sort: (u.searchParams.get('sort') as any) || undefined,
      view: (u.searchParams.get('view') as any) || undefined,
    };
  } catch { return {}; }
}

export function setUrlState(s: { q?: string; species?: string; build?: string; sort?: string; view?: string }){
  try {
    const u = new URL(window.location.href);
    const set = (k:string,v:string|undefined)=>{ if (v && v !== '') u.searchParams.set(k,v); else u.searchParams.delete(k); };
    set('q', s.q as any); set('species', s.species as any); set('build', s.build as any); set('sort', s.sort as any); set('view', s.view as any);
    history.replaceState(null, '', u.toString());
  } catch {}
}
// <!-- END RBP GENERATED: builds-templates-v1 -->
