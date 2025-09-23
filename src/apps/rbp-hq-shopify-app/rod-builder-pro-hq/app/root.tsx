// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
import type { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: polarisStyles }];
export default function Root() {
  return <Outlet/>;
}
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
