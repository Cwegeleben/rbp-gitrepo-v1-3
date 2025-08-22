/*
<!-- BEGIN RBP GENERATED: tenant-admin-builds-qol -->
*/
import React, { useEffect, useRef } from 'react';

export const ConfirmDialog: React.FC<{
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef<HTMLButtonElement | null>(null);
  const lastRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Tab') {
        const first = firstRef.current;
        const last = lastRef.current;
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={rootRef} style={{ background: '#fff', borderRadius: 8, padding: 16, width: 360 }}>
        <h3 id="confirm-title" style={{ marginTop: 0 }}>{title}</h3>
        {message && <p>{message}</p>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button ref={firstRef} onClick={onCancel} aria-label={cancelLabel}>{cancelLabel}</button>
          <button ref={lastRef} onClick={onConfirm} aria-label={confirmLabel}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};
/*
<!-- END RBP GENERATED: tenant-admin-builds-qol -->
*/
