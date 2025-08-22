// <!-- BEGIN RBP GENERATED: rbp-shell-mvp -->
import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import Tiles from "./components/Tiles";
import StatusPanel from "./components/StatusPanel";
import Skeleton from "./components/Skeleton";
import ErrorBoundary from "./components/ErrorBoundary";
/*
<!-- BEGIN RBP GENERATED: storefront-shell-v0-2 -->
*/
import ModuleList from "./components/ModuleList";
import ActiveBuild from "./components/ActiveBuild";
import ErrorBanner from "./components/ErrorBanner";
import LoadingBlock from "./components/LoadingBlock";
/*
<!-- END RBP GENERATED: storefront-shell-v0-2 -->
*/

type Ctx = {
  tenant: { domain: string };
  plan: string;
  flags?: Record<string, boolean>;
  timestamp?: string;
};

type Registry = {
  modules?: Record<string, {
    default?: string;
    latest?: string;
    versions?: Record<string, { path: string }>;
  }>;
};

export default function Shell({ ctx, registry, navigate, logger, initialView }: { ctx: Ctx; registry: Registry; navigate: (path: string) => void; logger?: Console; initialView?: "loading" | "ready" | "error" }) {
  const [state, setState] = useState<{ view: "loading" | "ready" | "error"; error?: any }>({ view: initialView || "loading" });
  const moduleRootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // In this build, we assume data is ready when mounted from index.js
    if (ctx && registry) setState({ view: "ready" });
  }, [ctx, registry]);

  const status = useMemo(() => ({
    accessOk: !!ctx?.tenant?.domain,
    registryOk: !!registry?.modules,
    at: new Date().toISOString(),
  }), [ctx, registry]);

  function resolveModuleUrl(name: string): string | null {
    const m = registry?.modules?.[name];
    if (!m) return null;
    const key = m.default || m.latest || Object.keys(m.versions || {}).sort().slice(-1)[0];
    const path = key && m.versions?.[key]?.path;
    return path || null;
  }

  function importModule(url: string): Promise<any> {
    const mock = (globalThis as any).__rbp_mockImport;
    if (typeof mock === "function") return mock(url);
    // @ts-ignore - allow dynamic URL import in bundlers
    return import(/* @vite-ignore */ url);
  }

  async function onTileClick(name: "rbp-catalog" | "rbp-builds") {
    if (!moduleRootRef.current) return;
    const url = resolveModuleUrl(name);
    if (!url) return; // disabled if missing
    moduleRootRef.current.innerHTML = "";
    try {
      const mod = await importModule(url);
      const root = moduleRootRef.current;
      const props = { ctx, navigate };
      if (mod && typeof mod.default === "function") {
        const maybe = mod.default(root, props);
        if (maybe && typeof maybe.then === "function") await maybe;
      }
      // else assume self-initializing module side-effects
    } catch (e) {
      logger?.error?.("module load failed", name, e);
      setState({ view: "error", error: e });
    }
  }

  // Always render visible chrome; show status blocks inline per view

  const tiles = [
    { id: "rbp-catalog", label: "Catalog" },
    { id: "rbp-builds", label: "Builds" },
  ] as const;

  return (
    <ErrorBoundary>
      <div className="p-6 grid gap-6">
        <Header title="Rod Builder Pro" tenant={ctx?.tenant?.domain} plan={ctx?.plan} devTools={!!ctx?.flags?.showDevTools} />
        {/* <!-- BEGIN RBP GENERATED: storefront-shell-v0-2 --> */}
        <div className="flex items-center justify-between">
          <div className="text-sm opacity-70" aria-live="polite">{state.view === 'loading' ? 'Fetching context…' : `Ready at ${status.at}`}</div>
          <button
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-offset-2"
            onClick={() => { /* placeholder */ }}
            aria-label="Open Builder Panel"
          >Open Builder Panel</button>
        </div>
        {state.view === 'error' && <ErrorBanner message="Failed to load context. Ensure the Theme Editor is using a signed HMAC URL." />}
        {state.view === 'loading' && <LoadingBlock label="Loading storefront context…" />}
        {/* <!-- END RBP GENERATED: storefront-shell-v0-2 --> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Tiles tiles={tiles} onClick={(id: "rbp-catalog" | "rbp-builds") => onTileClick(id)} isEnabled={(id: "rbp-catalog" | "rbp-builds") => !!resolveModuleUrl(id)} />
          <StatusPanel accessOk={status.accessOk} registryOk={status.registryOk} timestamp={status.at} />
        </div>
        {/* <!-- BEGIN RBP GENERATED: storefront-shell-v0-2 --> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModuleList registry={registry} />
          <ActiveBuild />
        </div>
        {/* <!-- END RBP GENERATED: storefront-shell-v0-2 --> */}
        <div id="rbp-module-root" ref={moduleRootRef} className="min-h-[200px] rounded-2xl shadow p-4" />
      </div>
    </ErrorBoundary>
  );
}
// <!-- END RBP GENERATED: rbp-shell-mvp -->
