// <!-- BEGIN RBP GENERATED: cart-drawer-v1 -->
import React, { useEffect, useRef } from 'react';
import ItemsList from './ItemsList';
import Totals from './Totals';
import Hints from './Hints';
import Actions from './Actions';

export type MiniData = { items: Array<{ title: string; qty: number; vendor?: string }>; totals?: any; hints: any[]; cartPath: string | null };

type Props = {
  open: boolean;
  status: 'idle' | 'pending' | 'ready' | 'error';
  data: MiniData | null;
  raw: any;
  error: string | null;
  onClose: () => void;
  onCopy: () => void;
  onGoToCart: (path: string) => void;
  onRetry: () => void;
};

const CartDrawer: React.FC<Props> = ({ open, status, data, raw, error, onClose, onCopy, onGoToCart, onRetry }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastOpener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent){ if (e.key === 'Escape' && open) { e.preventDefault(); onClose(); } }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      // move focus into panel and remember opener
      const active = (document.activeElement as HTMLElement) || null; if (active && active !== document.body) lastOpener.current = active;
      const first = panelRef.current?.querySelector<HTMLElement>('[tabindex],a,button,input,select,textarea');
      first?.focus();
    } else if (lastOpener.current) {
      lastOpener.current.focus?.(); lastOpener.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function trap(e: KeyboardEvent){
      if (e.key !== 'Tab') return;
      const focusables = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])') || []).filter(el => !el.hasAttribute('disabled'));
      if (focusables.length === 0) return;
      const first = focusables[0]; const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    panelRef.current?.addEventListener('keydown', trap as any);
    return () => panelRef.current?.removeEventListener('keydown', trap as any);
  }, [open]);

  const ready = status === 'ready';
  const pending = status === 'pending';
  const hasCart = !!data?.cartPath;

  return (
    <div aria-hidden={!open} style={{ position: 'fixed', inset: 0, display: open ? 'block' : 'none', zIndex: 10000 }}>
      <div onClick={onClose} aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Mini cart" style={{ position: 'absolute', top: 0, right: 0, width: '360px', height: '100%', background: '#fff', boxShadow: '-4px 0 16px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '12px 14px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 600 }}>Mini Cart</div>
          <button onClick={onClose} aria-label="Close mini cart" style={{ border: '1px solid #ddd', background: '#fff', borderRadius: 6, padding: '4px 8px' }}>Esc</button>
        </header>
        <div style={{ padding: '12px 14px', overflow: 'auto', flex: 1 }}>
          {pending && <div role="status" aria-live="polite">Packaging…</div>}
          {status === 'error' && <div role="alert" aria-live="polite" style={{ color: '#b91c1c' }}>Error packaging. Please try again.</div>}
          {ready && (
            <>
              <ItemsList items={data?.items || []} />
              <Totals totals={data?.totals} />
              <Hints hints={data?.hints || []} />
            </>
          )}
        </div>
        <footer style={{ padding: '12px 14px', borderTop: '1px solid #eee' }}>
          <Actions
            canGoToCart={!!hasCart}
            cartPath={data?.cartPath || ''}
            onGoToCart={() => hasCart && data?.cartPath && onGoToCart(data.cartPath)}
            onCopy={onCopy}
            onContinue={onClose}
            onRetry={onRetry}
            showRetry={status === 'error' || (ready && !hasCart)}
          />
        </footer>
      </div>
    </div>
  );
};

export default CartDrawer;
// <!-- END RBP GENERATED: cart-drawer-v1 -->
