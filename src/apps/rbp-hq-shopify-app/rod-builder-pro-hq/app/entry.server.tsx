// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
import { PassThrough } from "node:stream";
import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  _loadContext: AppLoadContext
) {
  const callbackName = isbot(request.headers.get("user-agent")) ? "onAllReady" : "onShellReady";
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]() {
          const body = new PassThrough();
          const headers = new Headers(responseHeaders);
          headers.set("Content-Type", "text/html");
          resolve(new Response(body as any, { status: responseStatusCode, headers }));
          pipe(body);
        },
        onShellError(error: unknown) { reject(error); },
        onError(error: unknown) { console.error(error); responseStatusCode = 500; },
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
