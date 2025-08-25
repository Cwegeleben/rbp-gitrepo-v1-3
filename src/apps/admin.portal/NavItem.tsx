/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React from "react";
import { useLocation } from "react-router-dom";
/* <!-- BEGIN RBP GENERATED: admin-host-nav-v2 --> */
import ShopHostLink from "./app/components/ShopHostLink";
/* <!-- END RBP GENERATED: admin-host-nav-v2 --> */

export const NavItem = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    /* <!-- BEGIN RBP GENERATED: admin-host-nav-v2 --> */
    <ShopHostLink to={to} className={active ? "nav-item active" : "nav-item"}>
      {label}
    </ShopHostLink>
    /* <!-- END RBP GENERATED: admin-host-nav-v2 --> */
  );
};
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
