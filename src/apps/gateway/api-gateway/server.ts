import { createRequestHandler } from "@remix-run/node";
import * as build from "./build/index.js";
import http from "node:http";

const port = Number(process.env.PORT || 8080);

const handler = createRequestHandler(build, process.env.NODE_ENV);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const request = new Request(url, {
      method: req.method,
      headers: req.headers as any,
      body: req.method !== "GET" && req.method !== "HEAD" ? (req as any) : undefined,
    });
    const response = await handler(request);
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      const reader = response.body.getReader();
      const encoder = new TextEncoder();
      const pump = async (): Promise<void> => {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          return;
        }
        res.write(Buffer.from(value));
        await pump();
      };
      await pump();
    } else {
      res.end();
    }
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain");
    res.end("Internal Server Error\n" + (err instanceof Error ? err.stack : String(err)));
  }
});

server.listen(port, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
