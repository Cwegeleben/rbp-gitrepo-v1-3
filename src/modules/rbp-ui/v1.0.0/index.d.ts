// <!-- BEGIN RBP GENERATED: ui-toast-announcer-v1 -->
export type ToastDetail = { type: 'success'|'error'|'info'|'warning'; message: string; timeoutMs?: number; id?: string };
export type AnnounceDetail = { message: string; politeness?: 'polite'|'assertive' };

export declare function emitToast(detail: ToastDetail): void;
export declare function emitAnnounce(detail: AnnounceDetail): void;

export default function mount(): { unmount(): void };
// <!-- END RBP GENERATED: ui-toast-announcer-v1 -->
