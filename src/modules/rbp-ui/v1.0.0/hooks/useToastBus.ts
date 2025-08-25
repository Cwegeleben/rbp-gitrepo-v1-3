// <!-- BEGIN RBP GENERATED: ui-toast-announcer-v1 -->
export type ToastDetail = { type: 'success'|'error'|'info'|'warning'; message: string; timeoutMs?: number; id?: string };
export type AnnounceDetail = { message: string; politeness?: 'polite'|'assertive' };

export function emitToast(detail: ToastDetail){
  window.dispatchEvent(new CustomEvent('rbp:toast', { detail }));
}
export function emitAnnounce(detail: AnnounceDetail){
  window.dispatchEvent(new CustomEvent('rbp:announce', { detail }));
}

export function useToastBus(){
  // React-less placeholder for future hooks; in v1, modules call emitToast/emitAnnounce directly.
  return { emitToast, emitAnnounce };
}
// <!-- END RBP GENERATED: ui-toast-announcer-v1 -->
