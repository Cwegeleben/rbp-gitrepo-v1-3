import type { AppConfig } from "@remix-run/dev";

const config: AppConfig = {
  ignoredRouteFiles: [
    "**/*.test.{js,jsx,ts,tsx}",
    "**/*.spec.{js,jsx,ts,tsx}",
    "**/__tests__/**",
  ],
  // Bundle React/Remix libs needed at runtime to avoid module resolution issues
  serverDependenciesToBundle: [
    "isbot",
    "@remix-run/react",
    "react",
    "react-dom",
    "react-router",
    "react-router-dom",
    "@remix-run/router",
    "@remix-run/server-runtime",
  "cookie",
    "scheduler",
  ],
  serverPlatform: "node",
  serverConditions: ["node"],
  serverMainFields: ["main", "module"],
  serverModuleFormat: "cjs",
  serverBuildPath: "build/index.cjs",
};

export default config;
