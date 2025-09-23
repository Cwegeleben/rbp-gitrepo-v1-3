// <!-- BEGIN RBP GENERATED: rbp-hq-catalog-v0-2 -->
// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";
import HQCatalogTable from "./HQCatalogTable";

const meta: Meta<typeof HQCatalogTable> = {
  title: "HQ/CatalogTable",
  component: HQCatalogTable
};
export default meta;
type Story = StoryObj<typeof HQCatalogTable>;

export const Empty: Story = {
  args: { items: [], onApprove: () => {} }
};

export const Pending: Story = {
  args: {
    items: [
      { id: "1", title: "Rod A", vendor: "Acme", approved: false },
      { id: "2", title: "Rod B", vendor: "Acme", approved: false }
    ],
    onApprove: () => {}
  }
};

export const Approved: Story = {
  args: {
    items: [
      { id: "1", title: "Rod A", vendor: "Acme", approved: true },
      { id: "2", title: "Rod B", vendor: "Acme", approved: true }
    ],
    onApprove: () => {}
  }
};

export const ApproveInteraction: Story = {
  args: {
    items: [
      { id: "1", title: "Rod A", vendor: "Acme", approved: false }
    ],
    onApprove: () => {}
  },
  play: async ({ canvasElement }) => {
    // Interaction example: click approve if present
    const btn = canvasElement.querySelector("button");
    btn?.click();
  }
};
// <!-- END RBP GENERATED: rbp-hq-catalog-v0-2 -->
