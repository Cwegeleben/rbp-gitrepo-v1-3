// <!-- BEGIN RBP GENERATED: staging-app-entry-preflight-v1 -->
import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader(_args: LoaderFunctionArgs) {
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>RBP Gateway — App Embed</title>
  </head>
  <body>
    <div id="root">
      <div data-testid="app-embed-ok">ok</div>
    </div>
  </body>
</html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
// <!-- END RBP GENERATED: staging-app-entry-preflight-v1 -->
