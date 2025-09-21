// <!-- BEGIN RBP GENERATED: storefront-proxy-e2e-v1-0 -->
import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RbpProxyCallout } from "../../../../packages/ui/components/RbpProxyCallout";

const meta: Meta<typeof RbpProxyCallout> = {
  title: "Storefront/RbpProxyCallout (Theme)",
  component: RbpProxyCallout,
};
export default meta;

export const Blocked: StoryObj<typeof RbpProxyCallout> = {
  render: () => <RbpProxyCallout blocked={true} usingMock={true} onToggleMock={() => {}} />,
};
// <!-- END RBP GENERATED: storefront-proxy-e2e-v1-0 -->
