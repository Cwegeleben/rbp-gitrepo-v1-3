/*
<!-- BEGIN RBP GENERATED: tenant-admin-shell -->
*/
import React from "react";
import { SettingsPanel } from "../SettingsPage";

export default {
  title: "Settings/SettingsPanel",
  component: SettingsPanel,
};

const baseCtx = {
  shopDomain: "demo.myshopify.com",
  plan: "pro",
  features: { catalog: { v2: true }, builds: { readonly: true } },
  vendors: ["Acme", "Zen"]
};

export const WithFlags = () => <SettingsPanel ctx={baseCtx} />;
export const WithoutFlags = () => <SettingsPanel ctx={{ ...baseCtx, features: {}, flags: {}, vendors: [] }} />;
export const Loading = () => <SettingsPanel loading />;
export const ErrorState = () => <SettingsPanel error="Failed to load" />;
/*
<!-- END RBP GENERATED: tenant-admin-shell -->
*/
