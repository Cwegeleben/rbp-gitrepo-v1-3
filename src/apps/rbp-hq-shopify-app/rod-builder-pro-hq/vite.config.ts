// <!-- BEGIN RBP GENERATED: rbp-hq-app-v0-1 -->
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vitePlugin as remix } from "@remix-run/dev";

export default defineConfig({
  plugins: [tsconfigPaths(), remix()],
  server: {
    port: Number(process.env.PORT || 8083),
    host: true,
    strictPort: true,
  },
  // <!-- BEGIN RBP GENERATED: rbp-hq-app-bridge-fix-v1 -->
  optimizeDeps: {
    include: ["@shopify/app-bridge", "@shopify/app-bridge/actions"],
  },
  // <!-- END RBP GENERATED: rbp-hq-app-bridge-fix-v1 -->
});
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
