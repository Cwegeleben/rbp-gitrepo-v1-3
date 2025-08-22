/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React, { useContext, useEffect, useMemo, useRef, createContext } from "react";
import createApp from "@shopify/app-bridge";
import { TenantContext } from "./TenantContext";
import { Nav } from "./Nav";
import { Outlet } from "react-router-dom";

export const AppBridgeContext = createContext<any>(null);

function useAppBridge() {
  const appRef = useRef<any>(null);
  const config = useMemo(() => {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const host = params.get("host") || "";
    const apiKey = (window as any)?.SHOPIFY_API_KEY || (window as any)?.__SHOPIFY_API_KEY__ || "";
    return { host, apiKey, forceRedirect: true } as const;
  }, []);
  useEffect(() => {
    if (!appRef.current) {
      try {
        appRef.current = createApp(config as any);
      } catch (e) {
        // no-op: app bridge optional in Storybook/local
      }
    }
  }, [config]);
  return appRef.current;
}

export const AdminShell: React.FC = () => {
  const ctx = useContext(TenantContext);
  const appBridge = useAppBridge();
  return (
    <AppBridgeContext.Provider value={appBridge}>
      <div className="admin-shell">
        <Nav ctx={ctx} />
        <main>
          <Outlet />
        </main>
      </div>
    </AppBridgeContext.Provider>
  );
};
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
