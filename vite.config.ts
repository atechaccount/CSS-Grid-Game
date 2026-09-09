import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Public path of the production GitHub Pages site at https://atechaccount.github.io/CSS-Grid-Game/. */
const productionPagesBasePath = "/CSS-Grid-Game/";

/**
 * Public path the build should assume, overridable so a pull request preview can be
 * published under /CSS-Grid-Game/pr-preview/pr-<number>/ instead of the production root.
 */
const skydockBasePath = process.env.SKYDOCK_BASE_PATH || productionPagesBasePath;

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // The dev server always serves from the root; only builds are deployed under a subpath.
  base: command === "build" ? skydockBasePath : "/",
  plugins: [react(), tailwindcss(), viteSingleFile()],
  server: {
    host: "0.0.0.0",
    port: 5420,
    strictPort: true,
    // Allow the sandboxed preview host (*.e2b.app) so the dev server can be proxied to a browser.
    allowedHosts: [".e2b.app"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
}));
