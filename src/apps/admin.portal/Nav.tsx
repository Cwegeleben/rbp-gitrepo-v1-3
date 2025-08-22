/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React from "react";
import { NavItem } from "./NavItem";

export const Nav = ({ ctx }: { ctx: any }) => {
  const features = ctx?.features || {};
  const hasCatalog = features?.catalog?.v2 ?? true; // default show during dev
  const hasBuilds = features?.builds?.readonly === true; // read-only only
  const hasSettings = features?.settings?.readonly !== false; // default read-only
  return (
    <nav>
      <NavItem to="/" label="Dashboard" />
      {hasCatalog && <NavItem to="/catalog" label="Catalog" />}
      {hasBuilds && <NavItem to="/builds" label="Builds" />}
      {hasSettings && <NavItem to="/settings" label="Settings" />}
    </nav>
  );
};
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
