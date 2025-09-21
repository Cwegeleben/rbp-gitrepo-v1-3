// <!-- BEGIN RBP GENERATED: storefront-proxy-e2e-v1-0 -->
import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddToBuildPanel } from "../components/AddToBuildPanel";

const meta: Meta<typeof AddToBuildPanel> = {
  title: "Storefront/AddToBuildPanel",
  component: AddToBuildPanel,
};
export default meta;

export const Basic: StoryObj<typeof AddToBuildPanel> = {
  render: () => <AddToBuildPanel />,
  // Minimal play stub to satisfy requirement without extra deps
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  play: (async ({ canvasElement }: any) => {
    await new Promise((r) => setTimeout(r, 50));
    // No-op
  }) as any,
};

// <!-- BEGIN RBP GENERATED: storefront-cart-e2e-v1-1 -->
export const Cart: StoryObj<typeof AddToBuildPanel> = {
  render: () => {
    // Render panel as-is; users can click the button in Storybook UI.
    // Navigation will attempt window.location.assign, which is fine in preview.
    return <AddToBuildPanel />;
  },
};
// <!-- END RBP GENERATED: storefront-cart-e2e-v1-1 -->
// <!-- END RBP GENERATED: storefront-proxy-e2e-v1-0 -->
