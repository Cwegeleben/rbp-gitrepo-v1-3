// <!-- BEGIN RBP GENERATED: cart-drawer-v1 -->
export type PackagerResult = { status: 'success' | 'error'; buildId?: string; cartPath?: string | null; meta?: any; hints?: any[]; response?: any };

export function on(event: string, handler: (e: CustomEvent) => void) {
  window.addEventListener(event, handler as EventListener);
  return () => window.removeEventListener(event, handler as EventListener);
}

export function emitCartOpen(payload?: { response?: any }){ window.dispatchEvent(new CustomEvent('rbp:cart:open', { detail: payload })); }
export function emitCartClose(){ window.dispatchEvent(new CustomEvent('rbp:cart:close')); }
// <!-- END RBP GENERATED: cart-drawer-v1 -->
