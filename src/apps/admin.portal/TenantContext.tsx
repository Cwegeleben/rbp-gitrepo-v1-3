/*
<!-- BEGIN RBP GENERATED: tenant-admin-harden -->
*/
import React, { createContext, useEffect, useState } from "react";
import { getAccessCtx } from "./accessCtx.server";

export const TenantContext = createContext<any>(null);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ctx, setCtx] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const c = await getAccessCtx();
      setCtx(c);
    })();
  }, []);
  return <TenantContext.Provider value={ctx}>{children}</TenantContext.Provider>;
};
/*
<!-- END RBP GENERATED: tenant-admin-harden -->
*/
