// <!-- BEGIN RBP GENERATED: cart-drawer-v1 -->
import React from 'react';

type Props = {
  canGoToCart: boolean;
  cartPath: string;
  onGoToCart: () => void;
  onCopy: () => void;
  onContinue: () => void;
  onRetry: () => void;
  showRetry: boolean;
};

const btn: React.CSSProperties = { padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc', background: '#fff' };

const Actions: React.FC<Props> = ({ canGoToCart, cartPath, onGoToCart, onCopy, onContinue, onRetry, showRetry }) => {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <button role="button" aria-label="Go to Cart" disabled={!canGoToCart} onClick={onGoToCart} style={{ ...btn, opacity: canGoToCart ? 1 : 0.5 }}>Go to Cart</button>
      <button aria-label="Copy JSON" onClick={onCopy} style={btn}>Copy JSON</button>
      {showRetry ? (
        <button aria-label="Retry" onClick={onRetry} style={btn}>Retry</button>
      ) : (
        <button aria-label="Continue Building" onClick={onContinue} style={btn}>Continue Building</button>
      )}
    </div>
  );
};

export default Actions;
// <!-- END RBP GENERATED: cart-drawer-v1 -->
