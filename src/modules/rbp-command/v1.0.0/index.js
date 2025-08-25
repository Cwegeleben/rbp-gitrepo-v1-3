// <!-- BEGIN RBP GENERATED: ui-command-palette-v1 -->
// RBP Command Palette v1.0.0
// - Global, event-driven command registry and palette UI
// - Opens with Cmd/Ctrl+K, closes with Esc
// - Other modules can register via window events (rbp:cmd:register / rbp:cmd:unregister)
// - Execute event or URL; emits rbp:cmd:exec after run

/* eslint-disable */
(function () {
  if (typeof window === 'undefined') return;
  if (window.__RBP_CMD_MOUNTED__) return; // once per page
  window.__RBP_CMD_MOUNTED__ = true;

  // Minimal React integration without exports: dynamically import React at runtime if available
  // In our build env, modules resolve React. In tests, we import this file for side-effects only.

  const hostId = 'rbp-cmd-host';
  function ensureHost() {
    let host = document.getElementById(hostId);
    if (!host) {
      host = document.createElement('div');
      host.id = hostId;
      host.style.position = 'fixed';
      host.style.inset = '0';
      host.style.zIndex = '2147483001';
      host.style.pointerEvents = 'none';
      document.body.appendChild(host);
    }
    return host;
  }

  // Global store (very small) — mirrored by TS hooks for tests/components
  const Store = {
    open: false,
    actions: new Map(), // id -> action
  };

  function isTypingTarget(el) {
    if (!el) return false;
    const tag = (el.tagName || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea' || el.isContentEditable;
    return typing;
  }

  function onRegister(e) {
    try {
      const arr = e?.detail?.actions || [];
      for (const a of arr) if (a?.id && a?.title) Store.actions.set(a.id, a);
      notify();
    } catch {}
  }
  function onUnregister(e) {
    try {
      const ids = e?.detail?.ids || [];
      for (const id of ids) Store.actions.delete(id);
      notify();
    } catch {}
  }
  function execById(id) {
    const a = Store.actions.get(id);
    if (!a) return false;
    try {
      if (a.exec?.type === 'event' && a.exec?.value) {
        window.dispatchEvent(new CustomEvent(a.exec.value, { detail: a.exec.payload }));
      } else if (a.exec?.type === 'url' && a.exec?.value) {
        try {
          const url = a.exec.value;
          const sameOrigin = /^\/?[\w#?=&.-]/.test(url) || url.startsWith(location.origin);
          if (sameOrigin) history.pushState({}, '', url);
          else window.location.assign(url);
        } catch {}
      }
    } finally {
      // Always emit exec notification
      window.dispatchEvent(new CustomEvent('rbp:cmd:exec', { detail: { id } }));
  // a11y feedback via announcer (polite)
  try { window.dispatchEvent(new CustomEvent('rbp:announce', { detail: { message: `Command executed: ${a?.title || id}` } })); } catch {}
    }
    return true;
  }

  function open() { if (!Store.open) { Store.open = true; notify(); } }
  function close() { if (Store.open) { Store.open = false; notify(); } }

  function onOpen() { open(); }
  function onClose() { close(); }

  function onKeydown(ev) {
    try {
      if (isTypingTarget(document.activeElement)) return;
      const metaK = (ev.metaKey || ev.ctrlKey) && !ev.shiftKey && !ev.altKey && (ev.key?.toLowerCase?.() === 'k');
      if (metaK) {
        ev.preventDefault();
        ev.stopPropagation();
        open();
        return;
      }
      if (Store.open && ev.key === 'Escape') {
        ev.preventDefault();
        ev.stopPropagation();
        close();
      }
    } catch {}
  }

  // Render — lazy import React/ReactDOM only when first opened
  let mounted = false;
  let React = null;
  let ReactDOM = null;
  let Palette = null;
  async function mountUi() {
    if (mounted) return;
    mounted = true;
    ensureHost();
    try {
      React = (await import('react')).default || (await import('react'));
      ReactDOM = await import('react-dom/client');
      Palette = (await import('./components/CommandPalette')).default;
    } catch (e) {
      // If React is not available (unlikely), silently skip UI; registry still works
      console.warn('[RBP CMD] UI mount failed', e);
      return;
    }
    const rootEl = document.getElementById(hostId);
    if (!rootEl) return;
    const root = ReactDOM.createRoot(rootEl);
    function App() {
      const [, setTick] = React.useState(0);
      React.useEffect(() => {
        const i = subscribers.add(() => setTick(t => t + 1));
        return () => subscribers.delete(i);
      }, []);
      return React.createElement(Palette, {
        open: Store.open,
        actions: Array.from(Store.actions.values()),
        onClose: close,
        onExec: (id) => execById(id),
      });
    }
    root.render(React.createElement(App));
  }

  // Tiny subscription to notify UI and any observers
  const subscribers = new Set();
  function notify() { for (const fn of subscribers) { try { fn(); } catch {} } if (Store.open) mountUi(); }

  // Built-ins registration
  function registerBuiltins() {
    try {
      const { builtins } = requireBuiltins();
      for (const a of builtins()) Store.actions.set(a.id, a);
    } catch {}
  }
  function requireBuiltins() {
    // Dynamic to avoid Node resolution issues when tests import index.js for side effects
    return {
      builtins: () => [
        { id: 'open-builds-gallery', title: 'Open Builds Gallery', group: 'Navigation', exec: { type: 'event', value: 'rbp:builds:gallery:open' } },
        { id: 'open-templates', title: 'Open Templates', group: 'Navigation', exec: { type: 'event', value: 'rbp:templates:open' } },
        { id: 'open-catalog', title: 'Open Catalog', group: 'Navigation', exec: { type: 'event', value: 'rbp:catalog:open' } },
        { id: 'package-build', title: 'Package Build', group: 'Builds', exec: { type: 'event', value: 'rbp:package:open' } },
        { id: 'open-cart-drawer', title: 'Open Cart Drawer', group: 'Cart', exec: { type: 'event', value: 'rbp:cart:open' } },
        { id: 'share-active-build', title: 'Share Active Build', group: 'Builds', exec: { type: 'event', value: 'rbp:share:open' } },
        { id: 'new-build', title: 'New Build', group: 'Builds', exec: { type: 'event', value: 'rbp:build:new' } },
      ],
    };
  }

  // Attach global event bridge
  window.addEventListener('rbp:cmd:register', onRegister);
  window.addEventListener('rbp:cmd:unregister', onUnregister);
  window.addEventListener('rbp:cmd:open', onOpen);
  window.addEventListener('rbp:cmd:close', onClose);
  window.addEventListener('keydown', onKeydown, { capture: true });

  // Register built-ins at startup
  registerBuiltins();

  // Expose tiny debug API
  window.RBP_CMD = {
    open,
    close,
    exec: execById,
    register: (actions) => onRegister({ detail: { actions } }),
    unregister: (ids) => onUnregister({ detail: { ids } }),
    _store: Store,
  };

  // Auto-mount UI when DOM is ready if already open via event
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (Store.open) mountUi();
  } else {
    document.addEventListener('DOMContentLoaded', () => { if (Store.open) mountUi(); }, { once: true });
  }
})();
// <!-- END RBP GENERATED: ui-command-palette-v1 -->
