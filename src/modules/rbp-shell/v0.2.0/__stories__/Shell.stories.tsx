// <!-- BEGIN RBP GENERATED: rbp-shell-mvp -->
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Shell from "../Shell";

const meta: Meta<typeof Shell> = {
  title: "Storefront/Shell",
  component: Shell,
};
export default meta;

const ctx = {
  tenant: { domain: "rbp-dev.myshopify.com" },
  plan: "dev",
  flags: { showDevTools: true },
  timestamp: new Date().toISOString(),
};

const registryWithModules = {
  modules: {
    "rbp-catalog": { default: "0.1.0", versions: { "0.1.0": { path: "/mock/catalog.js" } } },
    "rbp-builds": { default: "0.2.0", versions: { "0.2.0": { path: "/mock/builds.js" } } },
  },
};

export const Loading: StoryObj<typeof Shell> = {
  args: {
    ctx,
    registry: registryWithModules,
    navigate: (p: string) => console.log("navigate", p),
    initialView: "loading",
  },
};

export const Ready: StoryObj<typeof Shell> = {
  render: (args) => {
    (globalThis as any).__rbp_mockImport = async (url: string) => ({ default: (root: HTMLElement) => { root.innerHTML = `<div class='p-4'>Loaded ${url}</div>`; } });
    return <Shell {...args} />;
  },
  args: {
    ctx,
    registry: registryWithModules,
    navigate: (p: string) => console.log("navigate", p),
    initialView: "ready",
  },
};

export const Error: StoryObj<typeof Shell> = {
  args: {
    ctx: { ...ctx, tenant: { domain: "" } },
    registry: {},
    navigate: (p: string) => console.log("navigate", p),
    initialView: "error",
  },
};

export const Empty: StoryObj<typeof Shell> = {
  args: {
    ctx,
    registry: { modules: {} },
    navigate: (p: string) => console.log("navigate", p),
    initialView: "ready",
  },
};
// <!-- END RBP GENERATED: rbp-shell-mvp -->
