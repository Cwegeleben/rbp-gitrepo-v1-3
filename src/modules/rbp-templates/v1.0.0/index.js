// <!-- BEGIN RBP GENERATED: builds-templates-v1 -->
// rbp-templates v1.0.0 — Storefront Template Presets
// Contract: default export mount(rootEl) that renders a UI-only templates grid
// No new server contracts. Uses existing /apps/proxy/api/builds endpoints.

import React from 'react';
import { createRoot } from 'react-dom/client';
import TemplatesGrid from './components/TemplatesGrid';

export default function mount(rootEl) {
  try { rootEl.innerHTML = ''; } catch {}
  const root = createRoot(rootEl);
  root.render(React.createElement(TemplatesGrid, null));
  return { unmount(){ try { root.unmount(); } catch {} } };
}
// <!-- END RBP GENERATED: builds-templates-v1 -->
