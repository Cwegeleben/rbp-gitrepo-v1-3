// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const schema = {
  openapi: "3.0.0",
  info: { title: "RBP HQ API", version: "0.2.0" },
  paths: {
    "/hq/api/modules": { get: { responses: { 200: { description: "OK" } } } },
    "/hq/api/products/pending": { get: { responses: { 200: { description: "OK" } } } },
    "/hq/api/products/{id}/approve": { post: { responses: { 200: { description: "OK" } } } },
    "/hq/api/tenants": { get: { responses: { 200: { description: "OK" } } } },
    "/hq/api/pricing/books": { get: { responses: { 200: { description: "OK" } } } },
    // <!-- BEGIN RBP GENERATED: rbp-hq-catalog-v0-2 -->
    "/hq/api/products": { get: { responses: { 200: { description: "OK" } } } },
    "/hq/api/products/approved": { get: { responses: { 200: { description: "OK" } } } }
    // <!-- END RBP GENERATED: rbp-hq-catalog-v0-2 -->
    ,
    // <!-- BEGIN RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
    "/hq/api/templates": {
      get: { responses: { 200: { description: "OK" } } },
      post: { responses: { 200: { description: "OK" } } }
    },
    "/hq/api/ingest/preview": { post: { responses: { 200: { description: "OK" } } } },
    "/hq/api/ingest/commit": { post: { responses: { 200: { description: "OK" } } } },
    // <!-- END RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
    // <!-- BEGIN RBP GENERATED: rbp-hq-catalog-inventory-v0-4 -->
    "/hq/api/inventory": { get: { responses: { 200: { description: "OK" } } } }
    // <!-- END RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
  }
};

// <!-- BEGIN RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->
// bump version to 0.3.0 at write time
(schema as any).info.version = "0.4.0";
// <!-- END RBP GENERATED: rbp-hq-templates-ingest-v0-3 -->

const out = resolve(process.cwd(), "public/openapi.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(schema, null, 2));
console.log("[RBP HQ] openapi written:", out);
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
