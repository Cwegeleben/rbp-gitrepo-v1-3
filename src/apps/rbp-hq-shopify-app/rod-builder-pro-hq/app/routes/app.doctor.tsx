// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useState, useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import { Page, Button, Card, Text, InlineStack, BlockStack } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

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

  // <!-- BEGIN RBP GENERATED: rbp-hq-app-bridge-fix-v1 -->
  useEffect(() => {
    if (typeof window === "undefined") return;
    (async () => {
      try {
  const { Toast } = await import("@shopify/app-bridge/actions");
  // pre-create a toast and expose a helper for the button
  // @ts-expect-error: runtime App Bridge instance from useAppBridge is compatible
  const toast = Toast.create(app as any, { message: "App Bridge is alive 🍞" });
        (window as any).rbpToast = () => toast.dispatch(Toast.Action.SHOW);
      } catch (err) {
        // no-op: keep SSR safe
        console.error("App Bridge lazy import failed", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app, data?.host]);
  // <!-- END RBP GENERATED: rbp-hq-app-bridge-fix-v1 -->

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
          <Button onClick={() => { setCount((c) => c + 1); (window as any).rbpToast?.(); }}>Toast Test</Button>
        </Card>
      </BlockStack>
    </Page>
  );
}
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
