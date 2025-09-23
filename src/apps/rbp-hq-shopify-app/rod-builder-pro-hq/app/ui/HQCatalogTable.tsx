// <!-- BEGIN RBP GENERATED: rbp-hq-catalog-v0-2 -->
import { DataTable, Button, InlineStack, Thumbnail, Text } from "@shopify/polaris";
import type { ProductStub } from "../libs/products";
import { useState } from "react";

export default function HQCatalogTable({ items, onApprove }: { items: ProductStub[]; onApprove: (id: string) => void; }) {
  const [local, setLocal] = useState(items);

  const rows = local.map((p) => [
    <InlineStack gap="200" align="start" blockAlign="center" key={`img-${p.id}`}>
      <Thumbnail source={p.image || ""} alt={p.title} size="small" />
    </InlineStack>,
    <Text as="span" key={`title-${p.id}`}>{p.title}</Text>,
    <Text as="span" key={`vendor-${p.id}`}>{p.vendor || "—"}</Text>,
    <Text as="span" key={`status-${p.id}`}>{p.approved ? "Approved" : "Pending"}</Text>,
    p.approved ? (
      <Button key={`approved-${p.id}`} disabled>Approved</Button>
    ) : (
      <Button key={`approve-${p.id}`} onClick={() => { onApprove(p.id); setLocal(prev => prev.map(x => x.id === p.id ? { ...x, approved: true } : x)); }}>Approve</Button>
    )
  ]);

  return (
    <DataTable
      columnContentTypes={["text", "text", "text", "text", "text"]}
      headings={["Image", "Title", "Vendor", "Status", "Actions"]}
      rows={rows as any}
      hideScrollIndicator
    />
  );
}
// <!-- END RBP GENERATED: rbp-hq-catalog-v0-2 -->
