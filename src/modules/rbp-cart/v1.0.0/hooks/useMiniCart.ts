// <!-- BEGIN RBP GENERATED: cart-drawer-v1 -->
// Minimal state machine helpers for mini cart (not strictly required in index mount, but exported for tests/future reuse)
export type MiniState = { status: 'idle' | 'pending' | 'ready' | 'error'; open: boolean; error?: string | null };
export type MiniEvent = { type: 'START' } | { type: 'SUCCESS' } | { type: 'FAIL'; error?: string } | { type: 'CLOSE' } | { type: 'OPEN' };

export function transition(s: MiniState, ev: MiniEvent): MiniState {
  switch (ev.type) {
    case 'START': return { ...s, status: 'pending', open: true, error: null };
    case 'SUCCESS': return { ...s, status: 'ready', open: true, error: null };
    case 'FAIL': return { ...s, status: 'error', open: true, error: ev.error || 'Error' };
    case 'OPEN': return { ...s, open: true };
    case 'CLOSE': return { ...s, open: false, status: 'idle' };
    default: return s;
  }
}
// <!-- END RBP GENERATED: cart-drawer-v1 -->
