// <!-- BEGIN RBP GENERATED: storefront-proxy-e2e-v1-0 -->
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RbpProxyCallout } from "./RbpProxyCallout";

const meta: Meta<typeof RbpProxyCallout> = {
  title: "Storefront/RbpProxyCallout",
  component: RbpProxyCallout,
};
export default meta;

export const Blocked: StoryObj<typeof RbpProxyCallout> = {
  render: () => {
    const [usingMock, setUsingMock] = useState(true);
    return <RbpProxyCallout blocked={true} usingMock={usingMock} onToggleMock={setUsingMock} />;
  },
};
// <!-- END RBP GENERATED: storefront-proxy-e2e-v1-0 -->
