// <!-- BEGIN RBP GENERATED: ui-toast-announcer-v1 -->
// rbp-ui v1.0.0 — Global Toast Host & Screen-Reader Announcer
// Contract (ADD-only):
//  window.dispatchEvent(new CustomEvent('rbp:toast', { detail: { type: 'success'|'error'|'info'|'warning', message: string, timeoutMs?: number, id?: string } }))
//  window.dispatchEvent(new CustomEvent('rbp:announce', { detail: { message: string, politeness?: 'polite'|'assertive' } }))
// Runtime: vanilla DOM (no deps). Ensures single mount per page.

const STATE = {
  mounted: false,
  host: null,
  livePolite: null,
  liveAssertive: null,
  toastsById: new Map(),
  seq: 0,
};

const DEFAULT_MS = 4000;
const ERROR_MS = 8000;

function ensureHost() {
  if (STATE.host && document.body.contains(STATE.host)) return STATE.host;
  const host = document.createElement('div');
  host.id = 'rbp-ui-host';
  Object.assign(host.style, {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    pointerEvents: 'none', // only inner controls are interactive
    fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
  });
  document.body.appendChild(host);
  STATE.host = host;
  return host;
}

function ensureAnnouncers() {
  if (!STATE.livePolite || !document.body.contains(STATE.livePolite)) {
    const polite = document.createElement('div');
    polite.id = 'rbp-announce-polite';
    polite.setAttribute('role', 'status');
    polite.setAttribute('aria-live', 'polite');
    polite.setAttribute('aria-atomic', 'true');
    Object.assign(polite.style, visuallyHiddenStyle());
    document.body.appendChild(polite);
    STATE.livePolite = polite;
  }
  if (!STATE.liveAssertive || !document.body.contains(STATE.liveAssertive)) {
    const assertive = document.createElement('div');
    assertive.id = 'rbp-announce-assertive';
    assertive.setAttribute('role', 'status');
    assertive.setAttribute('aria-live', 'assertive');
    assertive.setAttribute('aria-atomic', 'true');
    Object.assign(assertive.style, visuallyHiddenStyle());
    document.body.appendChild(assertive);
    STATE.liveAssertive = assertive;
  }
}

function visuallyHiddenStyle() {
  return {
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  };
}

function iconByType(type) {
  switch (type) {
    case 'success': return '✓';
    case 'error': return '⚠';
    case 'warning': return '⚠';
    default: return 'ℹ';
  }
}

function colorByType(type) {
  switch (type) {
    case 'success': return { border: '#bbf7d0', bg: '#f0fdf4', fg: '#14532d', bar: '#22c55e' };
    case 'error': return { border: '#fecaca', bg: '#fef2f2', fg: '#7f1d1d', bar: '#ef4444' };
    case 'warning': return { border: '#fde68a', bg: '#fffbeb', fg: '#78350f', bar: '#f59e0b' };
    default: return { border: '#dbeafe', bg: '#eff6ff', fg: '#1e3a8a', bar: '#3b82f6' };
  }
}

function now() { return performance.now ? performance.now() : Date.now(); }

function genId() {
  STATE.seq += 1;
  return `t${Date.now().toString(36)}_${STATE.seq}`;
}

