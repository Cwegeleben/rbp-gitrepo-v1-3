/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavItem = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={active ? "nav-item active" : "nav-item"}>
      {label}
    </Link>
  );
};
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
