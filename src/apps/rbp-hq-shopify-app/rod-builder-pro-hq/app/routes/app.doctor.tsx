// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { Page, Button, Card, Text, InlineStack, BlockStack } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Toast as AbToast } from "@shopify/app-bridge/actions";

export const loader = async ({ request }: any) => {
  const { authenticate } = await import("../shopify.server");
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  return {
    ok: true,
    shop: session.shop,
    host: url.searchParams.get("host"),
    embedded: url.searchParams.get("embedded") === "1" || url.searchParams.get("embedded") === "true",
  } as const;
};

export default function Doctor() {
  const [count, setCount] = useState(0);
  const app = useAppBridge();
  const data = useLoaderData<typeof loader>();
  return (
    <Page title="Doctor">
      <BlockStack gap="400">
        <Card>
          <InlineStack gap="400">
            <Text as="p">shop: {String(data.shop)}</Text>
            <Text as="p">host: {String(data.host)}</Text>
            <Text as="p">embedded: {String(data.embedded)}</Text>
          </InlineStack>
        </Card>
        <Card>
          <Text as="p">Toast test counter: {count}</Text>
          <Button onClick={() => { setCount((c) => c + 1); const t = AbToast.create(app, { message: "HQ Toast OK" }); t.dispatch(AbToast.Action.SHOW); }}>Toast Test</Button>
        </Card>
      </BlockStack>
    </Page>
  );
}
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
