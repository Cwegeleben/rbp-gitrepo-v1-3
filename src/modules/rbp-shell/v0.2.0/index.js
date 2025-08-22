// <!-- BEGIN RBP GENERATED: rbp-shell-mvp -->
// rbp-shell v0.2.0 — Storefront Shell MVP (BUILD)
// Default export: async function mountShell(rootEl, { logger } = {})
// - Fetch in parallel with credentials: include
//   • GET /apps/rbp/api/access/ctx
//   • GET /apps/proxy/modules/registry.json
// - Render <Shell ctx={ctx} registry={registry} /> into rootEl
// - On failure, render error UI with Retry that re-runs both fetches
// - Provide tiny logger (console.* fallback) and defensive error handling
// - Export unmount() to cleanup

import React from "react";
import { createRoot } from "react-dom/client";
import Shell from "./Shell";

let __root = null;
let __reactRoot = null;

function getLogger(custom) {
  const c = custom || {};
  const fallback = typeof window !== "undefined" ? window.console : console;
  return {
    log: (/* ...args */ ...args) => (c.log || fallback.log).apply(fallback, ["[rbp-shell]", ...args]),
    warn: (/* ...args */ ...args) => (c.warn || fallback.warn).apply(fallback, ["[rbp-shell]", ...args]),
    error: (/* ...args */ ...args) => (c.error || fallback.error).apply(fallback, ["[rbp-shell]", ...args]),
  };
}

async function fetchJson(url, logger) {
  try {
    const r = await fetch(url, { credentials: "include" });
    if (!r.ok) throw new Error(`${url} http ${r.status}`);
    return await r.json();
  } catch (e) {
    logger?.warn?.("fetch failed", url, e);
    throw e;
  }
}

function navigate(path) {
  try {
    window.location.assign(path);
  } catch (e) {
    // no-op
  }
}

export default async function mountShell(rootEl, { logger: customLogger } = {}) {
  const logger = getLogger(customLogger);
  __root = rootEl || document.getElementById("rbp-shell-root") || document.body;
  if (!__reactRoot) {
    __reactRoot = createRoot(__root);
  }

  // Show loading skeleton immediately
  __reactRoot.render(
    React.createElement(Shell, {
      ctx: { tenant: { domain: "" }, plan: "" },
      registry: {},
      navigate,
      logger,
      initialView: "loading",
    })
  );

  const load = async () => {
    try {
      const [ctx, registry] = await Promise.all([
        fetchJson("/apps/rbp/api/access/ctx", logger),
        fetchJson("/apps/proxy/modules/registry.json", logger),
      ]);
      __reactRoot.render(
        React.createElement(Shell, {
          ctx,
          registry,
          navigate,
          logger,
          initialView: "ready",
        })
      );
    } catch (error) {
      // Render a minimal error UI with Retry
      const onRetry = () => load();
      const ErrorView = () => (
        React.createElement("div", { className: "p-6 grid gap-4", role: "alert", "aria-live": "polite" },
          React.createElement("h2", { className: "text-xl font-semibold" }, "We couldn't load Rod Builder Pro"),
          React.createElement("p", { className: "opacity-80" }, "Please check your connection and try again."),
          React.createElement("button", {
            className: "inline-flex items-center justify-center rounded-lg px-4 py-2 ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-offset-2", onClick: onRetry
          }, "Retry"),
        )
      );
      __reactRoot.render(React.createElement(ErrorView));
      logger.error("rbp-shell mount failed", error);
    }
  };

  await load();

  return {
    unmount,
  };
}

export function unmount() {
  try {
    __reactRoot?.unmount?.();
    __reactRoot = null;
  } catch (e) {
    // ignore
  }
}
// expose for manual boot if needed (non-breaking)
if (typeof window !== "undefined") {
  // <!-- BEGIN RBP GENERATED: rbp-shell-mvp -->
  window.RBPShell = { mount: (...args) => mountShell(...args), unmount };
  // Auto-mount if a root is present on the page
  queueMicrotask?.(() => {
    try {
      const el = document.getElementById("rbp-shell-root");
      if (el) mountShell(el).catch(() => {});
    } catch {}
  });
  // <!-- END RBP GENERATED: rbp-shell-mvp -->
}
// <!-- END RBP GENERATED: rbp-shell-mvp -->
