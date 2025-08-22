/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React from "react";
import { AdminShell } from "../AppShell";
import { TenantProvider } from "../TenantContext";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "AdminShell",
  component: AdminShell,
};

export const Default = () => (
  <MemoryRouter>
    <TenantProvider>
      <AdminShell />
    </TenantProvider>
  </MemoryRouter>
);
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