function mountToast({ id, type, message, timeoutMs }) {
  const host = ensureHost();
  const colors = colorByType(type);
  const el = document.createElement('div');
  el.className = 'rbp-toast';
  el.setAttribute('role', 'group');
  el.setAttribute('aria-label', `${type} notification`);
  el.tabIndex = 0; // focusable when tabbing
  Object.assign(el.style, {
    pointerEvents: 'auto',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    gap: '10px',
    minWidth: '260px',
    maxWidth: '360px',
    padding: '10px 12px 14px 12px',
    border: `1px solid ${colors.border}`,
    background: colors.bg,
    color: colors.fg,
    borderRadius: '12px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
  });

  // icon
  const ic = document.createElement('div');
  ic.textContent = iconByType(type);
  ic.setAttribute('aria-hidden', 'true');
  ic.style.fontSize = '18px';
  ic.style.lineHeight = '18px';
  el.appendChild(ic);

  // text
  const tx = document.createElement('div');
  tx.className = 'rbp-toast-text';
  tx.textContent = message;
  el.appendChild(tx);

  // close button
  const btn = document.createElement('button');
  btn.className = 'rbp-toast-close';
  btn.type = 'button';
  btn.textContent = '×';
  btn.setAttribute('aria-label', 'Close');
  Object.assign(btn.style, {
    border: 'none',
    background: 'transparent',
    color: colors.fg,
    fontSize: '16px',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: '6px',
  });
  el.appendChild(btn);

  // progress bar
  const barWrap = document.createElement('div');
  Object.assign(barWrap.style, { gridColumn: '1 / span 3', height: '3px', background: 'transparent', marginTop: '8px', borderRadius: '2px', overflow: 'hidden' });
  const bar = document.createElement('div');
  Object.assign(bar.style, { height: '100%', width: '0%', background: colors.bar, transition: 'width 33ms linear' });
  barWrap.appendChild(bar);
  el.appendChild(barWrap);

  // focus handling
  const returnFocusTo = document.activeElement && document.activeElement instanceof HTMLElement ? document.activeElement : null;

  // timer state
  const total = typeof timeoutMs === 'number' && timeoutMs > 0 ? timeoutMs : (type === 'error' ? ERROR_MS : DEFAULT_MS);
  let remaining = total;
  let startTs = now();
  let paused = false;
  let rafId = 0;
  let timerId = 0;

  function updateBar() {
    if (paused) return;
    const elapsed = now() - startTs;
    const pct = Math.max(0, Math.min(1, 1 - (elapsed / remaining)));
    bar.style.width = `${Math.round((1 - pct) * 100)}%`;
    rafId = requestAnimationFrame(updateBar);
  }

  function schedule() {
    clearTimeout(timerId);
    cancelAnimationFrame(rafId);
    startTs = now();
    rafId = requestAnimationFrame(updateBar);
    timerId = setTimeout(() => close('timeout'), remaining);
  }

  function pause() {
    if (paused) return;
    paused = true;
    cancelAnimationFrame(rafId);
    remaining = Math.max(0, remaining - (now() - startTs));
    clearTimeout(timerId);
  }

  function resume() {
    if (!paused) return;
    paused = false;
    schedule();
  }

  function close(_reason) {
    clearTimeout(timerId);
    cancelAnimationFrame(rafId);
    if (el.parentElement === host) host.removeChild(el);
    STATE.toastsById.delete(id);
    if (returnFocusTo && document.body.contains(returnFocusTo)) {
      try { returnFocusTo.focus(); } catch {}
    }
  }

  el.addEventListener('mouseenter', pause);
  el.addEventListener('mouseleave', resume);
  el.addEventListener('focusin', pause);
  el.addEventListener('focusout', (e) => {
    // If focus moved outside toast, resume
    if (!el.contains(e.relatedTarget)) resume();
  });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); close('escape'); }
  });
  btn.addEventListener('click', () => close('manual'));

  host.appendChild(el);
  schedule();

  return { el, close, setMessage: (msg) => { tx.textContent = msg; }, setType: (_t) => {/* type change not altering styles for v1 */} };
}

function onToastEvent(e) {
  const d = e?.detail || {};
  const type = d.type || 'info';
  const message = String(d.message || '').trim();
  if (!message) return;
  const id = d.id || genId();
  const existing = STATE.toastsById.get(id);
  if (existing) {
    existing.setMessage(message);
    // Reset timer on update
    try { existing.close('replace'); } catch {}
    const t = mountToast({ id, type, message, timeoutMs: d.timeoutMs });
    STATE.toastsById.set(id, t);
    return;
  }
  const t = mountToast({ id, type, message, timeoutMs: d.timeoutMs });
  STATE.toastsById.set(id, t);
}

function onAnnounceEvent(e) {
  const d = e?.detail || {};
  const msg = String(d.message || '').trim();
  const politeness = d.politeness === 'assertive' ? 'assertive' : 'polite';
  ensureAnnouncers();
  if (!msg) return;
  if (politeness === 'assertive') STATE.liveAssertive.textContent = msg;
  else STATE.livePolite.textContent = msg;
}

function mount() {
  if (STATE.mounted) return { unmount };
  ensureHost();
  ensureAnnouncers();
  window.addEventListener('rbp:toast', onToastEvent);
  window.addEventListener('rbp:announce', onAnnounceEvent);
  STATE.mounted = true;
  return { unmount };
}

function unmount() {
  window.removeEventListener('rbp:toast', onToastEvent);
  window.removeEventListener('rbp:announce', onAnnounceEvent);
  try {
    if (STATE.host?.parentElement) STATE.host.parentElement.removeChild(STATE.host);
    if (STATE.livePolite?.parentElement) STATE.livePolite.parentElement.removeChild(STATE.livePolite);
    if (STATE.liveAssertive?.parentElement) STATE.liveAssertive.parentElement.removeChild(STATE.liveAssertive);
  } catch {}
  STATE.host = null; STATE.livePolite = null; STATE.liveAssertive = null; STATE.toastsById.clear(); STATE.mounted = false;
}

// Optional tiny helpers for modules that want to import instead of dispatching manually.
function emitToast(detail) { window.dispatchEvent(new CustomEvent('rbp:toast', { detail })); }
function emitAnnounce(detail) { window.dispatchEvent(new CustomEvent('rbp:announce', { detail })); }

// CommonJS export for Jest/Storybook without ESM parser requirements
// @ts-ignore
if (typeof module !== 'undefined' && module && module.exports != null) {
  module.exports = mount;
  module.exports.default = mount;
  module.exports.emitToast = emitToast;
  module.exports.emitAnnounce = emitAnnounce;
}

// Auto-mount after a microtask to ensure DOM is ready
if (typeof window !== 'undefined') {
  try {
    if (document && (document.readyState === 'complete' || document.readyState === 'interactive')) {
      mount();
    } else {
      document.addEventListener('DOMContentLoaded', () => { try { mount(); } catch {} }, { once: true });
    }
  } catch {
    try { mount(); } catch {}
  }
  // expose for manual testing
  // @ts-ignore
  window.RBP_UI = { mount, unmount, emitToast, emitAnnounce };
}
// <!-- END RBP GENERATED: ui-toast-announcer-v1 -->
