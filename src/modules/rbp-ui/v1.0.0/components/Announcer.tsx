// <!-- BEGIN RBP GENERATED: ui-toast-announcer-v1 -->
import React, { useEffect } from 'react';

export default function Announcer(){
  useEffect(() => {
    const polite = document.getElementById('rbp-announce-polite');
    const assertive = document.getElementById('rbp-announce-assertive');
    if (!polite || !assertive) return;
    polite.setAttribute('aria-live','polite'); polite.setAttribute('aria-atomic','true');
    assertive.setAttribute('aria-live','assertive'); assertive.setAttribute('aria-atomic','true');
  }, []);
  return null;
}
// <!-- END RBP GENERATED: ui-toast-announcer-v1 -->
