// <!-- BEGIN RBP GENERATED: rbp-hq-catalog-v0-2 -->
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { Page, Button, InlineStack, Text, IndexTable, Card, TextField, Select, Badge } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export async function loader(args: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(args.request);
  // <!-- BEGIN RBP GENERATED: rbp-hq-app-bridge-fix-v1 -->
  const { listProducts } = await import("../libs/products");
  // <!-- END RBP GENERATED: rbp-hq-app-bridge-fix-v1 -->
  const items = listProducts();
  // <!-- BEGIN RBP GENERATED: rbp-hq-catalog-inventory-v0-4 -->
  // Merge inventory metrics server-side
  const productIds = items.map((p) => p.id);
  let byProductId: Record<string, { available:number; incoming:number; variants: Array<{id:string; sku?:string; available:number; incoming:number}> }>= {};
  try {
    const url = new URL("/hq/api/inventory", new URL(args.request.url).origin);
    url.searchParams.set("productIds", productIds.join(","));
    const res = await fetch(url);
    const data = await res.json();
    byProductId = data.byProductId || {};
  } catch {}
  return { items, byProductId };
  // <!-- END RBP GENERATED: rbp-hq-catalog-inventory-v0-4 -->
}

export default function CatalogPage() {
  const { items, byProductId } = useLoaderData<typeof loader>();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const vendor = params.get("vendor") || "";
  const filtered = items.filter((p: any) => {
    const okQ = !query || p.title.toLowerCase().includes(query.toLowerCase());
    const okV = !vendor || (p.vendor || "").toLowerCase() === vendor.toLowerCase();
    return okQ && okV;
  });

  const rows = filtered.map((p: any, idx: number) => {
    const inv = byProductId[p.id] || { available: 0, incoming: 0, variants: [] };
    const sku = inv.variants.map((v) => v.sku).filter(Boolean)[0] || "";
    const approved = !!p.approved;
    return { p, inv, sku, approved, idx };
  });

  return (
    <Page
      title="HQ Catalog"
      primaryAction={{ content: "Import from Supplier", onAction: () => (location.href = `/app/import?mode=supplier`) }}
      secondaryActions={[
        { content: "Import from File", onAction: () => (location.href = `/app/import?mode=file`) },
        { content: "Manage Templates", onAction: () => (location.href = `/app/templates`) }
      ]}
    >
      {/* <!-- BEGIN RBP GENERATED: rbp-hq-catalog-inventory-v0-4 --> */}
      <Card>
        <InlineStack gap="400" align="space-between" blockAlign="center">
          <TextField
            label="Search"
            labelHidden
            value={query}
            onChange={(v) => { const next = new URLSearchParams(params); next.set("q", v); setParams(next); }}
            autoComplete="off"
          />
          <Select
            label="Vendor"
            labelHidden
            options={[{ label: "All vendors", value: "" }, ...Array.from(new Set(items.map((i: any) => i.vendor).filter(Boolean))).map((v: string) => ({ label: v, value: v }))]}
            onChange={(v) => { const next = new URLSearchParams(params); next.set("vendor", v); setParams(next); }}
            value={vendor}
          />
        </InlineStack>
      </Card>
      <Card>
        <IndexTable
          resourceName={{ singular: "product", plural: "products" }}
          itemCount={rows.length}
          headings={[
            { title: "Title" },
            { title: "Vendor" },
            { title: "Status" },
            { title: "Inventory" },
            { title: "Incoming" },
            { title: "SKU" },
            { title: "Updated" }
          ]}
          selectable
        >
          {rows.map(({ p, inv, sku, approved, idx }) => (
            <IndexTable.Row id={p.id} key={p.id} position={idx}>
              <IndexTable.Cell>{p.title}</IndexTable.Cell>
              <IndexTable.Cell>{p.vendor || ""}</IndexTable.Cell>
              <IndexTable.Cell><Badge tone={approved ? "success" : "attention"}>{approved ? "Approved" : "Pending"}</Badge></IndexTable.Cell>
              <IndexTable.Cell><div style={{ textAlign: "right" }}>{inv.available || 0}</div></IndexTable.Cell>
              <IndexTable.Cell><div style={{ textAlign: "right", opacity: inv.incoming ? 1 : 0.6 }}>{inv.incoming || 0}</div></IndexTable.Cell>
              <IndexTable.Cell>{sku}</IndexTable.Cell>
              <IndexTable.Cell>-</IndexTable.Cell>
            </IndexTable.Row>
          ))}
        </IndexTable>
      </Card>
      {/* <!-- END RBP GENERATED: rbp-hq-catalog-inventory-v0-4 --> */}
    </Page>
  );
}
// <!-- END RBP GENERATED: rbp-hq-catalog-v0-2 -->
