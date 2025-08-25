/* <!-- BEGIN RBP GENERATED: builds-undo-redo-v1 --> */
import React from 'react';

type Props = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
};

export default function HistoryBar({ canUndo, canRedo, onUndo, onRedo }: Props){
  return (
    <div style={{ display:'flex', gap:8 }}>
      <button aria-label="Undo" title="Undo (Ctrl/Cmd+Z)" disabled={!canUndo} onClick={onUndo}>Undo</button>
      <button aria-label="Redo" title="Redo (Ctrl/Cmd+Shift+Z, Ctrl/Cmd+Y)" disabled={!canRedo} onClick={onRedo}>Redo</button>
    </div>
  );
}
/* <!-- END RBP GENERATED: builds-undo-redo-v1 --> */
