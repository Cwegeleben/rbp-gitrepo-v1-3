// <!-- BEGIN RBP GENERATED: builds-gallery-v1 -->
export function getUrlState(){
  try {
    const u = new URL(window.location.href);
    return {
      q: u.searchParams.get('q') || '',
      sort: u.searchParams.get('sort') || '',
      view: u.searchParams.get('view') || '',
      buildId: u.searchParams.get('buildId') || undefined,
    };
  } catch { return { q: '', sort: '', view: '' }; }
}

export function setUrlState({ q, sort, view, buildId }:{ q?:string; sort?:string; view?:string; buildId?: string }){
  try {
    const u = new URL(window.location.href);
    if (q != null) u.searchParams.set('q', q);
    if (sort != null) u.searchParams.set('sort', sort);
    if (view != null) u.searchParams.set('view', view);
    if (buildId != null) u.searchParams.set('buildId', buildId);
    history.replaceState({}, '', u.toString());
  } catch {}
}
// <!-- END RBP GENERATED: builds-gallery-v1 -->
