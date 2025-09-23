import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { TitleBar, NavMenu } from "@shopify/app-bridge-react";
import { ShopHostLink } from "../utils/shopHostNav";
// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
export const links = () => [{ rel: "stylesheet", href: polarisStyles }];
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { authenticate } = await import("../shopify.server");
  await authenticate.admin(request);
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};
export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();
  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <ShopHostLink as="a" to="/app">HQ</ShopHostLink>
        <ShopHostLink as="a" to="/app/doctor">Doctor</ShopHostLink>
      </NavMenu>
      <div style={{ padding: 16 }}>
        <TitleBar title="RBP HQ" />
        <main>
          <Outlet />
        </main>
      </div>
    </AppProvider>
  );
}
export function ErrorBoundary() { return boundary.error(useRouteError()); }
export const headers = (args: any) => {
  const base = boundary.headers(args);
  const h = new Headers(base);
  h.delete("X-Frame-Options");
  h.set("Content-Security-Policy", "frame-ancestors https://admin.shopify.com https://*.myshopify.com");
  h.set("Cache-Control", "no-store");
  return h;
};
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
