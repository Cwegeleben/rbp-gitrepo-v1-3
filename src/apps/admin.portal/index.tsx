/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminShell } from "./AppShell";
import { TenantProvider } from "./TenantContext";
import { Dashboard } from "./Dashboard";
import { CatalogPage } from "./CatalogPage";
import { BuildsPage } from "./BuildsPage";
import { SettingsPage } from "./SettingsPage";

const Settings = () => <SettingsPage />;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <TenantProvider>
        <AdminShell />
      </TenantProvider>
    ),
    children: [
  { index: true, element: <Dashboard /> },
  { path: "catalog", element: <CatalogPage /> },
  { path: "builds", element: <BuildsPage /> },
  { path: "builds/:id", element: <BuildsPage /> },
  { path: "settings", element: <Settings /> },
    ],
  },
]);

export function mountAdminPortal(el: HTMLElement) {
  const root = createRoot(el);
  root.render(<RouterProvider router={router} />);
}
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
