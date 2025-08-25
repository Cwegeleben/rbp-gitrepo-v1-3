// <!-- BEGIN RBP GENERATED: builds-readiness-v1 -->
export function startFixSelection(type: string, slotId: string){
  window.dispatchEvent(new CustomEvent('rbp:start-part-selection', { detail: { type, slotId } }));
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('type', type);
    url.searchParams.set('slot', String(slotId));
    history.replaceState({}, '', url.toString());
  } catch {}
}
// <!-- END RBP GENERATED: builds-readiness-v1 -->
