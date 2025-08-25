// <!-- BEGIN RBP GENERATED: builds-gallery-bulk-v1 -->
import React, { useEffect, useRef } from 'react';

export default function SelectionCheckbox({ ariaLabel, checked, indeterminate, onChange }:{ ariaLabel: string; checked: boolean; indeterminate?: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>)=>void }){
  const ref = useRef<HTMLInputElement|null>(null);
  useEffect(()=>{ if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
  return (
  <input ref={ref} type="checkbox" aria-label={ariaLabel} checked={checked} onChange={onChange} />
  );
}
// <!-- END RBP GENERATED: builds-gallery-bulk-v1 -->
