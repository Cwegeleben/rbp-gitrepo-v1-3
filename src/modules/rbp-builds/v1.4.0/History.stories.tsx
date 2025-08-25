/* <!-- BEGIN RBP GENERATED: builds-undo-redo-v1 --> */
import React, { useState } from 'react';
import HistoryBar from './components/HistoryBar';

export default { title: 'Builds/History', component: HistoryBar };

export const AfterEdits = () => {
  const [u, setU] = useState(2); const [r, setR] = useState(0);
  return <HistoryBar canUndo={u>0} canRedo={r>0} onUndo={()=>setU(u-1)} onRedo={()=>setR(r-1)} />;
};

export const UndoChain = () => <HistoryBar canUndo={true} canRedo={false} onUndo={()=>{}} onRedo={()=>{}} />;
export const RedoChain = () => <HistoryBar canUndo={true} canRedo={true} onUndo={()=>{}} onRedo={()=>{}} />;
export const ErrorRollback = () => <div>Use the panel to trigger an operation; mock network failure on Nth op and verify toast "rolled back".</div>;
export const KeyboardOnly = () => <div>Use Cmd/Ctrl+Z and Shift+Cmd/Ctrl+Z to test.</div>;
/* <!-- END RBP GENERATED: builds-undo-redo-v1 --> */
