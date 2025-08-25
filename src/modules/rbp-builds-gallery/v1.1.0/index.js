// <!-- BEGIN RBP GENERATED: builds-gallery-bulk-v1 -->
// rbp-builds-gallery v1.1.0 — Storefront My Builds Gallery (Bulk + Inline Rename)
// Contract: default export is a function mount(rootEl) that renders a UI-only gallery
// Backward compatible. No new server endpoints. Adds multi-select bulk actions and inline rename.

import React from 'react';
import { createRoot } from 'react-dom/client';
import Gallery from './components/Gallery';

export default function mount(rootEl) {
  try { rootEl.innerHTML = ''; } catch {}
  const root = createRoot(rootEl);
  root.render(React.createElement(Gallery, null));
  return { unmount(){ try { root.unmount(); } catch {} } };
}
// <!-- END RBP GENERATED: builds-gallery-bulk-v1 -->
