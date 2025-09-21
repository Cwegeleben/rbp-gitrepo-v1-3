/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: [
    "**/*.test.{js,jsx,ts,tsx}",
    "**/*.spec.{js,jsx,ts,tsx}",
    "**/__tests__/**",
  ],
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
