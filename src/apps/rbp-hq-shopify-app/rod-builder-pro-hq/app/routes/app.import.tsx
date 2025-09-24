// <!-- BEGIN RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Page, Card, Button, Text, TextField, Select, InlineStack, BlockStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { ensureSeedTemplates } from "../libs/templates.server";

export async function loader(args: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(args.request);
  const templates = await ensureSeedTemplates(admin);
  return json({ templates });
}

export default function ImportWizard() {
  const { templates } = useLoaderData<typeof loader>();
  const f = useFetcher();
  const ft = useFetcher();
  return (
    <Page title="Ingest">
      <Card>
        <BlockStack gap="400">
          <Text variant="headingMd" as="h2">Source</Text>
          <f.Form method="post" action="/hq/api/ingest/preview">
            <InlineStack gap="400">
              <TextField name="urls[]" label="URL" labelHidden autoComplete="off" />
              <Select name="productTypeId" label="Product Type" labelHidden options={templates.productTypes.map((p) => ({ label: p.name, value: p.id }))} />
              <Select name="supplierId" label="Supplier" labelHidden options={templates.supplierOverrides.map((s) => ({ label: s.id, value: s.id }))} />
              <Button submit>Preview</Button>
            </InlineStack>
          </f.Form>
          {Array.isArray((f.data as any)?.rows) && (
            <Card>
              <Text as="h3" variant="headingSm">Preview</Text>
              <pre style={{ maxHeight: 240, overflow: "auto" }}>{JSON.stringify((f.data as any).rows, null, 2)}</pre>
              <ft.Form method="post" action="/hq/api/ingest/commit">
                <input type="hidden" name="rows" value={JSON.stringify((f.data as any).rows)} />
                <Button submit variant="primary">Commit</Button>
              </ft.Form>
            </Card>
          )}
        </BlockStack>
      </Card>
    </Page>
  );
}
// <!-- END RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
