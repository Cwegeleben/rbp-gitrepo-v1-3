// <!-- BEGIN RBP GENERATED: builds-gallery-v1 -->
// rbp-builds-gallery v1.0.0 — Storefront My Builds Gallery
// Contract: default export is a function mount(rootEl) that renders a UI-only gallery
// Integrates with existing events: emits 'rbp:active-build' on Open, listens to 'rbp:build-updated'/'rbp:part-selected'.
// No new server contracts. Uses existing /apps/proxy/api/builds endpoints.

import React from 'react';
import { createRoot } from 'react-dom/client';
import Gallery from './components/Gallery';

export default function mount(rootEl) {
  try { rootEl.innerHTML = ''; } catch {}
  const root = createRoot(rootEl);
  root.render(React.createElement(Gallery, null));
  return { unmount(){ try { root.unmount(); } catch {} } };
}
// <!-- END RBP GENERATED: builds-gallery-v1 -->
