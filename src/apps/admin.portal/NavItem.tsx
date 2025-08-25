/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React from "react";
import { useLocation } from "react-router-dom";
import ShopHostLink from "./app/components/ShopHostLink";

export const NavItem = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <ShopHostLink to={to} className={active ? "nav-item active" : "nav-item"}>
      {label}
    </ShopHostLink>
  );
};
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
