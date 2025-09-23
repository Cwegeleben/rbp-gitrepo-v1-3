// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
import "@shopify/shopify-app-remix/adapters/node";
import { ApiVersion, AppDistribution, shopifyApp } from "@shopify/shopify-app-remix/server";
import { MemorySessionStorage } from "@shopify/shopify-app-session-storage-memory";

// Provide a sane default app URL during local development to prevent SSR init errors
const devDefaultAppUrl = "http://localhost:8083";
const appUrl =
  process.env.SHOPIFY_APP_URL ||
  process.env.APP_URL ||
  (process.env.NODE_ENV !== "production" ? devDefaultAppUrl : "");

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl,
  authPathPrefix: "/auth",
  sessionStorage: new MemorySessionStorage(),
  distribution: AppDistribution.AppStore,
  future: { unstable_newEmbeddedAuthStrategy: true, removeRest: true },
});

export default shopify;
export const authenticate = shopify.authenticate;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
