// <!-- BEGIN RBP GENERATED: rbp-hq-catalog-v0-2 -->
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Card, Button, InlineStack, Text } from "@shopify/polaris";
import HQCatalogTable from "../ui/HQCatalogTable";
import { listProducts, markApproved } from "../libs/products";
import { authenticate } from "../shopify.server";

export async function loader(args: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(args.request);
  void admin; // reserved
  const items = listProducts();
  return { items };
}

export default function CatalogPage() {
  const { items } = useLoaderData<typeof loader>();
  return (
    <Page title="HQ Catalog">
      <InlineStack gap="400" align="space-between" blockAlign="center">
        <Text as="h2" variant="headingMd">Products</Text>
        <div>
          <Button onClick={() => console.log("Import clicked (stub)")}>Import</Button>
        </div>
      </InlineStack>
      <Card>
        <HQCatalogTable items={items} onApprove={(id: string) => { markApproved(id); }} />
      </Card>
    </Page>
  );
}
// <!-- END RBP GENERATED: rbp-hq-catalog-v0-2 -->
