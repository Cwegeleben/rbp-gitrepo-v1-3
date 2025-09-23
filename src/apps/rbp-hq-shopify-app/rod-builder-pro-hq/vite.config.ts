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
});
// <!-- END RBP GENERATED: rbp-hq-app-v0-1 -->
