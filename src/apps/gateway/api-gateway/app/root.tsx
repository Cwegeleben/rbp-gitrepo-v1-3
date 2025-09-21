// <!-- BEGIN RBP GENERATED: gateway-remix-root-v1-0 -->
import * as React from "react";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

export const meta = () => ([
  { charSet: "utf-8" },
  { title: "RBP Gateway" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
]);

export const links = () => [] as const;

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Application error</h1>
        <Scripts />
      </body>
    </html>
  );
}
// <!-- END RBP GENERATED: gateway-remix-root-v1-0 -->
