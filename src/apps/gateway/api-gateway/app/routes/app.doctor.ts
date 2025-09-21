// <!-- BEGIN RBP GENERATED: admin-smoke-doctor-resource-v1-0 -->
import { type LoaderFunctionArgs } from "@remix-run/node";

export async function loader(_args: LoaderFunctionArgs) {
  const html = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Doctor</title>
    </head>
    <body>
      <div data-testid="doctor-embed-ok">ok</div>
    </body>
  </html>`;
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
// <!-- END RBP GENERATED: admin-smoke-doctor-resource-v1-0 -->
