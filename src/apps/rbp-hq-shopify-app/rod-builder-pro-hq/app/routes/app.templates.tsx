// <!-- BEGIN RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Page, Card, Button, InlineStack, Text, TextField, Select, ResourceList, ResourceItem } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { ensureSeedTemplates, type SpecTemplates } from "../libs/templates.server";

export async function loader(args: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(args.request);
  const templates = await ensureSeedTemplates(admin);
  return json({ templates });
}

export async function action(args: ActionFunctionArgs) {
  const { admin } = await authenticate.admin(args.request);
  const { saveTemplates } = await import("../libs/templates.server");
  const body = await args.request.formData();
  const jsonStr = String(body.get("templates") || "");
  const tpl = JSON.parse(jsonStr) as SpecTemplates;
  await saveTemplates(admin, tpl);
  return json({ ok: true });
}

export default function TemplatesManager() {
  const { templates } = useLoaderData<typeof loader>();
  const f = useFetcher();
  return (
    <Page title="Templates">
      <Card>
        <InlineStack gap="400" align="space-between">
          <Text as="h2" variant="headingMd">Product Types</Text>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </InlineStack>
        <ResourceList
          resourceName={{ singular: "type", plural: "types" }}
          items={templates.productTypes}
          renderItem={(item) => (
            <ResourceItem id={item.id} accessibilityLabel={item.name} url="#">
              <InlineStack gap="400">
                <Text as="span" variant="bodyMd">{item.name}</Text>
                <Text as="span" tone="subdued">({item.fields.length} fields)</Text>
              </InlineStack>
            </ResourceItem>
          )}
        />
      </Card>
      <Card>
        <InlineStack gap="400" align="space-between">
          <Text as="h2" variant="headingMd">Supplier Overrides</Text>
        </InlineStack>
        <ResourceList
          resourceName={{ singular: "override", plural: "overrides" }}
          items={templates.supplierOverrides}
          renderItem={(item) => (
            <ResourceItem id={item.id} accessibilityLabel={item.id} url="#">
              <InlineStack gap="400">
                <Text as="span" variant="bodyMd">{item.id}</Text>
                <Text as="span" tone="subdued">{item.productTypeId}</Text>
              </InlineStack>
            </ResourceItem>
          )}
        />
      </Card>
      <Card>
        <InlineStack gap="400" align="space-between" blockAlign="center">
          <Text as="h2" variant="headingMd">Raw JSON Editor</Text>
          <Button
            variant="primary"
            onClick={() => {
              const form = new FormData();
              form.append("templates", JSON.stringify(templates));
              f.submit(form, { method: "post" });
            }}
          >Save</Button>
        </InlineStack>
        <pre style={{ maxHeight: 320, overflow: "auto", background: "#111", color: "#eee", padding: 12 }}>
{JSON.stringify(templates, null, 2)}
        </pre>
      </Card>
    </Page>
  );
}
// <!-- END RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
